from korean_romanizer.romanizer import Romanizer
from pypinyin import lazy_pinyin
import pykakasi
from deep_translator import GoogleTranslator  # Si lo usas aquí


def romanize_text(text, language):
    try:
        if language == 'ko':  # Coreano
            return f'{Romanizer(text).romanize()} ({text})'
        elif language == 'zh':  # Chino
            pinyin = ' '.join(lazy_pinyin(text))
            return f'{pinyin} ({text})'
        elif language == 'ja':  # Japonés
            kks = pykakasi.kakasi()
            kks.setMode('H', 'a')
            kks.setMode('K', 'a')
            kks.setMode('J', 'a')
            conv = kks.getConverter()
            return f'{conv.do(text)} ({text})'
    except Exception:
        pass  # Si falla la romanización, devolvemos el texto original
    return text


def translate(text):
    """Traduce a español. Si el traductor falla (rate limit, red, etc.),
    devuelve el texto original sin lanzar excepción."""
    if not text:
        return text
    try:
        return GoogleTranslator(source='auto', target='es').translate(text)
    except Exception:
        return text
