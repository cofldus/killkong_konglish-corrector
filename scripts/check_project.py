"""
프로젝트 구조 및 파일 검증 스크립트
"""
import os
from pathlib import Path

def check_file(path, required=True):
    """파일 존재 확인"""
    exists = Path(path).exists()
    status = "✅" if exists else ("❌" if required else "⚠️")
    print(f"{status} {path}")
    return exists

def check_project():
    """프로젝트 전체 검증"""
    print("=" * 60)
    print("🔍 KillKong Project Structure Check")
    print("=" * 60)
    
    # 필수 파일
    print("\n📋 Essential Files:")
    essential = [
        "README.md",
        "LICENSE",
        ".gitignore",
        "Dockerfile",
        "docker-compose.yml",
    ]
    for f in essential:
        check_file(f, required=True)
    
    # 백엔드
    print("\n🐍 Backend:")
    backend = [
        "backend/app.py",
        "backend/config.py",
        "backend/requirements.txt",
        "backend/models/__init__.py",
        "backend/models/qwen_model.py",
        "backend/rag/__init__.py",
        "backend/rag/database.py",
        "backend/rag/retriever.py",
        "backend/utils/__init__.py",
        "backend/utils/text_processing.py",
    ]
    for f in backend:
        check_file(f, required=True)
    
    # 데이터
    print("\n📊 Data:")
    check_file("data/RAGdb_final.csv", required=True)
    
    # 문서
    print("\n📖 Documentation:")
    docs = [
        "docs/SETUP.md",
        "docs/API.md",
        "docs/MODEL.md",
        "docs/DEPLOYMENT.md",
    ]
    for f in docs:
        check_file(f, required=True)
    
    # 프론트엔드 (선택)
    print("\n📱 Frontend (Optional):")
    check_file("frontend/package.json", required=False)
    check_file("frontend/README.md", required=False)
    
    # Gradio
    print("\n🎨 Gradio (Optional):")
    check_file("app_gradio.py", required=False)
    check_file("requirements_gradio.txt", required=False)
    
    # CI/CD
    print("\n⚙️ CI/CD:")
    check_file(".github/workflows/backend-test.yml", required=False)
    
    print("\n" + "=" * 60)
    print("✨ Check complete!")
    print("=" * 60)

if __name__ == "__main__":
    check_project()
