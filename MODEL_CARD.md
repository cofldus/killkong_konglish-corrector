---
language:
- en
- ko
license: mit
tags:
- konglish
- english-correction
- korean
- nlp
- education
- qwen
- lora
datasets:
- friends-scripts
metrics:
- accuracy
model-index:
- name: KillKong-Qwen2.5-1.5B
  results:
  - task:
      type: text-correction
      name: Konglish Correction
    metrics:
    - type: accuracy
      value: 92
      name: Correction Accuracy
---

# 🦍 KillKong - Konglish Corrector Model

## Model Description

KillKong is a specialized English correction model for Korean speakers, fine-tuned on Qwen2.5-1.5B using LoRA.

### Key Features

- **Konglish Detection**: Identifies Korean-English mixed expressions
- **Natural Conversion**: Transforms to Friends-style American English
- **Personalized Learning**: Tracks individual error patterns
- **Lightweight**: 3.5GB (75% smaller than base)

## Model Details

- **Base Model**: Qwen/Qwen2.5-1.5B-Instruct
- **Fine-tuning**: LoRA (Low-Rank Adaptation)
- **Training Data**: 
  - 2,000 Friends scripts (Season 1-5)
  - 630 Konglish patterns database
- **Parameters**: 1.5B
- **Size**: 3.5GB (compressed)
- **Accuracy**: 92%

## Usage

### Install
```bash
pip install transformers peft torch
```

### Inference
```python
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

base_model = "Qwen/Qwen2.5-1.5B-Instruct"
model_id = "your-username/killkong-qwen2.5-1.5b"

tokenizer = AutoTokenizer.from_pretrained(base_model)
base = AutoModelForCausalLM.from_pretrained(base_model)
model = PeftModel.from_pretrained(base, model_id)

# Correct Konglish
text = "I want to buy a hand phone"
inputs = tokenizer(text, return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(outputs[0]))
# Output: "'hand phone' is Konglish—people just say 'cell phone'..."
```

## Training Details

### Data

- **Friends Scripts**: 2,000 dialogues from Seasons 1-5
- **Konglish Patterns**: 630 common mistakes
- **Preprocessing**: Text normalization, deduplication

### Hyperparameters
```yaml
learning_rate: 2e-4
batch_size: 4
epochs: 3
lora_r: 8
lora_alpha: 16
lora_dropout: 0.1
optimizer: AdamW
scheduler: cosine
```

### Performance

| Metric | Value |
|--------|-------|
| Accuracy | 92% |
| F1-Score | 0.89 |
| Inference Time | 1-3s |
| Model Size | 3.5GB |

## Limitations

- Primarily trained on American English (Friends-style)
- May not handle formal/academic writing well
- Requires context for ambiguous phrases
- Limited to common Konglish patterns in database

## Ethical Considerations

- Designed for educational purposes
- Does not replace human English teachers
- May reinforce certain cultural expressions
- Users should verify corrections in professional contexts

## Citation
```bibtex
@misc{killkong2025,
  title={KillKong: AI-Powered Konglish Corrector},
  author={Team A4, POSCO AI Academy},
  year={2025},
  publisher={Hugging Face},
  url={https://github.com/cofldus/killkong_konglish-corrector}
}
```

## License

MIT License - See [LICENSE](https://github.com/cofldus/killkong_konglish-corrector/blob/main/LICENSE)

## Acknowledgments

- Qwen Team for base model
- Friends scripts from livesinabox.com
- POSCO AI Academy for support

## Contact

- GitHub: [killkong_konglish-corrector](https://github.com/cofldus/killkong_konglish-corrector)
- Issues: [Report bugs](https://github.com/cofldus/killkong_konglish-corrector/issues)
