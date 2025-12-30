FROM python:3.10-slim

# 작업 디렉토리
WORKDIR /app

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Python 패키지 설치
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY backend/ ./backend/
COPY data/ ./data/

# 포트 노출
EXPOSE 8000

# 실행
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
