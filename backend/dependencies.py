# app/dependencies.py
from fastapi import Request


def get_models(request: Request):
    return request.app.state.models
