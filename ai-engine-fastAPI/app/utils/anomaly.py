import pandas as pd
from datetime import date
from sklearn.ensemble import IsolationForest
from app.services.budget_insights import budget_insight

# Define a function
def anomaly_detection(expenses):
    df=pd.DataFrame(expenses)

# Train the anomaly detector
    model=IsolationForest(contamination=0.1,random_state=42)
    df["anomaly"]=model.fit_predict(df[["expense_amount"]])

    result= df.to_dict(orient="records")
    avg_amount=df['expense_amount'].mean()
    standard_amount=df['expense_amount'].std()
    today=str(date.today())
    today_expense=df[df['created_at']==today]['expense_amount'].sum()

    insight=[]
    if today_expense > avg_amount + standard_amount:
        insight.append(
            f"Today's expense {today_expense:.2f} is litte high than the average expense {avg_amount:.2f}"
        )
    elif today_expense > avg_amount + 2*standard_amount:
         insight.append(
            f"Today's expense {today_expense:.2f} is much higher than the average expense {avg_amount:.2f}"
        )
    elif today_expense < avg_amount - standard_amount:
        insight.append(
            f"Today's expense {today_expense:.2f} is lower than the average expense {avg_amount:.2f}"
        )
    else:
      insight.append(
            f"Today's expense normal"
        )
    for rows in result:
        if rows['anomaly'] ==-1 and rows['expense_amount']>avg_amount:
            insight.append(
                f"The expense Rs {rows['expense_amount']} in {rows['category']} " 
                f"is little   higher than your average expense Rs {avg_amount}"
            )
    return {
        "insight":insight,
        "results":result
    }
