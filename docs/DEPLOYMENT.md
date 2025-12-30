# KillKong 배포 가이드

## 1. Docker Hub 배포
```bash
# 1. 이미지 빌드
docker build -t your-username/killkong:latest .

# 2. Docker Hub 로그인
docker login

# 3. 푸시
docker push your-username/killkong:latest
```

## 2. Hugging Face Spaces 배포

### 방법 A: Gradio (추천)
```python
# app_gradio.py
import gradio as gr
from backend.models import FriendsFixerAI

ai = FriendsFixerAI()
ai.initialize()

def correct_text(message):
    result = ai.generate_response(message)
    return result['response']

demo = gr.Interface(
    fn=correct_text,
    inputs=gr.Textbox(label="Your English"),
    outputs=gr.Textbox(label="Corrected"),
    title="🦍 KillKong - Konglish Corrector",
    description="AI-powered English correction for Korean speakers"
)

demo.launch()
```

### 방법 B: Docker Space
```dockerfile
# Dockerfile for HF Spaces
FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install -r backend/requirements.txt
RUN pip install gradio
CMD ["python", "app_gradio.py"]
```

## 3. Railway 배포
```bash
# 1. Railway CLI 설치
npm i -g @railway/cli

# 2. 로그인
railway login

# 3. 프로젝트 초기화
railway init

# 4. 배포
railway up
```

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "uvicorn backend.app:app --host 0.0.0.0 --port $PORT"
  }
}
```

## 4. Render 배포

### render.yaml
```yaml
services:
  - type: web
    name: killkong-api
    env: docker
    plan: free
    healthCheckPath: /health
```

## 5. AWS EC2 배포
```bash
# 1. EC2 인스턴스 생성 (Ubuntu 22.04)
# 2. SSH 접속
ssh -i your-key.pem ubuntu@your-ip

# 3. Docker 설치
sudo apt update
sudo apt install docker.io docker-compose -y

# 4. 저장소 클론
git clone https://github.com/cofldus/killkong_konglish-corrector.git
cd killkong_konglish-corrector

# 5. 실행
sudo docker-compose up -d

# 6. Nginx 설정 (Optional)
sudo apt install nginx -y
# ... nginx 설정
```

## 환경 변수

배포 시 다음 환경변수 설정:
```bash
PYTHONUNBUFFERED=1
MODEL_DIR=/app/backend/models/qwen2p5-1_5b-friendsfixer-lora
RAG_DB_PATH=/app/data/RAGdb_final.csv
```

## 주의사항

1. **모델 크기**: 3.5GB이므로 충분한 저장공간 필요
2. **메모리**: 최소 8GB RAM 권장
3. **GPU**: CPU로도 작동하지만 느림 (응답 시간 5-10초)

## 무료 배포 옵션

| 플랫폼 | 메모리 | GPU | 비용 |
|--------|--------|-----|------|
| Hugging Face Spaces | 16GB | ❌ | 무료 |
| Railway (Free Tier) | 512MB | ❌ | 무료 |
| Render (Free Tier) | 512MB | ❌ | 무료 |
| Google Colab | 12GB | ✅ | 무료 |

**추천**: Hugging Face Spaces (모델 크기 때문)
