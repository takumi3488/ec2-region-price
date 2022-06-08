from time import sleep
from pymongo import MongoClient
from pymongo.collection import Collection
import requests


class Instance:
    def __init__(self, name: str, location: str, price: float):
        self.name: str = name
        self.memory: float = 0.0
        self.vcpu: float = 0.0
        self.os: str = ""
        self.family: str = ""
        self.locations: list[dict] = [{"name": location, "price": price}]


def req(url: str):
    res = requests.get(url).json()
    return res


def main(collection: Collection):
    collection.delete_many({})
    ja = req("https://i18n-string.us-west-2.prod.pricing.aws.a2z.com/ja_JP.json")
    regions = req(
        "https://b0.p.awsstatic.com/locations/1.0/aws/current/locations.json")
    regions = [x for x in regions]
    for region in regions:
        try:
            data = req(
                f"https://b0.p.awsstatic.com/pricing/2.0/meteredUnitMaps/ec2/USD/current/ec2-ondemand-without-sec-sel/{region}/Linux/index.json")
            for region_data in data["regions"].values():
                for instance in region_data.values():
                    name = instance["Instance Type"]
                    location = ja[instance["Location"]]
                    price = float(instance["price"])
                    old = collection.find_one({"name": name})
                    if old:
                        collection.update_one(
                            {"name": name}, {'$push': {'locations': {"name": location, "price": price}}})
                    else:
                        new = Instance(name=name, location=location, price=price)
                        new.memory = float(instance["Memory"].split(" ")[0])
                        new.vcpu = float(instance["vCPU"])
                        new.os = instance["Operating System"]
                        new.family = ja[instance["plc:InstanceFamily"]]
                        collection.insert_one(new.__dict__)
        except:
            print(f"取得失敗（{region}）")
        sleep(1)


if __name__ == "__main__":
    with MongoClient("mongodb://root:example@localhost:27017") as client:
        db = client["main"]
        collection = db["instance"]
        main(collection)
