import pandas as pd
import re
import random
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

def make_fake_url(label, idx):
    if label == 1:
        return f"http://{random.randint(10,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(0,255)}/phish{idx}"
    else:
        return f"https://www.example{idx}.com/home"

def extract_features(url):
    return {
        'url_length': len(url),
        'num_dots': url.count('.'),
        'num_hyphens': url.count('-'),
        'has_https': int(url.startswith("https")),
        'has_ip': int(bool(re.search(r'\\d+\\.\\d+\\.\\d+\\.\\d+', url)))
    }

if __name__ == "__main__":
    df = pd.read_csv("Phishing_Legitimate_full.csv")
    df["URL"] = [make_fake_url(lbl, i) for i, lbl in enumerate(df["CLASS_LABEL"])]

    features = df["URL"].apply(extract_features).apply(pd.Series)
    X = features
    y = df["CLASS_LABEL"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

    joblib.dump(model, "phishing_model_url.pkl")
    print("Model trained and saved as phishing_model_url.pkl")
