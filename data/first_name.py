import requests

# Make a request to the URL containing the list of common first names
response = requests.get("https://raw.githubusercontent.com/dominictarr/random-name/master/first-names.json")

# Extract the list of first names from the JSON response
names = response.json()

# Take the first 500 names and write them to a text file
with open("common_first_names.txt", "w") as f:
    for name in names[:500]:
        f.write(name + "\n")
