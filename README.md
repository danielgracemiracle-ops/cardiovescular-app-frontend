# 🫀 CardioInsight — Cardiovascular Disease Prediction

CardioInsight is a **machine learning-based web application** designed to predict the risk of cardiovascular disease based on a user's health-related information.

The project combines a **machine learning prediction API** with a modern web interface, allowing users to enter health data and receive a cardiovascular disease prediction in an interactive and easy-to-understand format.

🔗 **Live Demo:** https://cardiovescular-prediction-app.vercel.app/

---

## 📌 Project Overview

Cardiovascular disease is one of the major health concerns worldwide. Early identification of potential risk factors can help users become more aware of their health conditions.

CardioInsight was developed as a machine learning project to demonstrate how health-related data can be processed and used to build a predictive system.

The application allows users to:

* Enter personal and health information
* Submit the data to a machine learning API
* Receive a cardiovascular disease prediction
* View prediction results in an interactive interface
* Review previous prediction results
* Understand important features contributing to the prediction

> **Disclaimer:** CardioInsight is an educational machine learning project and is not intended to provide medical diagnosis or replace professional medical advice.

---

## 🎯 Objectives

The main objectives of CardioInsight are:

1. Build a machine learning model for cardiovascular disease prediction.
2. Develop an API to serve machine learning predictions.
3. Integrate the ML model with a web-based frontend.
4. Present prediction results in a user-friendly interface.
5. Demonstrate an end-to-end machine learning deployment workflow.

---

## 🧠 Machine Learning

The project uses cardiovascular health data to train a classification model.

### Features

The application currently uses health-related features such as:

| Feature                  | Description                |
| ------------------------ | -------------------------- |
| Age                      | User's age                 |
| Gender                   | User's gender              |
| Height                   | Height in centimeters      |
| Weight                   | Weight in kilograms        |
| Systolic Blood Pressure  | Upper blood pressure value |
| Diastolic Blood Pressure | Lower blood pressure value |
| Cholesterol              | Cholesterol level          |
| Glucose                  | Glucose level              |
| Smoking                  | Smoking status             |
| Alcohol                  | Alcohol consumption status |
| Physical Activity        | Physical activity status   |

The model analyzes these variables and produces a cardiovascular disease prediction.

---

## 🤖 Model Development

Several machine learning algorithms were explored during the development process:

* Logistic Regression
* Decision Tree
* Random Forest
* XGBoost

The experiments were evaluated using common classification metrics:

* Accuracy
* Precision
* Recall
* F1-Score

The final deployed prediction pipeline uses an **XGBoost-based model**.

### Model Performance

| Model               | Accuracy | Precision | Recall | F1-Score |
| ------------------- | -------: | --------: | -----: | -------: |
| Logistic Regression |     0.72 |      0.75 |   0.68 |     0.71 |
| Decision Tree       |     0.61 |      0.62 |   0.60 |     0.61 |
| Random Forest       |     0.69 |      0.69 |   0.69 |     0.69 |

These results were obtained during the model experimentation stage.

---

## 🔎 Feature Importance

The deployed model also provides feature importance information to help understand which variables contribute most to the prediction.

Some of the important features identified by the model include:

* Height
* Gender
* Weight
* Physical Activity
* Systolic Blood Pressure
* Diastolic Blood Pressure
* Cholesterol
* Age

Feature importance is presented as an interpretability component and should not be interpreted as medical causation.

---

## 🏗️ System Architecture

```text
┌──────────────────────────────┐
│        User / Browser        │
└──────────────┬───────────────┘
               │
               │ Health Information
               ▼
┌──────────────────────────────┐
│     Next.js Web Frontend     │
│                              │
│ • Health Form                │
│ • Prediction Result          │
│ • Prediction History         │
│ • Data Visualization         │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│      FastAPI Backend         │
│                              │
│ POST /predict                │
│ GET  /health                 │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     XGBoost ML Model         │
│                              │
│ cardio_xgb_model.pkl         │
│ feature_importance.json      │
└──────────────────────────────┘
```

---

## ⚙️ Tech Stack

### Frontend

* Next.js
* React
* JavaScript / TypeScript
* CSS
* Recharts

### Backend

* Python
* FastAPI
* Uvicorn
* Scikit-learn
* XGBoost

### Machine Learning

* Pandas
* NumPy
* Scikit-learn
* XGBoost
* Matplotlib
* Seaborn

### Deployment

* **Vercel** — Frontend
* **Hugging Face Spaces** — ML API

---

## 🚀 Features

### 📝 Health Assessment Form

Users can enter their health information through an interactive form.

### 🧠 ML Prediction

The submitted data is processed by the deployed machine learning model and returned as a prediction.

### 📊 Prediction Result

The application presents the prediction in an easy-to-understand result interface.

### 📈 Feature Importance

Users can view the relative importance of input features used by the model.

### 🕒 Prediction History

Previous prediction results can be displayed so users can review their previous assessments.

### 📄 PDF Export

Prediction results can be exported into a PDF format for documentation purposes.

---

## 🔌 API

The backend provides a REST API for communicating with the machine learning model.

### Health Check

```http
GET /health
```

Used to check whether the prediction service is running.

### Prediction

```http
POST /predict
```

Receives health-related input data and returns the model prediction.

Example request:

```json
{
  "age_years": 45,
  "gender": 1,
  "height": 170,
  "weight": 70,
  "ap_hi": 120,
  "ap_lo": 80,
  "cholesterol": 1,
  "gluc": 1,
  "smoke": 0,
  "alco": 0,
  "active": 1
}
```

---

## 📂 Project Structure

```text
CardioInsight/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── cardio_xgb_model.pkl
│   ├── feature_importance.json
│   └── requirements.txt
│
└── README.md
```

---

## 🖥️ Live Demo

Try the deployed application:

👉 **https://cardiovescular-prediction-app.vercel.app/**

---

## 🔗 Repository

### Frontend

GitHub repository:

`danielgracemiracle-ops/cardiovescular-app-frontend`

### Backend

Machine Learning API:

`dantzy1234/cardio-prediction-api`

---

## 👨‍💻 Skills Demonstrated

This project demonstrates experience in:

* Machine Learning
* Classification
* Exploratory Data Analysis
* Feature Engineering
* Model Evaluation
* XGBoost
* REST API Development
* FastAPI
* Next.js
* React
* Data Visualization
* ML Model Deployment
* Frontend–Backend Integration
* Cloud Deployment

---

## 📚 Learning Outcomes

Through CardioInsight, I gained experience in building an end-to-end machine learning application, starting from data processing and model experimentation to deploying the model as an API and integrating it into a production-style web application.

The project helped me understand that building an ML application involves more than training a model — it also requires **API development, frontend integration, deployment, usability, and model interpretability**.

---

## ⚠️ Disclaimer

CardioInsight is created for **educational and portfolio purposes only**.

The predictions generated by this application should not be considered a medical diagnosis or a substitute for consultation with a qualified healthcare professional.
