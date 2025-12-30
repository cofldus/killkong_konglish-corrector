# KillKong 설치 가이드

## 필수 요구사항

- Python 3.10+
- CUDA 11.8+ (GPU 사용시)
- Node.js 16+ (프론트엔드)

## 백엔드 설치

\\\ash
# 1. 저장소 클론
git clone https://github.com/cofldus/killkong_konglish-corrector.git
cd killkong_konglish-corrector

# 2. 가상환경 생성
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# 3. 패키지 설치
cd backend
pip install -r requirements.txt

# 4. 모델 다운로드 (별도 안내 참조)
# 모델을 backend/models/qwen2p5-1_5b-friendsfixer-lora/ 에 배치

# 5. 서버 실행
uvicorn app:app --reload
\\\

서버: http://localhost:8000

## Docker 설치

\\\ash
# 1. Docker 빌드
docker-compose build

# 2. 실행
docker-compose up -d

# 3. 로그 확인
docker-compose logs -f
\\\

## 프론트엔드 설치

\\\ash
cd frontend
npm install
npm start
\\\

## 문제 해결

### 모델이 로드되지 않을 때
- \ackend/models/\ 폴더 확인
- 모델 파일 권한 확인

### CUDA 오류
- PyTorch CUDA 버전 확인
- \
vidia-smi\ 실행

### 포트 충돌
- \config.py\에서 포트 변경
