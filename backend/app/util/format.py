"""Utility function to help convert data to camel case."""


def to_camel_case(text: str) -> str:
    parts = text.split('_')
    return parts[0] + ''.join(p.title() for p in parts[1:])