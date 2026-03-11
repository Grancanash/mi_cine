from korean_romanizer.romanizer import Romanizer
from pypinyin import lazy_pinyin
import pykakasi
from deep_translator import GoogleTranslator  # Si lo usas aquí


def romanize_text(text, language):
    if language == 'ko':  # Coreano
        return f'{Romanizer(text).romanize()} ({text})'
    elif language == 'zh':  # Chino
        return f'{' '.join(lazy_pinyin(text))} ({text})'
    elif language == 'ja':  # Japonés
        kks = pykakasi.kakasi()
        kks.setMode('H', 'a')
        kks.setMode('K', 'a')
        kks.setMode('J', 'a')
        conv = kks.getConverter()
        return f'{conv.do(text)} ({text})'
    return text


def translate(text):
    return GoogleTranslator(source='auto', target='es').translate(text)
