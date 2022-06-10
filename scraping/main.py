from pymongo import MongoClient
from utils.ec2 import ec2
from utils._lambda import _lambda
from sys import argv

if __name__ == "__main__":
    with MongoClient("mongodb://root:example@localhost:27017") as client:
        db = client["main"]
        args = []
        all = False
        if len(argv) > 1:
            args = argv[1:]
        else:
            all = True

        if all or "ec2" in args:
            ec2(db["ec2"])
        if all or "lambda" in args:
            _lambda(db["lambda"])
