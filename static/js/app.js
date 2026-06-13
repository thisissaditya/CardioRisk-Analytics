/* BMI AUTO CALCULATOR */

document.addEventListener("DOMContentLoaded", () => {

    const heightInput =
        document.getElementById("Height_cm");

    const weightInput =
        document.getElementById("Weight_kg");

    const bmiInput =
        document.getElementById("BMI");

    function calculateBMI() {

        const height =
            parseFloat(heightInput.value);

        const weight =
            parseFloat(weightInput.value);

        if (!height || !weight) {
            bmiInput.value = "";
            return;
        }

        const bmi =
            weight /
            Math.pow(height / 100, 2);

        bmiInput.value =
            bmi.toFixed(2);
            updateHealthSummary();
    }

    heightInput.addEventListener(
        "input",
        calculateBMI
    );

    weightInput.addEventListener(
        "input",
        calculateBMI
    );

    calculateBMI();

});

const form = document.getElementById("predictionForm");

let modelChart = null;

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const data = {

        "General_Health":
            document.getElementById("General_Health").value,

        "Checkup":
            document.getElementById("Checkup").value,

        "Exercise":
            document.getElementById("Exercise").value,

        "Skin_Cancer":
            "No",

        "Other_Cancer":
            "No",

        "Depression":
            "No",

        "Diabetes":
            document.getElementById("Diabetes").value,

        "Arthritis":
            "No",

        "Sex":
            document.getElementById("Sex").value,

        "Age_Category":
            document.getElementById("Age_Category").value,

        "Height_(cm)":
            parseFloat(
                document.getElementById("Height_cm").value
            ),

        "Weight_(kg)":
            parseFloat(
                document.getElementById("Weight_kg").value
            ),

        "BMI":
            parseFloat(
                document.getElementById("BMI").value
            ),

        "Smoking_History":
            document.getElementById("Smoking_History").value,

        "Alcohol_Consumption":
            4,

        "Fruit_Consumption":
            30,

        "Green_Vegetables_Consumption":
            30,

        "FriedPotato_Consumption":
            4
    };
    const btn =
    document.querySelector(".predict-btn");

    try {

        document.getElementById("riskLevel").innerText = "Analyzing patient data...";

        
        btn.disabled = true;
        btn.innerText = "Predicting...";

        const response = await fetch(
            "/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!result.success) {
            alert(result.error);
            return;
        }

        document.getElementById("overallRisk").innerText =
            result.overall_risk + "%";

        animateGauge(result.overall_risk);

        document.getElementById("riskLevel").innerText =
            result.risk_level;
        const riskText =
         document.getElementById("riskLevel");

        const badge =
         document.getElementById("riskBadge");

if(result.risk_level === "Low Risk"){

    riskText.style.color =
    "#22c55e";

    badge.textContent =
    "LOW";

    badge.style.background =
    "#22c55e";
}

else if(
    result.risk_level ===
    "Moderate Risk")
{

    riskText.style.color =
    "#f59e0b";

    badge.textContent =
    "MODERATE";

    badge.style.background =
    "#f59e0b";
}

else{

    riskText.style.color =
    "#ef4444";

    badge.textContent =
    "HIGH";

    badge.style.background =
    "#ef4444";
}

animateValue(
    "rfScore",
    result.random_forest
);

animateValue(
    "lrScore",
    result.logistic_regression
);

animateValue(
    "nnScore",
    result.neural_network
);

        const list =
            document.getElementById(
                "recommendationList"
            );

        list.innerHTML = "";

        if(result.overall_risk < 30){

            list.innerHTML +=
            "<li>Maintain regular exercise</li>";

            list.innerHTML +=
            "<li>Continue healthy eating habits</li>";

            list.innerHTML +=
            "<li>Schedule routine health checkups</li>";

        }
        else if(result.overall_risk < 60){

            list.innerHTML +=
            "<li>Increase weekly physical activity</li>";

            list.innerHTML +=
            "<li>Reduce processed food intake</li>";

            list.innerHTML +=
                    "<li>Monitor blood pressure regularly</li>";

            list.innerHTML +=
            "<li>Track BMI and weight changes</li>";

}
        else{

            ist.innerHTML +=
            "<li>Consult a healthcare professional</li>";

            list.innerHTML +=
            "<li>Stop smoking immediately</li>";

            list.innerHTML +=
            "<li>Follow a heart-healthy diet</li>";

            list.innerHTML +=
            "<li>Schedule cardiovascular screening</li>";

}
        renderChart(
            result.random_forest,
            result.logistic_regression,
            result.neural_network
        );
        btn.disabled = false;
        btn.innerText = "Predict Risk";

}   
    catch (error) {

    btn.disabled = false;
    btn.innerText = "Predict Risk";

    console.error(error);

    alert(
        "Prediction failed. Check browser console."
    );
}
});

function renderChart(rf, lr, nn) {

    const ctx =
        document.getElementById(
            "modelChart"
        );

    if (modelChart) {
        modelChart.destroy();
    }

    modelChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Random Forest",
                "Logistic Regression",
                "Neural Network"
            ],

            datasets: [
                {
                    label: "Risk Probability (%)",

                    data: [
                        rf,
                        lr,
                        nn
                    ],

                    backgroundColor: [
                        "#3b82f6",
                        "#8b5cf6",
                        "#14b8a6"
                    ]
                }
            ]
        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100
                }
            }
        }
    });
}
function updateHealthSummary(){
    

    const bmi =
        parseFloat(
            document.getElementById("BMI").value
        );

    let bmiStatus = "Normal";

    if(bmi < 18.5)
        bmiStatus = "Underweight";
    else if(bmi < 25)
        bmiStatus = "Normal";
    else if(bmi < 30)
        bmiStatus = "Overweight";
    else
        bmiStatus = "Obese";

    document.getElementById("bmiStatus").textContent =
        bmiStatus;

    document.getElementById("ageDisplay").textContent =
        document.getElementById("Age_Category").value;

    document.getElementById("exerciseDisplay").textContent =
        document.getElementById("Exercise").value;

    document.getElementById("smokingDisplay").textContent =
        document.getElementById("Smoking_History").value;
        document.getElementById("riskBadge")
    .style.transition = "0.3s";
}
function updateGauge(value){

    const circle =
        document.querySelector(
            ".gauge-progress"
        );

    const radius = 90;

    const circumference =
        2 * Math.PI * radius;

    const offset =
        circumference -
        (value / 100) *
        circumference;

    circle.style.strokeDashoffset =
        offset;

    if(value < 30){

        circle.style.stroke =
            "#22c55e";

    }

    else if(value < 60){

        circle.style.stroke =
            "#f59e0b";

    }

    else{

        circle.style.stroke =
            "#ef4444";

    }
}

function animateGauge(target){

    let current = 0;

    const interval = setInterval(() => {

        current += 1;

        updateGauge(current);

        document.getElementById(
            "overallRisk"
        ).innerText =
            current.toFixed(0) + "%";

        if(current >= target){

            clearInterval(interval);

            document.getElementById(
                "overallRisk"
            ).innerText =
                target.toFixed(2) + "%";
        }

    },15);

}
function animateValue(id, value){

    const element =
        document.getElementById(id);

    if(!element) return;

    let current = 0;

    const interval =
    setInterval(() => {

        current += value / 50;

        if(current >= value){

            current = value;

            clearInterval(interval);
        }

        element.innerText =
            current.toFixed(1) + "%";

    },20);
}