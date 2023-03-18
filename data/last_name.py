import requests

# Make a request to the URL containing the list of common last names
response = requests.get("https://raw.githubusercontent.com/dominictarr/random-name/master/names.json")

# Extract the list of last names from the JSON response
names = response.json()

# Take the first 500 names and write them to a text file
with open("common_last_names.txt", "w") as f:
    for name in names[:500]:
        f.write(name + "\n")
