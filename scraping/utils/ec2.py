import json
from time import sleep
from pymongo.collection import Collection

from utils.reset_collection import reset_collection
from .req import req


class Instance:
    def __init__(self, name: str, location: str, price: float):
        self.name: str = name
        self.memory: float = 0.0
        self.vcpu: float = 0.0
        self.os: str = ""
        self.family: str = ""
        self.locations: list[dict] = [{"name": location, "price": price}]


def ec2(collection: Collection):
    ja = reset_collection(collection)
    regions = req(
        "https://b0.p.awsstatic.com/locations/1.0/aws/current/locations.json")
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
                        new = Instance(
                            name=name, location=location, price=price)
                        new.memory = float(instance["Memory"].split(" ")[0])
                        new.vcpu = float(instance["vCPU"])
                        new.os = instance["Operating System"]
                        new.family = ja[instance["plc:InstanceFamily"]]
                        collection.insert_one(new.__dict__)
        except:
            print(f"取得失敗（{region}）")
