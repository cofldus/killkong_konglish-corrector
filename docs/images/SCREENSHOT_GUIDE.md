# 📸 스크린샷 가이드

## 필요한 스크린샷

### 1. screenshot-main.png (1200x800)
- 메인 화면
- 입력창에 "I want to buy a hand phone" 예시
- 교정 결과 표시

### 2. screenshot-correction.png (1200x800)
- 교정 과정
- Before/After 비교
- Hints 표시

### 3. screenshot-demo.png (1200x800)
- Gradio 데모 화면
- 여러 예시 동시 표시

### 4. screenshot-architecture.png (1200x600)
- 시스템 아키텍처 다이어그램
- RAG + Memory 시스템 시각화

## 스크린샷 추가 방법

1. 위 파일들을 `docs/images/` 폴더에 저장
2. README.md에 추가:
```markdown
## 📸 Screenshots

<p align="center">
  <img src="docs/images/screenshot-main.png" width="800" alt="Main Screen">
</p>

### Features Demo

<table>
  <tr>
    <td><img src="docs/images/screenshot-correction.png" width="400" alt="Correction"></td>
    <td><img src="docs/images/screenshot-demo.png" width="400" alt="Demo"></td>
  </tr>
</table>
```

## Placeholder 이미지 (임시)

임시로 shields.io 배지 사용 가능:
```markdown
![Demo](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=KillKong+Demo)
```
