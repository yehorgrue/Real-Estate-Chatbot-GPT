import json

with open('./cities.json', 'r') as json_file:
    data = json.load(json_file)

unique_list = list(set(data['cities']))


with open('output.json', 'w') as json_file:
    json.dump(unique_list, json_file)
