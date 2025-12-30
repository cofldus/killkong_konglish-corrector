# backend/config.py
import os
from pathlib import Path

# 프로젝트 루트
BASE_DIR = Path(__file__).parent.parent

class Config:
    """애플리케이션 설정"""
    
    # Model
    BASE_MODEL = "Qwen/Qwen2.5-1.5B-Instruct"
    MODEL_DIR = BASE_DIR / "backend" / "models" / "qwen2p5-1_5b-friendsfixer-lora"
    
    # Generation
    MAX_NEW_TOKENS = 196
    TEMPERATURE = 0.9
    TOP_P = 0.90
    TOP_K = 40
    REPETITION_PENALTY = 1.05
    RERANK_N = 3
    
    # Device
    USE_4BIT = True
    COMPUTE_DTYPE_BF16 = True
    DEVICE = "cuda"  # torch에서 자동 감지
    
    # RAG
    RAG_DB_PATH = BASE_DIR / "data" / "RAGdb_final.csv"
    RAG_TOP_K = 4
    RAG_MIN_SIM = 0.22
    RAG_STAGE = "both"  # "pre" | "post" | "both"
    POST_MIN_SIM = 0.35
    BLOCK_BAD_TOKENS = True
    
    # K-note
    K_NOTE_SIM_TH = 0.28
    K_NOTE_CONNECTORS = ["Anyway,", "By the way,", "Oh, and", "On that note,", "Also,"]
    K_NOTE_ENFORCE = True
    
    # Random seed
    SEED = 42
    
    @classmethod
    def validate(cls):
        """설정 검증"""
        if not cls.MODEL_DIR.exists():
            print(f"⚠️  Model directory not found: {cls.MODEL_DIR}")
        if not cls.RAG_DB_PATH.exists():
            print(f"⚠️  RAG database not found: {cls.RAG_DB_PATH}")
        return cls

config = Config.validate()