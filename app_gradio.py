"""
KillKong Gradio Demo for Hugging Face Spaces
"""
import gradio as gr
import sys
from pathlib import Path

# 경로 추가
sys.path.append(str(Path(__file__).parent))

try:
    from backend.models import FriendsFixerAI
    from backend.config import config
    
    # AI 초기화
    print("🚀 Initializing KillKong AI...")
    ai = FriendsFixerAI()
    ai.initialize()
    
    def correct_english(text, show_hints=False):
        """콩글리시 교정"""
        if not text.strip():
            return "Please enter some text!", ""
        
        try:
            result = ai.generate_response(text, show_hints=show_hints)
            response = result['response']
            
            if show_hints and result.get('hints'):
                hints_text = "\n\n📚 **Hints Used:**\n"
                for h in result['hints'][:3]:
                    hints_text += f"- {h['konglish']} → {h['natural']} (similarity: {h['sim']:.2f})\n"
                response += hints_text
            
            processing_time = f"\n\n⏱️ Processing time: {result['processing_time']:.2f}s"
            return response, processing_time
            
        except Exception as e:
            return f"Error: {str(e)}", ""

except Exception as e:
    print(f"❌ Failed to load model: {e}")
    print("⚠️ Running in demo mode")
    
    def correct_english(text, show_hints=False):
        """더미 응답"""
        examples = {
            "hand phone": "'hand phone' is Konglish—people just say 'cell phone'.\nAnyway, what kind are you looking for?",
            "pocket ball": "'pocket ball' is Konglish—people just say 'pool' or 'billiards'.\nBy the way, do you play often?",
            "black consumer": "'black consumer' is Konglish—people just say 'problematic customer'.\nOn that note, that sounds frustrating!",
        }
        
        text_lower = text.lower()
        for key, response in examples.items():
            if key in text_lower:
                return response, "⏱️ Processing time: 0.01s (Demo mode)"
        
        return "I can help you make that sound more natural! Give me a sentence with Konglish.", ""

# Gradio 인터페이스
with gr.Blocks(theme=gr.themes.Soft(), title="🦍 KillKong") as demo:
    gr.Markdown("""
    # 🦍 KillKong - Konglish Corrector
    
    AI-powered English correction specialized for Korean speakers
    
    ### How to use:
    1. Type your English sentence (with Konglish is OK!)
    2. Click "Correct My English"
    3. Get natural, Friends-style corrections
    
    **Example Konglish**: hand phone, pocket ball, eye shopping, black consumer
    """)
    
    with gr.Row():
        with gr.Column():
            input_text = gr.Textbox(
                label="Your English",
                placeholder="e.g., I want to buy a hand phone",
                lines=3
            )
            show_hints_checkbox = gr.Checkbox(label="Show hints (콩글리시 패턴 표시)", value=False)
            submit_btn = gr.Button("✨ Correct My English", variant="primary")
        
        with gr.Column():
            output_text = gr.Textbox(label="Corrected & Natural", lines=8)
            time_text = gr.Textbox(label="Info", lines=1)
    
    # 예시
    gr.Examples(
        examples=[
            ["I want to buy a hand phone"],
            ["Let's play pocket ball tonight"],
            ["I went eye shopping yesterday"],
            ["There were many black consumers at the store"],
            ["His coloring is good to hear"],
        ],
        inputs=input_text
    )
    
    submit_btn.click(
        fn=correct_english,
        inputs=[input_text, show_hints_checkbox],
        outputs=[output_text, time_text]
    )
    
    gr.Markdown("""
    ---
    ### About
    - **Model**: Qwen2.5-1.5B + LoRA (Fine-tuned on Friends scripts)
    - **Database**: 630 Konglish patterns
    - **Tech**: RAG (Retrieval-Augmented Generation) + Memory System
    
    **Team A4** | POSCO AI Academy 30th
    
    [GitHub](https://github.com/cofldus/killkong_konglish-corrector) | [Report](https://github.com/cofldus/killkong_konglish-corrector/blob/main/docs/A4_KILLKONG_%EC%B5%9C%EC%A2%85%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf)
    """)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
