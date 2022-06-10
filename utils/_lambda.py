from pymongo.collection import Collection

from utils.reset_collection import reset_collection
from .req import req


def _lambda(collection: Collection):
    ja = reset_collection(collection)
    regions: dict[str, dict[str, dict[str, str]]] = req(
        "https://b0.p.awsstatic.com/pricing/2.0/meteredUnitMaps/lambda/USD/current/lambda.json")["regions"]
    x86 = {"name": "x86", "regions": []}
    arm = {"name": "Arm", "regions": []}
    for region_name in regions:
        region = regions[region_name]
        try:
            for k in regions[region_name]:
                if "Lambda Duration" == k:
                    x86["regions"].append(
                        {"region": ja[region_name], "price": float(region[k]["price"])})
                if "Lambda Duration-ARM" == k:
                    arm["regions"].append(
                        {"region": ja[region_name], "price": float(region[k]["price"])})
        except:
            print(f"取得失敗（{region}）")
    collection.insert_many([x86, arm])
