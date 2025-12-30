# app.py - FriendsFixer Backend with Working Implementation
import os
import sys
import time
import pandas as pd
import json
import re
import random
import unicodedata
import difflib
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple
import logging
from datetime import datetime

# Windows 한글/이모지 인코딩 문제 해결
if sys.platform == "win32":
    os.environ["PYTHONIOENCODING"] = "utf-8"

# FastAPI imports
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# AI/ML imports
try:
    import torch
    import numpy as np
    from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, GenerationConfig
    from peft import PeftModel
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    ML_AVAILABLE = True
    print("✅ All ML libraries loaded successfully")
except ImportError as e:
    ML_AVAILABLE = False
    print(f"❌ ML libraries not available: {e}")

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# 경로 디버깅
print("=" * 50)
print("🔍 PATH DEBUGGING")
print("=" * 50)
print(f"Current working directory: {os.getcwd()}")
print(f"__file__ location: {__file__}")

# FastAPI 앱 생성
app = FastAPI(
    title="FriendsFixer API",
    description="AI-powered Korean-English correction service",
    version="2.3.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 설정 - 로그에서 보이는 실제 경로 사용
class Config:
    # 로그에서 보이는 Windows 경로 사용
    MODEL_DIR = Path(r"C:\Users\82103\Desktop\Projects\app-pospeak\models\qwen2p5-1_5b-friendsfixer-lora")
    RAG_DB_PATH = Path(r"C:\Users\82103\Desktop\Projects\app-pospeak\data\RAGdb_final.csv")
    
    BASE_MODEL = "Qwen/Qwen2.5-1.5B-Instruct"
    MAX_NEW_TOKENS = 196
    TEMPERATURE = 0.9
    TOP_P = 0.90
    TOP_K = 40
    REPETITION_PENALTY = 1.05
    RERANK_N = 3
    DEVICE = "cuda" if torch.cuda.is_available() and ML_AVAILABLE else "cpu"
    USE_4BIT = True
    COMPUTE_DTYPE_BF16 = True
    
    RAG_TOP_K = 4
    RAG_MIN_SIM = 0.22
    RAG_STAGE = "both"
    POST_MIN_SIM = 0.35
    BLOCK_BAD_TOKENS = True
    
    K_NOTE_SIM_TH = 0.28
    K_NOTE_CONNECTORS = ["Anyway,", "By the way,", "Oh, and", "On that note,", "Also,"]
    K_NOTE_ENFORCE = True
    
    SEED = 42

config = Config()
print(f"MODEL_DIR: {config.MODEL_DIR} (exists: {config.MODEL_DIR.exists()})")
print(f"RAG_DB_PATH: {config.RAG_DB_PATH} (exists: {config.RAG_DB_PATH.exists()})")
print("=" * 50)

random.seed(config.SEED)
if ML_AVAILABLE:
    np.random.seed(config.SEED)
    torch.manual_seed(config.SEED)

# 힌트 모델
class RagHint(BaseModel):
    konglish: str
    natural: str
    why: str = ""
    sim: float

# 요청/응답 모델
class ChatRequest(BaseModel):
    message: str
    show_hints: bool = False

class ChatResponse(BaseModel):
    response: str
    hints: Optional[List[RagHint]] = None
    processing_time: float
    model_used: str = "qwen2.5-1.5b-friendsfixer"

class HealthResponse(BaseModel):
    status: str
    ai_ready: bool
    files: Dict[str, Any]

# 시스템 프롬프트
FRIENDS_SYSTEM = """SYSTEM:
You are FriendsFixer — a witty American sitcom—style rewriter and coach.

GOAL
Make the USER's stiff, overly formal, or awkward English sound natural, everyday, and friendly with a light "Friends" vibe: playful, warm, a dash of sarcasm, always kind (PG-13). Never change the original intent or add facts.

DECISION
- If the sentence already sounds natural and PG-13: do NOT rewrite. Just keep chatting naturally and move the conversation forward with one short question.
- If it's stiff/awkward/overly formal/rude/robotic: rewrite. First chat like a friend, then add a connector-led nudge, then provide casual alternatives.

FORMAT
A) Needs fixing →
  1) 1—2 friendly chat lines.
  2) ONE coaching line that begins with a connector (But / And / Also / Anyway / That said, / Oh, and / On that note,) and briefly flags what's off.
  3) On a new line write exactly: Instead, try: and list 3 numbered rewrites (casual US English, with contractions, same intent).
  4) End with one gentle playful line and one specific follow-up question.

B) No fix needed →
  - Only continue the conversation in 1—2 lines and ask a topic-correct follow-up question. Do not say "it's already natural," and do not include "Instead, try:".

STYLE
- Teasing stays kind, PG-13, with contractions. Short, punchy sentences. Natural American English.
- Avoid meta jokes. Keep it human and simple.
- If the input isn't a sentence to rewrite, say: Give me the sentence you want rewritten.
"""

# K-note 로직을 위한 상수들
_WORD = re.compile(r"\w[\w'-]*")
_STOP = {
    "a","an","the","to","for","of","in","on","at","by","and","or","but","so",
    "that","this","these","those","is","are","was","were","am","be","been","being",
    "do","does","did","have","has","had","get","got","gotten","we","i","you","they","he","she","it",
    "my","your","his","her","their","our","me","him","them","us","let","let's","just"
}
_TIME = {
    "last","next","yesterday","today","tonight","tomorrow",
    "morning","afternoon","evening","night","nights","day","days","week","weeks","weekend","weekends",
    "month","months","year","years","season","seasons",
    "spring","summer","fall","autumn","winter",
    "monday","tuesday","wednesday","thursday","friday","saturday","sunday"
}
_COLORS = {"red","blue","green","black","white","gray","grey","yellow","pink","purple","brown","orange"}
_VERB_BASE = {
    "play","played","buy","go","come","make","take","see","watch","call","ask","need","want","like","love","use","try",
    "pay","drive","walk","run","eat","drink","work","study","have","get","give","feel","think","say","tell"
}

class FriendsFixerAI:
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.vectorizer = None
        self.tfidf_mat = None
        self.rag_db = None
        self.bad_col = None
        self.good_col = None
        self.ctx_col = None
        self.is_initialized = False
        
    def initialize(self):
        """AI 모델과 RAG 데이터베이스 초기화"""
        try:
            logger.info("🚀 AI model initialization starting...")
            
            if not ML_AVAILABLE:
                logger.warning("⚠️ ML libraries not available, running in dummy mode")
                self.is_initialized = True
                return
            
            # RAG 데이터베이스 먼저 로드
            logger.info("📊 Loading RAG database...")
            self.load_rag_database()
            
            # 모델 경로 확인
            if not config.MODEL_DIR.exists():
                logger.warning(f"⚠️ Model directory not found: {config.MODEL_DIR}")
                logger.info("🔄 Running without fine-tuned model (base model only)")
                self.load_base_model_only()
            else:
                # 모델 로드
                logger.info("🤖 Loading fine-tuned model...")
                self.load_model_and_tokenizer()
            
            self.is_initialized = True
            logger.info("✅ AI model initialization completed!")
            
        except Exception as e:
            logger.error(f"❌ AI model initialization failed: {e}")
            logger.info("🔄 Falling back to dummy mode")
            self.is_initialized = True
    
    def load_base_model_only(self):
        """기본 모델만 로드 (fine-tuned 모델이 없을 때)"""
        try:
            base_id = config.BASE_MODEL
            has_cuda = torch.cuda.is_available()
            
            logger.info(f"📥 Loading base model: {base_id}")
            self.tokenizer = AutoTokenizer.from_pretrained(base_id, trust_remote_code=True)
            if self.tokenizer.pad_token_id is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Quantization 설정
            quant = None
            if config.USE_4BIT and has_cuda:
                quant = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_use_double_quant=True,
                    bnb_4bit_quant_type="nf4",
                    bnb_4bit_compute_dtype=torch.bfloat16 if config.COMPUTE_DTYPE_BF16 else torch.float16,
                )
            
            self.model = AutoModelForCausalLM.from_pretrained(
                base_id,
                trust_remote_code=True,
                quantization_config=quant,
                device_map="auto" if has_cuda else None,
            )
            
            self.model.config.use_cache = True
            self.model.config.pad_token_id = self.tokenizer.pad_token_id
            logger.info(f"✅ Base model loaded on device: {self.model.device}")
            
        except Exception as e:
            logger.error(f"❌ Base model loading failed: {e}")
            self.model = None
            self.tokenizer = None
    
    def load_model_and_tokenizer(self):
        """fine-tuned 모델과 토크나이저 로드"""
        try:
            model_dir = Path(config.MODEL_DIR)
            base_id = config.BASE_MODEL
            has_cuda = torch.cuda.is_available()
            
            # Quantization 설정
            quant = None
            if config.USE_4BIT and has_cuda:
                quant = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_use_double_quant=True,
                    bnb_4bit_quant_type="nf4",
                    bnb_4bit_compute_dtype=torch.bfloat16 if config.COMPUTE_DTYPE_BF16 else torch.float16,
                )
            
            logger.info("📥 Loading tokenizer...")
            self.tokenizer = AutoTokenizer.from_pretrained(base_id, trust_remote_code=True)
            if self.tokenizer.pad_token_id is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # LoRA 어댑터 확인
            adapter_path = model_dir / "adapter_config.json"
            if adapter_path.exists():
                logger.info("🔗 LoRA adapter found → attach to base")
                base = AutoModelForCausalLM.from_pretrained(
                    base_id,
                    trust_remote_code=True,
                    quantization_config=quant,
                    device_map="auto" if has_cuda else None,
                )
                self.model = PeftModel.from_pretrained(
                    base, str(model_dir), device_map="auto" if has_cuda else None
                )
            else:
                logger.info("📁 Loading model directory")
                self.model = AutoModelForCausalLM.from_pretrained(
                    str(model_dir),
                    trust_remote_code=True,
                    quantization_config=quant,
                    device_map="auto" if has_cuda else None,
                )
            
            self.model.config.use_cache = True
            self.model.config.pad_token_id = self.tokenizer.pad_token_id
            logger.info(f"✅ Model loaded on device: {self.model.device}")
            
        except Exception as e:
            logger.error(f"❌ Model loading failed: {e}")
            # fallback to base model
            self.load_base_model_only()
    
    def read_csv_safely(self, path: str) -> pd.DataFrame:
        """안전한 CSV 읽기"""
        encodings = ["utf-8", "utf-8-sig", "cp949", "euc-kr", "latin1", "windows-1252", "mac_roman"]
        last_err = None
        for enc in encodings:
            try:
                return pd.read_csv(path, encoding=enc)
            except Exception as e:
                last_err = e
        raise RuntimeError(f"Failed to read CSV. Last error:\n{last_err}")
    
    def infer_cols(self, df: pd.DataFrame) -> Tuple[str, str, Optional[str]]:
        """컬럼 자동 감지"""
        cols = [c.lower() for c in df.columns]
        bad_cands = {"konglish", "wrong", "bad", "input", "term", "word", "pattern", "phrase", "error", "typo", "original"}
        good_cands = {"natural", "right", "good", "output", "rewrite", "correction", "fix", "native", "suggestion", "target"}
        
        bad = next((c for c in df.columns if c.lower() in bad_cands), None)
        good = next((c for c in df.columns if c.lower() in good_cands), None)
        
        if bad is None and "input" in cols:
            bad = df.columns[cols.index("input")]
        if good is None and "output" in cols:
            good = df.columns[cols.index("output")]
            
        if bad is None or good is None:
            textish = [c for c in df.columns if df[c].dtype == object]
            if len(textish) >= 2:
                bad = bad or textish[0]
                good = good or textish[1]
        
        ctx_candidates = ["context", "example", "desc", "note", "explain", "korean", "source"]
        ctx = next((c for c in ctx_candidates if c in df.columns), None)
        
        if bad is None or good is None:
            raise ValueError("Couldn't infer BAD/GOOD columns")
        
        return bad, good, ctx
    
    def normalize_text(self, s: str) -> str:
        """텍스트 정규화"""
        s = unicodedata.normalize("NFKC", str(s))
        return re.sub(r"\s+", " ", s).strip()
    
    def load_rag_database(self):
        """RAG 데이터베이스 로드 및 인덱싱"""
        try:
            if not config.RAG_DB_PATH.exists():
                logger.warning(f"⚠️ RAG database file not found: {config.RAG_DB_PATH}")
                return
            
            db_df = self.read_csv_safely(str(config.RAG_DB_PATH))
            logger.info(f"📋 RAG database columns: {list(db_df.columns)}")
            
            _df = db_df.copy()
            _df.columns = [str(c).strip() for c in _df.columns]
            
            self.bad_col, self.good_col, self.ctx_col = self.infer_cols(_df)
            logger.info(f"🏷️ Using BAD_COL='{self.bad_col}', GOOD_COL='{self.good_col}', CTX_COL='{self.ctx_col}'")
            
            cols_to_keep = [self.bad_col, self.good_col]
            if self.ctx_col:
                cols_to_keep.append(self.ctx_col)
            
            self.rag_db = _df[cols_to_keep].dropna().drop_duplicates().reset_index(drop=True)
            self.rag_db[self.bad_col] = self.rag_db[self.bad_col].map(self.normalize_text)
            self.rag_db[self.good_col] = self.rag_db[self.good_col].map(self.normalize_text)
            if self.ctx_col:
                self.rag_db[self.ctx_col] = self.rag_db[self.ctx_col].map(self.normalize_text)
            
            index_text = self.rag_db[self.bad_col].astype(str)
            if self.ctx_col:
                index_text = index_text + " || " + self.rag_db[self.ctx_col].astype(str)
            
            self.vectorizer = TfidfVectorizer(
                ngram_range=(1, 3),
                analyzer="word",
                token_pattern=r"(?u)\b\w[\w'-]*\b",
                lowercase=True,
                min_df=1,
                max_df=0.95
            )
            self.tfidf_mat = self.vectorizer.fit_transform(index_text.values.tolist())
            
            logger.info(f"🔍 RAG database loaded and indexed: {self.tfidf_mat.shape[0]} entries")
            
        except Exception as e:
            logger.error(f"❌ RAG database loading failed: {e}")
            self.rag_db = None
    
    def rag_retrieve(self, query: str, top_k: int = None, min_sim: float = None) -> List[Dict[str, str]]:
        """RAG 검색"""
        if self.vectorizer is None or self.tfidf_mat is None or self.rag_db is None:
            return []
        
        try:
            top_k = top_k or config.RAG_TOP_K
            min_sim = min_sim or config.RAG_MIN_SIM
            
            q_vec = self.vectorizer.transform([self.normalize_text(query)])
            sims = cosine_similarity(q_vec, self.tfidf_mat)[0]
            idxs = np.argsort(-sims)[:top_k * 3]
            
            pairs, seen_bad = [], set()
            for i in idxs:
                sim = float(sims[i])
                if sim < min_sim:
                    continue
                
                bad = self.rag_db.iloc[i][self.bad_col]
                if bad in seen_bad:
                    continue
                    
                seen_bad.add(bad)
                good = self.rag_db.iloc[i][self.good_col]
                ctx = self.rag_db.iloc[i][self.ctx_col] if self.ctx_col else ""
                
                pairs.append({
                    "konglish": bad,
                    "natural": good,
                    "why": ctx,
                    "sim": round(sim, 4)
                })
                
                if len(pairs) >= config.RAG_TOP_K:
                    break
            
            return pairs
            
        except Exception as e:
            logger.error(f"❌ RAG retrieval failed: {e}")
            return []
    
    def build_system_with_rag(self, hints: List[Dict[str, str]], stage: str) -> str:
        """RAG 힌트가 포함된 시스템 프롬프트 생성"""
        sim_th = float(config.K_NOTE_SIM_TH)
        connectors = config.K_NOTE_CONNECTORS
        
        k_note = None
        if hints:
            top = max(hints, key=lambda h: float(h.get("sim", 0.0)))
            if float(top.get("sim", 0.0)) >= sim_th and top.get("konglish") and top.get("natural"):
                k_note = {"konglish": top["konglish"], "natural": top["natural"]}
        
        rag_json = json.dumps([
            {"konglish": h["konglish"], "natural": h["natural"], "why": h.get("why", "")}
            for h in hints
        ], ensure_ascii=False)
        
        stage_note = (
            "First, silently correct any Konglish using RAG_HINTS if relevant, then produce the output in the required FORMAT."
            if stage in ("pre", "both") else
            "Produce the output in the required FORMAT; we'll post-check with RAG later."
        )
        
        cot_guard = (
            "Before writing, think briefly (hidden) about: detect issues → map to RAG hints → plan 3 rewrites → finalize. "
            "Do NOT show your analysis."
        )
        
        rag_instr = "RAG_HINTS: use only when clearly relevant; prefer the 'natural' phrasing over 'konglish' if it preserves intent."
        
        return (
            FRIENDS_SYSTEM + "\n\n" +
            "TOOLS\n" +
            f"- {rag_instr}\n- {stage_note}\n- {cot_guard}\n\n" +
            f"RAG_HINTS_JSON = {rag_json}\n" +
            f"K_NOTE_JSON = {json.dumps(k_note, ensure_ascii=False)}  # null if none\n\n" +
            "K-NOTE RULE (use only if K_NOTE_JSON exists):\n" +
            "  - Line 1: '{konglish}' is Konglish—people just say '{natural}'.\n" +
            f"  - Line 2 must begin with ONE connector from: {', '.join(connectors)} and then continue the friendly lines.\n" +
            "  - Keep it short.\n"
        )
    
    def apply_chat_template(self, messages: List[Dict[str, str]]) -> Dict[str, torch.Tensor]:
        prompt = self.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        return self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
    
    def ids_for_phrase(self, phrase: str) -> List[int]:
        return self.tokenizer(phrase, add_special_tokens=False).input_ids
    
    def collect_bad_words_ids(self, hints):
        out = []
        for h in hints:
            bad = h.get("konglish", "").strip()
            if not bad:
                continue
            ids = self.ids_for_phrase(bad)
            if ids:
                out.append(ids)
        return out
    
    def rag_preference_score(self, text: str, hints) -> float:
        text_lc, score = text.lower(), 0.0
        for h in hints:
            good = h.get("natural", "").lower().strip()
            bad = h.get("konglish", "").lower().strip()
            if good and re.search(rf'(?<!\w){re.escape(good)}(?!\w)', text_lc):
                score += 1.0
            if bad and re.search(rf'(?<!\w){re.escape(bad)}(?!\w)', text_lc):
                score -= 2.0
        L = len(text)
        score += max(0.0, 1.0 - (L / 500.0))
        return score
    
    def generate(self, messages: List[Dict[str, str]], hints: List[Dict[str, str]]) -> str:
        """텍스트 생성"""
        if not self.model or not self.tokenizer:
            return "Model not loaded"
            
        inputs = self.apply_chat_template(messages)
        bad_words_ids = self.collect_bad_words_ids(hints) if config.BLOCK_BAD_TOKENS else None
        
        gen_cfg = GenerationConfig(
            max_new_tokens=config.MAX_NEW_TOKENS,
            do_sample=True,
            temperature=config.TEMPERATURE,
            top_p=config.TOP_P,
            top_k=config.TOP_K,
            repetition_penalty=config.REPETITION_PENALTY,
            pad_token_id=self.tokenizer.pad_token_id,
            eos_token_id=self.tokenizer.eos_token_id,
            num_return_sequences=max(1, config.RERANK_N),
            bad_words_ids=bad_words_ids if bad_words_ids else None,
        )
        
        with torch.inference_mode():
            out = self.model.generate(**inputs, generation_config=gen_cfg)
        
        n = config.RERANK_N
        seqs = []
        stride = out.size(0) if n == 1 else n
        for i in range(stride):
            gen = out[i][inputs["input_ids"].size(1):]
            seqs.append(self.tokenizer.decode(gen, skip_special_tokens=True).strip())
        
        return max(seqs, key=lambda t: self.rag_preference_score(t, hints))
    
    def post_correction(self, text: str, hints: List[Dict[str, str]]) -> str:
        """후처리 교정"""
        fixed = text
        for h in hints:
            if float(h.get("sim", 0.0)) < config.POST_MIN_SIM:
                continue
            bad, good = h.get("konglish", ""), h.get("natural", "")
            if not bad or not good:
                continue
            pattern = re.compile(rf'(?i)(?<!\w){re.escape(bad)}(?!\w)')
            fixed = pattern.sub(good, fixed)
        return fixed
    
    def tok_list(self, s: str) -> List[str]:
        return [t.lower() for t in _WORD.findall(self.normalize_text(s))]
    
    def is_time_or_meta(self, t: str) -> bool:
        return t in _TIME or t in _COLORS or t.isdigit()
    
    def is_probable_verb(self, t: str) -> bool:
        if t in _VERB_BASE:
            return True
        return t.endswith("ed") or t.endswith("ing")
    
    def content_tokens(self, tokens: List[str]) -> List[str]:
        return [t for t in tokens if t not in _STOP and not self.is_time_or_meta(t)]
    
    def group_runs(self, idxs: List[int]) -> List[Tuple[int, int]]:
        if not idxs:
            return []
        idxs = sorted(idxs)
        runs, s, p = [], idxs[0], idxs[0]
        for x in idxs[1:]:
            if x == p + 1:
                p = x
            else:
                runs.append((s, p))
                s = p = x
        runs.append((s, p))
        return runs
    
    def norm(self, s: str) -> str:
        return re.sub(r"\s+", " ", str(s)).strip()
    
    def ngrams(self, tokens, max_n=4):
        for n in range(min(max_n, len(tokens)), 0, -1):
            for i in range(0, len(tokens) - n + 1):
                yield " ".join(tokens[i:i + n])
    
    def best_bad_span_in_user(self, bad: str, user_text: str, max_n=4) -> Optional[str]:
        bad_lc, user_lc = self.norm(bad).lower(), self.norm(user_text).lower()
        
        if re.search(rf'(?<!\w){re.escape(bad_lc)}(?!\w)', user_lc):
            return self.norm(bad)
        
        toks = _WORD.findall(bad_lc)
        for ng in self.ngrams(toks, max_n=max_n):
            if re.search(rf'(?<!\w){re.escape(ng)}(?!\w)', user_lc):
                return ng
        return None
    
    def good_span_from_diff(self, bad: str, good: str, bad_span: str) -> Optional[str]:
        tb = self.tok_list(bad)
        tg = self.tok_list(good)
        
        cb_set = set(self.content_tokens(tb))
        cg_seq = self.content_tokens(tg)
        
        new_pos = [i for i, t in enumerate(tg) if (t not in cb_set) and (t in cg_seq)]
        for s, e in self.group_runs(new_pos):
            seq = [t for t in tg[s:e+1] if (t in cg_seq) and (not self.is_probable_verb(t)) and (not self.is_time_or_meta(t))]
            if not seq:
                continue
            
            if len(seq) == 1:
                i0 = next((i for i in range(s, e+1) if tg[i] == seq[0]), s)
                if i0 + 1 < len(tg) and tg[i0 + 1] in cb_set and not self.is_time_or_meta(tg[i0 + 1]):
                    seq.append(tg[i0 + 1])
                    if i0 + 2 < len(tg) and (tg[i0 + 2] in cg_seq) and not self.is_probable_verb(tg[i0 + 2]) and not self.is_time_or_meta(tg[i0 + 2]):
                        seq.append(tg[i0 + 2])
                elif i0 - 1 >= 0 and tg[i0 - 1] in cb_set and not self.is_time_or_meta(tg[i0 - 1]):
                    seq.insert(0, tg[i0 - 1])
            
            return " ".join(seq[:3])
        
        sm = difflib.SequenceMatcher(a=" ".join(tb), b=" ".join(tg))
        for tag, a0, a1, b0, b1 in sm.get_opcodes():
            if tag in ("replace", "insert"):
                frag = [w for w in tg[b0:b1] if (w in cg_seq) and (not self.is_probable_verb(w)) and (not self.is_time_or_meta(w))]
                if frag:
                    return " ".join(frag[:3])
        
        if cg_seq:
            base = [w for w in cg_seq if (not self.is_probable_verb(w)) and (not self.is_time_or_meta(w))]
            if base:
                return " ".join(base[:3])
        return None
    
    def compute_k_terms(self, user_text: str, hint: dict) -> Optional[Tuple[str, str]]:
        bad, good = self.norm(hint.get("konglish", "")), self.norm(hint.get("natural", ""))
        if not bad or not good:
            return None
        
        bad_span = self.best_bad_span_in_user(bad, user_text)
        if not bad_span:
            return None
        
        good_span = self.good_span_from_diff(bad, good, bad_span) or good
        
        if len(_WORD.findall(good_span)) > 3:
            toks = _WORD.findall(good_span)
            good_span = " ".join(toks[:3])
        return bad_span, good_span
    
    def enforce_k_note_order(self, text: str, hints: List[dict], user_text: str) -> str:
        """K-note 순서 강제"""
        if not config.K_NOTE_ENFORCE or not hints:
            return text.strip()
        
        top = max(hints, key=lambda h: float(h.get("sim", 0.0)))
        pair = self.compute_k_terms(user_text, top)
        if not pair:
            return text.strip()
        
        bad_span, good_span = pair
        k_line = f"'{bad_span}' is Konglish—people just say '{good_span}'."
        t = text.strip()
        parts = t.splitlines()
        
        if parts and ("is Konglish" in parts[0]):
            second = parts[1].strip() if len(parts) >= 2 else ""
            if not any(second.startswith(c) for c in config.K_NOTE_CONNECTORS):
                second = (config.K_NOTE_CONNECTORS[0] + " " + second).strip()
            return "\n".join([parts[0], second] + parts[2:]).strip()
        
        connector = config.K_NOTE_CONNECTORS[0]
        second = (connector + " " + (parts[0] if parts else "")).strip()
        tail = "\n".join(parts[1:]) if len(parts) > 1 else ""
        return "\n".join([k_line, second, tail]).strip()
    
    def post_correction_protect_k_note(self, text: str, hints: List[Dict[str, str]]) -> str:
        """K-note 첫 줄 보호하며 후처리"""
        knote_re = re.compile(r"(?i)\bis\s+konglish\b")
        lines = text.splitlines()
        if lines and knote_re.search(lines[0]):
            head = lines[0]
            tail = "\n".join(lines[1:])
            fixed_tail = self.post_correction(tail, hints) if tail.strip() else ""
            return head + ("\n" + fixed_tail if fixed_tail else "")
        return self.post_correction(text, hints)
    
    def friendsfixer_rag(self, user_text: str, stage: Optional[str] = None) -> Dict[str, Any]:
        """메인 파이프라인"""
        if stage is None:
            stage = config.RAG_STAGE
        
        # 1) retrieve hints
        hints_in = self.rag_retrieve(user_text)
        
        # 2) build prompt & generate
        sys_prompt = self.build_system_with_rag(hints_in, stage)
        messages = [{"role": "system", "content": sys_prompt}, {"role": "user", "content": user_text}]
        raw = self.generate(messages, hints_in)
        raw = self.enforce_k_note_order(raw, hints_in, user_text)
        
        # 3) post-correct (protect K-note)
        if stage in ("post", "both"):
            hints_out = self.rag_retrieve(raw)
            union = {(h["konglish"], h["natural"]): h for h in hints_in + hints_out}
            fixed = self.post_correction_protect_k_note(raw, list(union.values()))
        else:
            fixed = raw
        
        return {"hints": hints_in, "raw": raw, "final": fixed}
    
    def generate_response(self, message: str, show_hints: bool = False) -> Dict[str, Any]:
        """메시지에 대한 응답 생성"""
        start_time = time.time()
        
        try:
            if not self.model or not self.tokenizer:
                # 더미 응답
                response = self._generate_dummy_response(message)
                hints = self.rag_retrieve(message) if show_hints else []
                model_used = "dummy"
            else:
                # 실제 AI 응답 생성
                result = self.friendsfixer_rag(message)
                response = result["final"]
                hints = result["hints"] if show_hints else []
                model_used = "qwen2.5-1.5b-friendsfixer"
            
            processing_time = time.time() - start_time
            
            return {
                'response': response,
                'hints': hints,
                'processing_time': round(processing_time, 3),
                'model_used': model_used
            }
            
        except Exception as e:
            logger.error(f"❌ Response generation failed: {e}")
            return {
                'response': f"Sorry, I encountered an error: {str(e)}",
                'hints': [],
                'processing_time': time.time() - start_time,
                'model_used': 'error'
            }
    
    def _generate_dummy_response(self, message: str) -> str:
        """더미 응답 생성"""
        dummy_corrections = {
            "my hand phone was broken": "'hand phone' is Konglish—people just say 'cell phone'.\nAnyway, that sounds rough! What happened to it?",
            "let's play pocket ball": "'pocket ball' is Konglish—people just say 'pool' or 'billiards'.\nBy the way, I love pool! Where do you usually play?",
            "i want to go open car driving": "'open car' is Konglish—people just say 'convertible'.\nAnyway, that sounds fun! Where are you planning to drive?",
            "you are very beautiful": "That's sweet! But that sounds a bit formal.\n\nInstead, try:\n1. You look beautiful\n2. You're gorgeous\n3. You look amazing\n\nMuch more natural! What's the occasion?",
            "do you like to play pocket ball?": "'pocket ball' is Konglish—people just say 'billiards' or 'pool'.\nAnyway, I'd love to! Are you good at it?",
            "are you a black consumer?": "'black consumer' is Konglish—people just say 'difficult customer'.\nBy the way, nope! I try to be helpful. What's up?",
        }
        
        message_lower = message.lower().strip()
        
        # 정확히 매칭되는 것 찾기
        for key, response in dummy_corrections.items():
            if message_lower == key:
                return response
        
        # 부분 매칭
        if "hand phone" in message_lower:
            return "'hand phone' is Konglish—people just say 'phone' or 'cell phone'.\nAnyway, what about your phone?"
        elif "pocket ball" in message_lower:
            return "'pocket ball' is Konglish—people just say 'pool' or 'billiards'.\nBy the way, do you play often?"
        elif "open car" in message_lower:
            return "'open car' is Konglish—people just say 'convertible'.\nAnyway, sounds like a fun drive!"
        elif "black consumer" in message_lower:
            return "'black consumer' is Konglish—people just say 'difficult customer'.\nOn that note, what's the situation?"
        
        return f"I'd help you make that sound more natural! Try giving me a complete sentence to work with.\n\nWhat you said: \"{message}\"\n\nI can help you make it sound more friendly and natural! 😊"

