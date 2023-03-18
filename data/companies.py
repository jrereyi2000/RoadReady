import requests

# Make a request to the URL containing the list of common trucking companies
response = requests.get("https://raw.githubusercontent.com/mikesdavis/fake-logistics/master/companies.txt")

# Extract the list of companies from the text response
companies = response.text.splitlines()

# Take the first 100 companies and write them to a text file
with open("common_trucking_companies.txt", "w") as f:
    for company in companies[:100]:
        f.write(company + "\n")