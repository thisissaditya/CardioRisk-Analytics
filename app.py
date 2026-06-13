from flask import Flask, render_template, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load trained models
rf_model = joblib.load("models/random_forest.pkl")
lr_model = joblib.load("models/logistic_regression.pkl")
nn_model = joblib.load("models/neural_network.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Receive JSON data from frontend
        data = request.get_json()

        # Convert to DataFrame
        df = pd.DataFrame([data])

        # Predict probabilities
        rf_prob = rf_model.predict_proba(df)[0][1]
        lr_prob = lr_model.predict_proba(df)[0][1]
        nn_prob = nn_model.predict_proba(df)[0][1]

        # Average prediction
        overall = (rf_prob + lr_prob + nn_prob) / 3

        # Risk classification
        if overall < 0.30:
            risk_level = "Low Risk"
            recommendations = [
                "Maintain regular exercise",
                "Continue healthy eating habits",
                "Schedule routine health checkups"
            ]

        elif overall < 0.60:
            risk_level = "Moderate Risk"
            recommendations = [
                "Increase weekly physical activity",
                "Reduce fried food intake",
                "Monitor weight and BMI",
                "Consult a healthcare professional"
            ]

        else:
            risk_level = "High Risk"
            recommendations = [
                "Seek medical consultation",
                "Adopt a heart-healthy diet",
                "Reduce smoking and alcohol consumption",
                "Monitor cardiovascular health regularly"
            ]

        return jsonify({
            "success": True,
            "random_forest": round(rf_prob * 100, 2),
            "logistic_regression": round(lr_prob * 100, 2),
            "neural_network": round(nn_prob * 100, 2),
            "overall_risk": round(overall * 100, 2),
            "risk_level": risk_level,
            "recommendations": recommendations
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )