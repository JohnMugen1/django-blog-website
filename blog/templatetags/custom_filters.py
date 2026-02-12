# templatetags/custom_filters.py
from django import template

register = template.Library()

@register.filter
def reading_time_minutes(word_count, wpm=200):
    import math
    try:
        minutes = math.ceil(int(word_count) / wpm)
        return max(1, minutes)
    except (ValueError, TypeError):
        return 1