# AI 서비스 인스턴스 생성
ai_service = FriendsFixerAI()

@app.on_event("startup")
async def startup_event():
    """앱 시작시 AI 모델 초기화"""
    logger.info("🎯 FriendsFixer API starting...")
    ai_service.initialize()

# API 엔드포인트들
@app.get("/", response_class=JSONResponse)
async def root():
    return {
        "message": "FriendsFixer API - Working Version",
        "status": "running",
        "initialized": ai_service.is_initialized,
        "model_loaded": ai_service.model is not None,
        "rag_loaded": ai_service.rag_db is not None
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        ai_ready=ai_service.is_initialized,
        files={
            "model_exists": config.MODEL_DIR.exists(),
            "database_exists": config.RAG_DB_PATH.exists(),
            "model_path": str(config.MODEL_DIR),
            "db_path": str(config.RAG_DB_PATH),
            "model_loaded": ai_service.model is not None,
            "rag_loaded": ai_service.rag_db is not None
        }
    )

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message is empty")
    
    logger.info(f"💬 Chat request: {request.message[:50]}...")
    
    try:
        result = ai_service.generate_response(
            message=request.message,
            show_hints=request.show_hints
        )
        
        logger.info(f"✅ Response generated ({result['processing_time']}s) - {result['model_used']}")
        
        return ChatResponse(**result)
        
    except Exception as e:
        logger.error(f"❌ Chat processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/api/v1/stats")
