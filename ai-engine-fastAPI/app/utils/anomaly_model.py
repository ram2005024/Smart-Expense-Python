import pandas as pd
from datetime import datetime, timezone
import uuid
from sqlalchemy.orm import Session
from app.models.anomaly_state import AnomalyState


class AnomalyDetection:
    @staticmethod
    def get_duplication(df, user_id, db: Session, window_size=2):
        anomalies = []
        if df.empty:
            return []
        df["created_at"] = pd.to_datetime(df["created_at"], format="ISO8601")
        for i in range(1, len(df)):
            prev = df.iloc[i - 1]
            curr = df.iloc[i]
            timediff = abs(
                (curr["created_at"] - prev["created_at"]).total_seconds() / 60
            )
            if (
                prev["expense_amount"] == curr["expense_amount"]
                and prev["expense_category"] == curr["expense_category"]
                and timediff <= window_size
            ):
                reference_id = f"duplicate-{curr['id']}-{prev['id']}"
                exist = (
                    db.query(AnomalyState)
                    .filter(
                        AnomalyState.user_id == user_id,
                        AnomalyState.reference_id == reference_id,
                    )
                    .first()
                )
                if exist:
                    anomalies.append(
                        {
                            "id": str(uuid.uuid4()),
                            "type": "duplicate",
                            "expense_name": curr["expense_name"],
                            "expense_amount": int(curr["expense_amount"]),
                            "index": i,
                            "risk": "High" if timediff <= 1 else "Low",
                            "created_at": exist.created_at,
                            "time_diff": round(timediff),
                            "reference_id": reference_id,
                        }
                    )
                else:
                    new_state = AnomalyState(
                        user_id=user_id, reference_id=reference_id, mark_safe=False
                    )
                    db.add(new_state)
                    db.commit()
                    db.refresh(new_state)
                    anomalies.append(
                        {
                            "id": str(uuid.uuid4()),
                            "type": "duplicate",
                            "expense_name": curr["expense_name"],
                            "expense_amount": int(curr["expense_amount"]),
                            "index": i,
                            "created_at": datetime.now().isoformat(),
                            "time_diff": round(timediff),
                            "reference_id": reference_id,
                        }
                    )
        return anomalies

    @staticmethod
    def get_spike(df, user_id: int, db: Session, threshold=1.5):
        anomalies = []
        if df.empty:
            return []

        # Group the dataframe by category
        grouped = df.groupby("expense_category")

        for expense_category, group in grouped:
            mean = group["expense_amount"].mean()
            sd = group["expense_amount"].std()
            if sd == 0 or pd.isna(sd):
                continue

            # Calculate the z-index for each item in the group
            for i, row in group.iterrows():
                z = (row["expense_amount"] - mean) / sd
                if z > threshold:
                    reference_id = f"spike-{row['id']}"

                    exist = (
                        db.query(AnomalyState)
                        .filter(
                            AnomalyState.user_id == user_id,
                            AnomalyState.reference_id == reference_id,
                        )
                        .first()
                    )

                    if exist:
                        anomalies.append(
                            {
                                "id": str(uuid.uuid4()),
                                "index": i,
                                "risk": (
                                    "High"
                                    if z > threshold + 0.4
                                    else "Low" if z > threshold + 0.2 else "Medium"
                                ),
                                "expense_name": row["expense_name"],
                                "expense_amount": row["expense_amount"],
                                "expense_category": expense_category,
                                "type": "spike",
                                "created_at": (
                                    exist.created_at.isoformat()
                                    if hasattr(exist, "created_at")
                                    else None
                                ),
                                "reference_id": reference_id,
                                "z_score": round(z, 2),
                            }
                        )
                    else:
                        new_state = AnomalyState(
                            user_id=user_id, reference_id=reference_id, mark_safe=False
                        )
                        db.add(new_state)
                        db.commit()
                        db.refresh(new_state)

                        anomalies.append(
                            {
                                "id": str(uuid.uuid4()),
                                "index": i,
                                "expense_name": row["expense_name"],
                                "expense_amount": row["expense_amount"],
                                "expense_category": expense_category,
                                "type": "spike",
                                "created_at": datetime.now(timezone.utc),
                                "reference_id": reference_id,
                                "z_score": round(z, 2),
                            }
                        )

        return anomalies

    @staticmethod
    def get_recurring_anomaly(
        df, user_id: int, db: Session, amount_threshold=2, frequency_tolerence=0.8
    ):
        anomalies = []
        if df.empty:
            return []

        grouped = df.groupby("expense_name")

        # Amount-based recurring anomalies
        for expense_name, group in grouped:
            if len(group) < 3:
                continue
            group.sort_values(by="created_at", inplace=True)
            average = group["expense_amount"].mean()

            for index, row in group.iterrows():
                if row["expense_amount"] > average * amount_threshold:
                    reference_id = f"recurring-{row['id']}"

                    exist = (
                        db.query(AnomalyState)
                        .filter(
                            AnomalyState.user_id == user_id,
                            AnomalyState.reference_id == reference_id,
                        )
                        .first()
                    )

                    if exist:
                        anomalies.append(
                            {
                                "id": str(uuid.uuid4()),
                                "index": index,
                                "risk": (
                                    "High"
                                    if row["expense_amount"]
                                    > average * (amount_threshold + 1.2)
                                    else "Medium"
                                ),
                                "expense_name": expense_name,
                                "expense_category": row["expense_category"],
                                "expense_amount": int(row["expense_amount"]),
                                "type": "recurring_amount",
                                "average": int(average),
                                "created_at": (
                                    exist.created_at.isoformat()
                                    if hasattr(exist, "created_at")
                                    else None
                                ),
                                "reference_id": reference_id,
                            }
                        )
                    else:
                        new_state = AnomalyState(
                            user_id=user_id, reference_id=reference_id, mark_safe=False
                        )
                        db.add(new_state)
                        db.commit()
                        db.refresh(new_state)

                        anomalies.append(
                            {
                                "id": str(uuid.uuid4()),
                                "risk": (
                                    "High"
                                    if row["expense_amount"]
                                    > average * (amount_threshold + 1.2)
                                    else "Medium"
                                ),
                                "index": index,
                                "expense_name": expense_name,
                                "expense_category": row["expense_category"],
                                "expense_amount": int(row["expense_amount"]),
                                "type": "recurring_amount",
                                "average": int(average),
                                "created_at": datetime.now(timezone.utc).isoformat(),
                                "reference_id": reference_id,
                            }
                        )

        # Frequency-based recurring anomalies
        for expense_name, group in grouped:
            if len(group) < 3:
                continue
            group.sort_values(by="created_at", inplace=True)
            group["gap"] = group["created_at"].diff().dt.days
            average_gap = group["gap"].dropna().mean()

            if average_gap:
                for index, row in group.iterrows():
                    gap = row["gap"]
                    if pd.notna(gap) and (
                        gap < average_gap * frequency_tolerence
                        or gap > average_gap * (1 + frequency_tolerence)
                    ):
                        reference_id = f"recurring-gap-{row['id']}"

                        exist = (
                            db.query(AnomalyState)
                            .filter(
                                AnomalyState.user_id == user_id,
                                AnomalyState.reference_id == reference_id,
                            )
                            .first()
                        )

                        if exist:
                            anomalies.append(
                                {
                                    "id": str(uuid.uuid4()),
                                    "expense_name": expense_name,
                                    "type": "recurring_gap",
                                    "day_gap": gap,
                                    "risk": (
                                        "High"
                                        if gap
                                        < average_gap * (frequency_tolerence + 0.3)
                                        or gap
                                        > average_gap
                                        * (1 + (frequency_tolerence + 0.3))
                                        else "Medium"
                                    ),
                                    "average_gap_lower": int(
                                        average_gap * frequency_tolerence
                                    ),
                                    "average_gap_upper": int(
                                        average_gap * (1 + frequency_tolerence)
                                    ),
                                    "index": index,
                                    "created_at": (
                                        exist.created_at.isoformat()
                                        if hasattr(exist, "created_at")
                                        else None
                                    ),
                                    "reference_id": reference_id,
                                }
                            )
                        else:
                            new_state = AnomalyState(
                                user_id=user_id,
                                reference_id=reference_id,
                                mark_safe=False,
                            )
                            db.add(new_state)
                            db.commit()
                            db.refresh(new_state)

                            anomalies.append(
                                {
                                    "id": str(uuid.uuid4()),
                                    "expense_name": expense_name,
                                    "type": "recurring_gap",
                                    "day_gap": gap,
                                    "risk": (
                                        "High"
                                        if gap
                                        < average_gap * (frequency_tolerence + 0.3)
                                        or gap
                                        > average_gap
                                        * (1 + (frequency_tolerence + 0.3))
                                        else "Medium"
                                    ),
                                    "average_gap_lower": int(
                                        average_gap * frequency_tolerence
                                    ),
                                    "average_gap_upper": int(
                                        average_gap * (1 + frequency_tolerence)
                                    ),
                                    "index": index,
                                    "created_at": datetime.now(
                                        timezone.utc
                                    ).isoformat(),
                                    "reference_id": reference_id,
                                }
                            )

        return anomalies

    @staticmethod
    def get_timing_anomaly(df, user_id: int, db: Session, z_threshold=1.3):
        anomalies = []
        if df.empty:
            return []

        # Extract hour from created_at
        df["hour"] = pd.to_datetime(df["created_at"]).dt.hour

        if len(df) < 5:
            return []

        avg = df["hour"].mean()
        std = df["hour"].std()
        if std == 0:
            return []

        for index, row in df.iterrows():
            z = (row["hour"] - avg) / std
            if abs(z) > z_threshold and row["hour"] not in range(6, 23):
                risk = "low"
                if (
                    "expense_amount" in row
                    and row["expense_amount"] > df["expense_amount"].mean() * 2
                ):
                    risk = "high"

                hour = row["hour"] % 12 or 12
                expense_time = f"{hour}{'AM' if row['hour'] < 12 else 'PM'}"

                reference_id = f"temporal-{row['id']}"

                exist = (
                    db.query(AnomalyState)
                    .filter(
                        AnomalyState.user_id == user_id,
                        AnomalyState.reference_id == reference_id,
                    )
                    .first()
                )

                if exist:
                    anomalies.append(
                        {
                            "id": str(uuid.uuid4()),
                            "index": index,
                            "type": "temporal",
                            "risk": risk,
                            "reason": "Spending at unusual time",
                            "expense_name": row["expense_name"],
                            "expense_amount": row["expense_amount"],
                            "expense_time": expense_time,
                            "created_at": (
                                exist.created_at.isoformat()
                                if hasattr(exist, "created_at")
                                else None
                            ),
                            "reference_id": reference_id,
                            "z_score": round(z, 2),
                        }
                    )
                else:
                    new_state = AnomalyState(
                        user_id=user_id,
                        reference_id=reference_id,
                        mark_safe=False,
                    )
                    db.add(new_state)
                    db.commit()
                    db.refresh(new_state)

                    anomalies.append(
                        {
                            "id": str(uuid.uuid4()),
                            "index": index,
                            "type": "temporal",
                            "risk": risk,
                            "reason": "Spending at unusual time",
                            "expense_name": row["expense_name"],
                            "expense_amount": row["expense_amount"],
                            "expense_time": expense_time,
                            "created_at": datetime.now(timezone.utc).isoformat(),
                            "reference_id": reference_id,
                            "z_score": round(z, 2),
                        }
                    )

        return anomalies
