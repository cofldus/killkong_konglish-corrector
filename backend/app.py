# backend/app.py
import sys
import os
import logging
from datetime import datetime
from pathlib import Path

# Windows 한글 인코딩 문제 해결
if sys.platform == "win32":
    os.environ["PYTHONIOENCODING"] = "utf-8"

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from config import config
from models import FriendsFixerAI

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# FastAPI 앱 생성
app = FastAPI(
    title="KillKong API",
    description="AI-powered Korean-English correction service",
    version="3.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic 모델
class RagHint(BaseModel):
    konglish: str
    natural: str
    why: str = ""
    sim: float

class ChatRequest(BaseModel):
    message: str
    show_hints: bool = False

class ChatResponse(BaseModel):
    response: str
    hints: Optional[List[RagHint]] = None
    processing_time: float
    model_used: str = "qwen2.5-1.5b-friendsfixer"

class HealthResponse(BaseModel):
    status: str
    ai_ready: bool
    files: Dict[str, Any]

# AI 서비스 인스턴스
ai_service = FriendsFixerAI()

@app.on_event("startup")
async def startup_event():
    """앱 시작시 AI 모델 초기화"""
    logger.info("🎯 KillKong API starting...")
    ai_service.initialize()

# API 엔드포인트
@app.get("/", response_class=JSONResponse)
async def root():
    return {
        "message": "KillKong API - Production Version",
        "status": "running",
        "version": "3.0.0",
        "initialized": ai_service.is_initialized,
        "model_loaded": ai_service.model is not None,
        "rag_loaded": ai_service.rag_db is not None
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        ai_ready=ai_service.is_initialized,
        files={
            "model_exists": config.MODEL_DIR.exists(),
            "database_exists": config.RAG_DB_PATH.exists(),
            "model_path": str(config.MODEL_DIR),
            "db_path": str(config.RAG_DB_PATH),
            "model_loaded": ai_service.model is not None,
            "rag_loaded": ai_service.rag_db is not None
        }
    )

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message is empty")
    
    logger.info(f"💬 Chat request: {request.message[:50]}...")
    
    try:
        result = ai_service.generate_response(
            message=request.message,
            show_hints=request.show_hints
        )
        
        logger.info(f"✅ Response generated ({result['processing_time']}s) - {result['model_used']}")
        
        return ChatResponse(**result)
        
    except Exception as e:
        logger.error(f"❌ Chat processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/api/v1/stats")
async def get_stats():
    return {
        "model_initialized": ai_service.is_initialized,
        "device": config.DEVICE,
        "model_loaded": ai_service.model is not None,
        "rag_database_size": len(ai_service.rag_db.db) if ai_service.rag_db and ai_service.rag_db.db is not None else 0,
        "model_config": {
            "base_model": config.BASE_MODEL,
            "max_new_tokens": config.MAX_NEW_TOKENS,
            "temperature": config.TEMPERATURE,
            "top_p": config.TOP_P,
            "rerank_n": config.RERANK_N
        },
        "rag_config": {
            "top_k": config.RAG_TOP_K,
            "min_sim": config.RAG_MIN_SIM,
            "stage": config.RAG_STAGE,
            "k_note_threshold": config.K_NOTE_SIM_TH
        },
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    
    print("🎯 KillKong Backend Starting...")
    print(f"📁 Model path: {config.MODEL_DIR}")
    print(f"📊 RAG DB path: {config.RAG_DB_PATH}")
    print(f"🔧 Device: {config.DEVICE}")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )