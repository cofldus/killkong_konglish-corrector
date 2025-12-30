# 🦍 KillKong

> 한국인 특화 콩글리시 교정 & 현지 회화체 변환 AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]

[![GitHub Stars](https://img.shields.io/github/stars/cofldus/killkong_konglish-corrector?style=for-the-badge)](https://github.com/cofldus/killkong_konglish-corrector/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/cofldus/killkong_konglish-corrector?style=for-the-badge)](https://github.com/cofldus/killkong_konglish-corrector/network)
[![GitHub Issues](https://img.shields.io/github/issues/cofldus/killkong_konglish-corrector?style=for-the-badge)](https://github.com/cofldus/killkong_konglish-corrector/issues)
(https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg)](https://fastapi.tiangolo.com)

**POSCO 청년 AI BIG DATA 아카데미 30기 A4조**

---

## 📌 주요 기능

- 🎯 **콩글리시 자동 감지 및 교정** - 630개 패턴 데이터베이스 기반
- 💬 **Friends 스타일 자연스러운 회화체 변환** - 시트콤 대사로 학습
- 🧠 **개인화 학습 메모리 시스템** - 반복 오류 추적 및 맞춤 피드백
- 📊 **RAG 기반 정확한 교정** - TF-IDF + 코사인 유사도
- ⚡ **경량화 모델** - 14GB → 3.5GB (75% 감소)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- CUDA 11.8+ (GPU 권장)
- 8GB+ RAM

### Installation
```bash
# 1. Clone
git clone https://github.com/cofldus/killkong_konglish-corrector.git
cd killkong_konglish-corrector

# 2. Backend Setup
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 3. Download Model (see docs/MODEL.md)
# Place model in: backend/models/qwen2p5-1_5b-friendsfixer-lora/

# 4. Run Server
uvicorn app:app --reload
```

서버: http://localhost:8000

### Docker (추천)
```bash
docker-compose up -d
```

---

## 💡 사용 예시

### API 호출
```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/chat",
    json={
        "message": "I want to buy a hand phone",
        "show_hints": True
    }
)

print(response.json())
```

**응답:**
```json
{
  "response": "'hand phone' is Konglish—people just say 'cell phone'.\nAnyway, what kind are you looking for?",
  "hints": [{
    "konglish": "hand phone",
    "natural": "cell phone",
    "sim": 0.95
  }],
  "processing_time": 1.2
}
```

---

## 📊 성능

| 지표 | 값 |
|------|-----|
| 모델 크기 | 14GB → **3.5GB** (75% ↓) |
| 정확도 | **92%** |
| 평균 응답 시간 | 1-3초 |
| 콩글리시 DB | **630개** 패턴 |
| 학습 데이터 | Friends 시즌 1-5 (2,000개) |

---

## 🏗️ 기술 스택

### Backend
- **Model**: Qwen2.5-1.5B + LoRA Fine-tuning
- **Framework**: FastAPI + Uvicorn
- **RAG**: FAISS + TF-IDF + Scikit-learn
- **ML**: PyTorch + Transformers + PEFT

### Frontend
- **Framework**: React Native
- **State**: React Hooks
- **API**: Fetch API

### Infrastructure
- **Container**: Docker + Docker Compose
- **Database**: SQLite (Memory)

---

## 📁 프로젝트 구조
```
killkong/
├── backend/
│   ├── app.py              # FastAPI 앱
│   ├── config.py           # 설정
│   ├── models/
│   │   └── qwen_model.py   # AI 모델
│   ├── rag/
│   │   ├── database.py     # RAG DB
│   │   └── retriever.py    # 검색 엔진
│   └── utils/
│       └── text_processing.py
├── frontend/               # React Native
├── data/
│   └── RAGdb_final.csv    # 콩글리시 DB (630개)
├── docs/
│   ├── SETUP.md           # 설치 가이드
│   ├── API.md             # API 문서
│   └── MODEL.md           # 모델 가이드
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🎓 타 LLM과의 차별점

| 기능 | GPT-4 | Gemini | Claude | **KillKong** |
|------|-------|--------|---------|-------------|
| 콩글리시 전용 DB | ❌ | ❌ | ❌ | ✅ (630개) |
| 현지 회화체 학습 | ❌ | ❌ | ❌ | ✅ (Friends) |
| 개인화 메모리 | ⚠️ | ⚠️ | ⚠️ | ✅ |
| 경량화 모델 | ❌ | ❌ | ❌ | ✅ (3.5GB) |
| 한국인 특화 | ❌ | ❌ | ❌ | ✅ |

### 비교 예시

**입력:** "I met black consumers at work"

- **GPT-4**: 인종 관련 의미로 해석 ❌
- **KillKong**: "black consumer → problematic customer" ✅

---

## 📖 문서

- [설치 가이드](docs/SETUP.md)
- [API 문서](docs/API.md)
- [모델 다운로드](docs/MODEL.md)

---

## 🤝 기여

Issue와 PR을 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 👥 Team A4

**POSCO 청년 AI BIG DATA 아카데미 30기**

- 곽태현 - Data & ML
- 백동선 - Backend & Model
- 이영주 - PM & Planning
- 이지원 - Frontend & Design
- 이지은 - Data & Analysis
- 이채연 - Team Lead & Integration

---

## 📞 Contact

- Project Link: [https://github.com/cofldus/killkong_konglish-corrector](https://github.com/cofldus/killkong_konglish-corrector)
- Report: [A4_KILLKONG_최종보고서.pdf](docs/A4_KILLKONG_최종보고서.pdf)

---

## 🙏 Acknowledgments

- [Qwen2.5](https://github.com/QwenLM/Qwen) - Base Model
- [Friends Scripts](https://www.livesinabox.com/friends/) - Training Data
- POSCO Academy - Education & Support

---

Made with ❤️ by Team A4

