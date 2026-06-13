import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score

print("Loading dataset...")

df = pd.read_csv("data/CVD_cleaned.csv")

# Convert target to numeric
df["Heart_Disease"] = df["Heart_Disease"].map({
    "No": 0,
    "Yes": 1
})

X = df.drop("Heart_Disease", axis=1)
y = df["Heart_Disease"]

# Detect column types
categorical_cols = X.select_dtypes(include="object").columns
numeric_cols = X.select_dtypes(exclude="object").columns

# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_cols
        ),
        (
            "num",
            StandardScaler(),
            numeric_cols
        )
    ]
)

# Random Forest Pipeline
rf_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    ))
])

# Logistic Regression Pipeline
lr_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", LogisticRegression(
        max_iter=5000
    ))
])

# Neural Network Pipeline
nn_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", MLPClassifier(
        hidden_layer_sizes=(32,),
        max_iter=50,
        random_state=42,
        early_stopping=True
    ))
])

print("Splitting data...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
    )

print("Training Random Forest...")
rf_pipeline.fit(X_train, y_train)

print("Training Logistic Regression...")
lr_pipeline.fit(X_train, y_train)

print("Training Neural Network...")
nn_pipeline.fit(X_train, y_train)

# Evaluate
rf_pred = rf_pipeline.predict(X_test)
lr_pred = lr_pipeline.predict(X_test)
nn_pred = nn_pipeline.predict(X_test)

rf_acc = accuracy_score(y_test, rf_pred)
lr_acc = accuracy_score(y_test, lr_pred)
nn_acc = accuracy_score(y_test, nn_pred)

print(f"Random Forest Accuracy: {rf_acc:.4f}")
print(f"Logistic Regression Accuracy: {lr_acc:.4f}")
print(f"Neural Network Accuracy: {nn_acc:.4f}")

# Save models
joblib.dump(
    rf_pipeline,
    "models/random_forest.pkl"
)

joblib.dump(
    lr_pipeline,
    "models/logistic_regression.pkl"
)

joblib.dump(
    nn_pipeline,
    "models/neural_network.pkl"
)

print("\nModels saved successfully!")
print("models/random_forest.pkl")
print("models/logistic_regression.pkl")
print("models/neural_network.pkl")