# backend/rag/retriever.py
import numpy as np
from typing import List, Dict
from sklearn.metrics.pairwise import cosine_similarity
from .database import RAGDatabase, normalize_text

class RAGRetriever:
    """RAG 검색 엔진"""
    
    def __init__(self, database: RAGDatabase, top_k: int = 4, min_sim: float = 0.22):
        self.db = database
        self.top_k = top_k
        self.min_sim = min_sim
    
    def retrieve(self, query: str, top_k: int = None, min_sim: float = None) -> List[Dict[str, str]]:
        """유사 문장 검색"""
        if self.db.vectorizer is None or self.db.tfidf_mat is None:
            return []
        
        top_k = top_k or self.top_k
        min_sim = min_sim or self.min_sim
        
        try:
            q_vec = self.db.vectorizer.transform([normalize_text(query)])
            sims = cosine_similarity(q_vec, self.db.tfidf_mat)[0]
            idxs = np.argsort(-sims)[:top_k * 3]
            
            pairs, seen_bad = [], set()
            for i in idxs:
                sim = float(sims[i])
                if sim < min_sim:
                    continue
                
                bad = self.db.db.iloc[i][self.db.bad_col]
                if bad in seen_bad:
                    continue
                    
                seen_bad.add(bad)
                good = self.db.db.iloc[i][self.db.good_col]
                ctx = self.db.db.iloc[i][self.db.ctx_col] if self.db.ctx_col else ""
                
                pairs.append({
                    "konglish": bad,
                    "natural": good,
                    "why": ctx,
                    "sim": round(sim, 4)
                })
                
                if len(pairs) >= top_k:
                    break
            
            return pairs
            
        except Exception as e:
            print(f"❌ RAG retrieval failed: {e}")
            return []