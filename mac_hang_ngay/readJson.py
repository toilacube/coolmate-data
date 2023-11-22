import json

# Read the JSON file
with open('data_mac_hang_ngay.json') as file:
    data = json.load(file)

# Specify the index of the object you want to print (n - 1 for nth object, as indexing starts from 0)
n = 47  # Change this to the desired index

# Check if the index is within the range of the list
if 0 <= n < len(data):
    nth_object = data[n]
    print(f"The {n+1}th object in the list is:")
    print(nth_object)
else:
    print(f"The index {n} is out of range.")