async def get_stats():
    return {
        "model_initialized": ai_service.is_initialized,
        "ml_available": ML_AVAILABLE,
        "device": config.DEVICE,
        "model_loaded": ai_service.model is not None,
        "rag_database_size": len(ai_service.rag_db) if ai_service.rag_db is not None else 0,
        "model_config": {
            "base_model": config.BASE_MODEL,
            "max_new_tokens": config.MAX_NEW_TOKENS,
            "temperature": config.TEMPERATURE,
            "top_p": config.TOP_P,
            "rerank_n": config.RERANK_N
        },
        "rag_config": {
            "top_k": config.RAG_TOP_K,
            "min_sim": config.RAG_MIN_SIM,
            "stage": config.RAG_STAGE,
            "k_note_threshold": config.K_NOTE_SIM_TH
        },
        "timestamp": datetime.now().isoformat(),
        "paths": {
            "model_dir": str(config.MODEL_DIR),
            "rag_db_path": str(config.RAG_DB_PATH)
        }
    }

if __name__ == "__main__":
    import uvicorn
    
    print("🎯 FriendsFixer Backend Starting...")
    print(f"📁 Model path: {config.MODEL_DIR}")
    print(f"📊 RAG DB path: {config.RAG_DB_PATH}")
    print(f"🔧 Device: {config.DEVICE}")
    print(f"🤖 ML available: {ML_AVAILABLE}")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )