import requests

def get_analysis(user_id):

    try:
        income_res = requests.get(f"http://localhost:8080/api/income/user/{user_id}")
        expense_res = requests.get(f"http://localhost:8080/api/expenses/user/{user_id}")

        incomes = income_res.json()
        expenses = expense_res.json()

        total_income = sum(i["amount"] for i in incomes)
        total_expense = sum(e["amount"] for e in expenses)
        savings = total_income - total_expense

        category_map = {}
        for e in expenses:
            cat = e.get("category", "Other")
            category_map[cat] = category_map.get(cat, 0) + e["amount"]

        top_category = max(category_map, key=category_map.get) if category_map else "None"

        ratio = (total_expense / total_income) if total_income > 0 else 0

        monthly_trend = "Stable spending"
        if len(expenses) >= 6:
            last = sum(e["amount"] for e in expenses[-3:])
            prev = sum(e["amount"] for e in expenses[-6:-3])

            if last > prev:
                monthly_trend = "📈 Expenses increasing"
            else:
                monthly_trend = "📉 Expenses decreasing"

        if ratio > 1:
            msg = f"⚠️ You are overspending by ₹{abs(savings)}. Reduce spending in {top_category}"
        elif ratio > 0.8:
            msg = f"⚠️ You are spending {int(ratio*100)}% of income. High expenses in {top_category}"
        elif ratio > 0.5:
            msg = f"🙂 Balanced spending. But {top_category} takes most of your budget"
        else:
            msg = f"✅ Excellent savings habit! Keep controlling {top_category} expenses"

        return {
            "total_income": total_income,
            "total_expense": total_expense,
            "savings": savings,
            "analysis": msg,
            "top_category": top_category,
            "monthly_trend": monthly_trend
        }

    except Exception:
        return {
            "analysis": "Error fetching data",
            "top_category": "N/A",
            "monthly_trend": "N/A"
        }