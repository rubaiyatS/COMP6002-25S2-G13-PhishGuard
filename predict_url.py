import argparse
import re
import pandas as pd
import joblib

def extract_features(url):
    return {
        'url_length': len(url),
        'num_dots': url.count('.'),
        'num_hyphens': url.count('-'),
        'has_https': int(url.startswith("https")),
        'has_ip': int(bool(re.search(r'\\d+\\.\\d+\\.\\d+\\.\\d+', url)))
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True, help="URL to check (string)")
    parser.add_argument("--model", default="phishing_model_url.pkl", help="Path to trained model")
    args = parser.parse_args()

    # Load model
    model = joblib.load(args.model)

    # Extract features
    features = pd.DataFrame([extract_features(args.url)])

    # Predict
    pred = model.predict(features)[0]
    print("Prediction:", "Phishing" if pred == 1 else "Legitimate")
