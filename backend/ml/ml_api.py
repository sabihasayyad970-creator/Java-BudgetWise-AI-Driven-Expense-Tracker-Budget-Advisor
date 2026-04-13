from flask import Flask, jsonify
from flask_cors import CORS
from ai_analysis import get_analysis
from expense_predictor import predict_next_expense

app = Flask(__name__)
CORS(app)

# ✅ AI Analysis (User-based)
@app.route('/ai-analysis/<int:user_id>', methods=['GET'])
def ai_analysis(user_id):
    try:
        result = get_analysis(user_id)
        return jsonify(result)
    except:
        return jsonify({
            "analysis": "Error generating AI analysis",
            "top_category": "N/A",
            "monthly_trend": "N/A"
        })

# ✅ Prediction (User-based)
@app.route('/predict-expense/<int:user_id>', methods=['GET'])
def predict(user_id):
    try:
        prediction = predict_next_expense(user_id)
        return jsonify({
            "status": "success",
            "predicted_expense": prediction
        })
    except:
        return jsonify({
            "status": "error",
            "message": "Prediction failed"
        })

# ✅ Default routes (optional)
@app.route('/ai-analysis', methods=['GET'])
def ai_analysis_default():
    return jsonify({
        "analysis": "⚠ Please provide userId",
        "top_category": "N/A",
        "monthly_trend": "N/A"
    })

@app.route('/predict-expense', methods=['GET'])
def predict_default():
    return jsonify({
        "status": "error",
        "message": "⚠ Please provide userId"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)