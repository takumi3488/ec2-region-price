import json


def cmp(instance: dict) -> str:
    return instance["name"]


with open("public/instance.json") as f:
    data = json.load(f)

data = sorted(data, key=cmp)


def loc_cmp(location: dict) -> float:
    return location["price"]


def sort_loc(x: dict) -> dict:
    x["locations"] = sorted(x["locations"], key=loc_cmp)
    return x


data = list(map(sort_loc, data))

with open("public/instance.json", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
