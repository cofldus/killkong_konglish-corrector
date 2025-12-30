# KillKong API 문서

Base URL: `http://localhost:8000`

## 엔드포인트

### 1. Health Check
```
GET /health
```

**응답:**
```json
{
  "status": "healthy",
  "ai_ready": true,
  "files": {
    "model_exists": true,
    "database_exists": true
  }
}
```

---

### 2. Chat (콩글리시 교정)
```
POST /api/v1/chat
```

**요청:**
```json
{
  "message": "I want to buy a hand phone",
  "show_hints": true
}
```

**응답:**
```json
{
  "response": "'hand phone' is Konglish—people just say 'cell phone'...",
  "hints": [
    {
      "konglish": "hand phone",
      "natural": "cell phone",
      "why": "...",
      "sim": 0.85
    }
  ],
  "processing_time": 1.23,
  "model_used": "qwen2.5-1.5b-friendsfixer"
}
```

---

### 3. Stats
```
GET /api/v1/stats
```

**응답:**
```json
{
  "model_initialized": true,
  "device": "cuda",
  "rag_database_size": 630,
  "model_config": { ... }
}
```

## 에러 코드

| 코드 | 설명 |
|------|------|
| 400 | Bad Request - 메시지가 비어있음 |
| 500 | Internal Server Error - 서버 오류 |

## 사용 예시

### Python
```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/chat",
    json={"message": "Let's play pocket ball", "show_hints": True}
)
print(response.json())
```

### JavaScript
```javascript
fetch('http://localhost:8000/api/v1/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    message: "I want open car",
    show_hints: true
  })
})
.then(r => r.json())
.then(data => console.log(data));
```
