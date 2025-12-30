# backend/rag/database.py
import pandas as pd
import unicodedata
import re
from pathlib import Path
from typing import Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer

def normalize_text(s: str) -> str:
    """텍스트 정규화"""
    s = unicodedata.normalize("NFKC", str(s))
    return re.sub(r"\s+", " ", s).strip()

def read_csv_safely(path: str) -> pd.DataFrame:
    """안전한 CSV 읽기"""
    encodings = ["utf-8", "utf-8-sig", "cp949", "euc-kr", "latin1", "windows-1252", "mac_roman"]
    last_err = None
    for enc in encodings:
        try:
            return pd.read_csv(path, encoding=enc)
        except Exception as e:
            last_err = e
    raise RuntimeError(f"Failed to read CSV. Last error:\n{last_err}")

def infer_cols(df: pd.DataFrame) -> Tuple[str, str, Optional[str]]:
    """컬럼 자동 감지"""
    cols = [c.lower() for c in df.columns]
    bad_cands = {"konglish", "wrong", "bad", "input", "term", "word", "pattern", "phrase", "error", "typo", "original"}
    good_cands = {"natural", "right", "good", "output", "rewrite", "correction", "fix", "native", "suggestion", "target"}
    
    bad = next((c for c in df.columns if c.lower() in bad_cands), None)
    good = next((c for c in df.columns if c.lower() in good_cands), None)
    
    if bad is None and "input" in cols:
        bad = df.columns[cols.index("input")]
    if good is None and "output" in cols:
        good = df.columns[cols.index("output")]
        
    if bad is None or good is None:
        textish = [c for c in df.columns if df[c].dtype == object]
        if len(textish) >= 2:
            bad = bad or textish[0]
            good = good or textish[1]
    
    ctx_candidates = ["context", "example", "desc", "note", "explain", "korean", "source"]
    ctx = next((c for c in ctx_candidates if c in df.columns), None)
    
    if bad is None or good is None:
        raise ValueError("Couldn't infer BAD/GOOD columns")
    
    return bad, good, ctx

class RAGDatabase:
    """RAG 데이터베이스 관리"""
    
    def __init__(self, csv_path: Path):
        self.csv_path = csv_path
        self.db = None
        self.vectorizer = None
        self.tfidf_mat = None
        self.bad_col = None
        self.good_col = None
        self.ctx_col = None
        
    def load(self):
        """데이터베이스 로드 및 인덱싱"""
        df = read_csv_safely(str(self.csv_path))
        print(f"📋 RAG database columns: {list(df.columns)}")
        
        _df = df.copy()
        _df.columns = [str(c).strip() for c in _df.columns]
        
        self.bad_col, self.good_col, self.ctx_col = infer_cols(_df)
        print(f"🏷️  Using BAD_COL='{self.bad_col}', GOOD_COL='{self.good_col}', CTX_COL='{self.ctx_col}'")
        
        cols_to_keep = [self.bad_col, self.good_col]
        if self.ctx_col:
            cols_to_keep.append(self.ctx_col)
        
        self.db = _df[cols_to_keep].dropna().drop_duplicates().reset_index(drop=True)
        self.db[self.bad_col] = self.db[self.bad_col].map(normalize_text)
        self.db[self.good_col] = self.db[self.good_col].map(normalize_text)
        if self.ctx_col:
            self.db[self.ctx_col] = self.db[self.ctx_col].map(normalize_text)
        
        # TF-IDF 인덱싱
        index_text = self.db[self.bad_col].astype(str)
        if self.ctx_col:
            index_text = index_text + " || " + self.db[self.ctx_col].astype(str)
        
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            analyzer="word",
            token_pattern=r"(?u)\b\w[\w'-]*\b",
            lowercase=True,
            min_df=1,
            max_df=0.95
        )
        self.tfidf_mat = self.vectorizer.fit_transform(index_text.values.tolist())
        
        print(f"🔍 RAG database loaded and indexed: {self.tfidf_mat.shape[0]} entries")