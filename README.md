# KillKong

한국인 특화 콩글리시 교정 & 현지 회화체 변환 AI

## 주요 기능
- 🎯 콩글리시 자동 감지 및 교정
- 💬 Friends 스타일 자연스러운 회화체 변환
- 🧠 개인화 학습 메모리 시스템
- 📊 RAG 기반 정확한 교정

## Tech Stack
- **Model**: Qwen2.5-1.5B + LoRA (3.5GB)
- **Backend**: FastAPI + Python
- **Frontend**: React Native
- **RAG**: FAISS + TF-IDF
- **Database**: SQLite

## Quick Start
```bash
# 모델 다운로드 필요 (별도 안내)
# Backend
cd backend
pip install -r requirements.txt
uvicorn app:app --reload

# Frontend
cd frontend
npm install
npm start
```

## 성능
- 모델 크기: 14GB → 3.5GB (75% 감소)
- 정확도: 92%
- 콩글리시 DB: 630개 패턴

## 프로젝트 배경
POSCO 청년 AI BIG DATA 아카데미 30기 A4조

## License
MIT
