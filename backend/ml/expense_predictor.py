import numpy as np
from sklearn.linear_model import LinearRegression
import requests

def fetch_expenses(user_id):
    try:
        res = requests.get(f"http://localhost:8080/api/expenses/user/{user_id}")
        data = res.json()

        data = [e for e in data if e.get("amount") is not None and e.get("date")]
        data = sorted(data, key=lambda x: x["date"])

        expenses = [float(e["amount"]) for e in data]

        if len(expenses) < 2:
            return [10000, 12000, 15000]

        return expenses

    except:
        return [10000, 12000, 15000]

def predict_next_expense(user_id):
    expenses = fetch_expenses(user_id)

    if len(expenses) < 2:
        return sum(expenses) / len(expenses)

    months = np.arange(1, len(expenses) + 1).reshape(-1, 1)
    expenses = np.array(expenses)

    model = LinearRegression()
    model.fit(months, expenses)

    next_month = np.array([[len(expenses) + 1]])

    prediction = model.predict(next_month)

    return max(round(prediction[0], 2), 0)