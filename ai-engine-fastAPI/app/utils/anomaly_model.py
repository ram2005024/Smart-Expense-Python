import pandas as pd
from datetime import datetime
import uuid


class AnomalyDetection:
    @staticmethod
    def get_duplication(df, window_size=2):
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
                anomalies.append(
                    {
                        "id": str(uuid.uuid4()),
                        "type": "duplicate",
                        "expense_name": curr["expense_name"],
                        "expense_amount": int(curr["expense_amount"]),
                        "index": i,
                        "created_at": datetime.now().isoformat(),
                        "time_diff": round(timediff),
                    }
                )
        return anomalies

    @staticmethod
    def get_spike(df, threshold=1.5):
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
            # Calculate the z-index for the given item in the group
            for i, row in group.iterrows():
                z = (row["expense_amount"] - mean) / sd
                if z > threshold:
                    anomalies.append(
                        {
                            "id": str(uuid.uuid4()),
                            "index": i,
                            "expense_name": row["expense_name"],
                            "expense_amount": row["expense_amount"],
                            "expense_category": expense_category,
                            "type": "spike",
                            "created_at": datetime.now().isoformat(),
                        }
                    )
        return anomalies

    @staticmethod
    def get_recurring_anomaly(df, amount_threshold=2, frequency_tolerence=0.8):
        # Group all the data by expense_name
        anomalies = []
        if df.empty:
            return []
        grouped = df.groupby("expense_name")
        # Loop All the grouped data to find

        for expense_name, group in grouped:
            # If not enough data continue the loop
            if len(group) < 3:
                continue
            group.sort_values(by="created_at", inplace=True)
            # Amount_change-------------->
            # find the average expense_amount of certain group
            average = group["expense_amount"].mean()
            for index, row in group.iterrows():
                if row["expense_amount"] > average * amount_threshold:
                    anomalies.append(
                        {
                            "id": str(uuid.uuid4()),
                            "index": index,
                            "expense_name": expense_name,
                            "expense_category": row["expense_category"],
                            "expense_amount": int(row["expense_amount"]),
                            "type": "recurring_amount",
                            "average": int(average),
                            "created_at": datetime.now().isoformat(),
                        }
                    )
        # Recurring_frequency pattern change-------------->
        # Find the average day gap
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
                        anomalies.append(
                            {
                                "id": str(uuid.uuid4()),
                                "expense_name": expense_name,
                                "type": "recurring_gap",
                                "day_gap": gap,
                                "average_gap_lower": int(
                                    average_gap * frequency_tolerence
                                ),
                                "average_gap_upper": int(
                                    average_gap * (1 + frequency_tolerence)
                                ),
                                "index": index,
                                "created_at": datetime.now().isoformat(),
                            }
                        )
        return anomalies

    @staticmethod
    def get_timing_anomaly(df, z_threshold=1.3):
        anomalies = []
        if df.empty:
            return []
        # Get the hours column for the given dataframe
        df["hour"] = pd.to_datetime(df["created_at"]).dt.hour
        # Check the length of the given data
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
                anomalies.append(
                    {
                        "id": str(uuid.uuid4()),
                        "index": index,
                        "type": "temporal",
                        "risk": risk,
                        "reason": "Spending at unusual time",
                        "expense_name": row["expense_name"],
                        "expense_amount": row["expense_amount"],
                        "expense_time": f"{hour}{"AM" if row["hour"]<12 else "PM"}",
                        "created_at": datetime.now().isoformat(),
                    }
                )
        return anomalies
