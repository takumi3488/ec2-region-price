import requests

def req(url: str):
    res = requests.get(url).json()
    return res
