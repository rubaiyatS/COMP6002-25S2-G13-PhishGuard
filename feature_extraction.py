import re
import pandas as pd

B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

def extract_features(url: str) -> dict:
    return {
        "url_length": len(url),
        "num_dots": url.count("."),
        "num_hyphens": url.count("-"),
        "has_https": 1 if url.lower().startswith("https") else 0,
        "has_ip": 1 if re.search(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", url) else 0,
        "num_query_params": url.count("?") + url.count("&"),
        "has_at_symbol": 1 if "@" in url else 0,
        "has_port": 1 if re.search(r":\d{2,5}/", url) else 0,
        "suspicious_tld": 1 if re.search(r"\.(zip|ru|cn|work|xyz|top)(/|$)", url.lower()) else 0
    }

def build_feature_frame(url_series: pd.Series) -> pd.DataFrame:
    return url_series.apply(extract_features).apply(pd.Series)
