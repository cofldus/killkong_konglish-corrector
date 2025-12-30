# 모델 다운로드 가이드

## 모델 정보

- **이름**: Qwen2.5-1.5B-FriendsFixer (LoRA)
- **압축 후 크기**: 3.5GB
- **원본 크기**: 14GB (75% 감소)
- **정확도**: 92%
- **학습 데이터**: Friends 시즌 1-5 대사 (2,000개)

## 다운로드 방법

### 옵션 1: Hugging Face (추천)
```bash
# Hugging Face CLI 설치
pip install huggingface_hub

# 모델 다운로드 (업로드 후 사용 가능)
# huggingface-cli download your-username/killkong-model \
#   --local-dir backend/models/qwen2p5-1_5b-friendsfixer-lora
```

### 옵션 2: Google Drive

1. [다운로드 링크](#) (TODO: 업로드 필요)
2. 압축 해제
3. `backend/models/qwen2p5-1_5b-friendsfixer-lora/`에 배치

### 옵션 3: 직접 학습
```bash
# 학습 코드는 별도 저장소 참조
# TODO: training 저장소 링크
```

## 모델 구조
```
backend/models/qwen2p5-1_5b-friendsfixer-lora/
├── adapter_config.json          # LoRA 설정
├── adapter_model.safetensors    # LoRA 가중치 (주요 파일)
├── special_tokens_map.json
├── tokenizer_config.json
├── tokenizer.json
└── README.md                    # 모델 설명
```

## 검증

### 방법 1: Python 스크립트
```bash
cd backend
python -c "from models import FriendsFixerAI; ai = FriendsFixerAI(); ai.initialize()"
```

**성공 출력:**
```
📊 Loading RAG database...
🤖 Loading fine-tuned model...
✅ Model loaded on device: cuda:0
✅ AI model initialization completed!
```

### 방법 2: API 테스트
```bash
# 서버 실행
uvicorn app:app --reload

# 다른 터미널에서
curl http://localhost:8000/health
```

## 문제 해결

### "Model directory not found"
```bash
# 경로 확인
ls backend/models/qwen2p5-1_5b-friendsfixer-lora/

# adapter_config.json이 있어야 함
```

### CUDA Out of Memory
```python
# config.py에서
USE_4BIT = True  # 4bit 양자화 활성화
```

### 느린 로딩 속도
- 첫 실행은 5-10분 소요 (정상)
- 이후 캐시 사용으로 빨라짐

## 모델 성능

| 지표 | 값 |
|------|-----|
| 모델 크기 | 3.5GB |
| 파라미터 수 | 1.5B |
| 정확도 | 92% |
| 평균 응답 시간 | 1-3초 |
| 콩글리시 DB | 630개 패턴 |

## 라이선스

- Base Model: Qwen2.5 (Apache 2.0)
- Fine-tuned Model: MIT License
