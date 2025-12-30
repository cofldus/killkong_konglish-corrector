# backend/utils/text_processing.py
import re
import unicodedata
from typing import List

def normalize_text(text: str) -> str:
    """텍스트 정규화"""
    text = unicodedata.normalize("NFKC", str(text))
    return re.sub(r"\s+", " ", text).strip()

def tok_list(text: str) -> List[str]:
    """단어 토큰화"""
    pattern = re.compile(r"\w[\w'-]*")
    return [t.lower() for t in pattern.findall(normalize_text(text))]

def content_tokens(tokens: List[str], stop_words: set) -> List[str]:
    """불용어 제거"""
    return [t for t in tokens if t not in stop_words]

# 상수
STOP_WORDS = {
    "a", "an", "the", "to", "for", "of", "in", "on", "at", "by", "and", "or", "but", "so",
    "that", "this", "these", "those", "is", "are", "was", "were", "am", "be", "been", "being",
    "do", "does", "did", "have", "has", "had", "get", "got", "gotten", 
    "we", "i", "you", "they", "he", "she", "it",
    "my", "your", "his", "her", "their", "our", "me", "him", "them", "us", 
    "let", "let's", "just"
}

TIME_WORDS = {
    "last", "next", "yesterday", "today", "tonight", "tomorrow",
    "morning", "afternoon", "evening", "night", "nights", "day", "days", 
    "week", "weeks", "weekend", "weekends",
    "month", "months", "year", "years", "season", "seasons",
    "spring", "summer", "fall", "autumn", "winter",
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
}

COLORS = {"red", "blue", "green", "black", "white", "gray", "grey", "yellow", "pink", "purple", "brown", "orange"}

VERB_BASE = {
    "play", "played", "buy", "go", "come", "make", "take", "see", "watch", 
    "call", "ask", "need", "want", "like", "love", "use", "try",
    "pay", "drive", "walk", "run", "eat", "drink", "work", "study", 
    "have", "get", "give", "feel", "think", "say", "tell"
}