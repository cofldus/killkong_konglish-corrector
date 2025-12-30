import os
from pathlib import Path
from typing import Dict, Any

def get_config() -> Dict[str, Any]:
    """환경변수와 기본값을 고려한 설정 반환"""
    
    # 기본 경로들
    BASE_DIR = Path(__file__).parent.parent  # app-pospeak 폴더
    
    config = {
        # --- Model paths ---
        "BASE_MODEL": os.getenv("BASE_MODEL", "Qwen/Qwen2.5-1.5B-Instruct"),
        "MODEL_DIR": os.getenv("MODEL_DIR", str(BASE_DIR / "models" / "qwen2p5-1_5b-friendsfixer-lora")),
        "TRUST_REMOTE_CODE": True,
        
        # --- Generation parameters ---
        "max_new_tokens": int(os.getenv("MAX_NEW_TOKENS", "196")),
        "temperature": float(os.getenv("TEMPERATURE", "0.9")),
        "top_p": float(os.getenv("TOP_P", "0.90")),
        "top_k": int(os.getenv("TOP_K", "40")),
        "repetition_penalty": float(os.getenv("REPETITION_PENALTY", "1.05")),
        "RERANK_N": int(os.getenv("RERANK_N", "3")),
        
        # --- Device & quantization ---
        "use_4bit": os.getenv("USE_4BIT", "true").lower() == "true",
        "compute_dtype_bf16": os.getenv("COMPUTE_DTYPE_BF16", "true").lower() == "true",
        
        # --- RAG Database ---
        "DB_CSV": os.getenv("DB_CSV", str(BASE_DIR / "data" / "RAGdb_final.csv")),
        "RAG_TOP_K": int(os.getenv("RAG_TOP_K", "4")),
        "RAG_MIN_SIM": float(os.getenv("RAG_MIN_SIM", "0.22")),
        "BAD_COL_OVERRIDE": os.getenv("BAD_COL_OVERRIDE"),
        "GOOD_COL_OVERRIDE": os.getenv("GOOD_COL_OVERRIDE"),
        "CTX_COL_CANDIDATES": ["context", "example", "desc", "note", "explain", "korean", "source"],
        "SHOW_RAG_HINTS": os.getenv("SHOW_RAG_HINTS", "false").lower() == "true",
        
        # --- Pipeline stage ---
        "RAG_STAGE": os.getenv("RAG_STAGE", "both"),  # "pre" | "post" | "both"
        "POST_MIN_SIM": float(os.getenv("POST_MIN_SIM", "0.35")),
        "BLOCK_BAD_TOKENS": os.getenv("BLOCK_BAD_TOKENS", "true").lower() == "true",
        
        # --- K-note control ---
        "K_NOTE_SIM_TH": float(os.getenv("K_NOTE_SIM_TH", "0.28")),
        "K_NOTE_CONNECTORS": ["Anyway,", "By the way,", "Oh, and", "On that note,", "Also,"],
        "K_NOTE_ENFORCE": os.getenv("K_NOTE_ENFORCE", "true").lower() == "true",
        
        # --- Random seed ---
        "SEED": int(os.getenv("SEED", "42")),
    }
    
    return config