import json
import random
import string
import sys

# Load common first and last names
with open("common_first_names.txt", "r") as f:
    common_first_names = [name.strip() for name in f.readlines()]

with open("common_last_names.txt", "r") as f:
    common_last_names = [name.strip() for name in f.readlines()]

# Load common names for trucking companies
with open("common_company_names.txt", "r") as f:
    common_company_names = [name.strip() for name in f.readlines()]

# Generate random phone number
def generate_phone_number():
    return f"{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"

id_example = "6413a7fa67ed2e065771edb5"
# Generate random alphanumeric string of length 10
def generate_id():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=10))

# Generate company objects
def generate_companies(num_companies):
    companies = []
    for i in range(num_companies):
        # Generate point of contact for company
        poc_name = f"{random.choice(common_first_names)} {random.choice(common_last_names)}"
        poc_mobile_num = generate_phone_number()
        poc_email = f"{poc_name.replace(' ', '.')}@gmail.com"
        poc = {"name": poc_name, "mobile_num": poc_mobile_num, "email": poc_email}

        # Generate list of employee ids
        num_employees = random.randint(7, 13)
        employees = [generate_id() for j in range(num_employees)]

        # Generate company object
        company = {"company_id": generate_id(), "name": random.choice(common_company_names), "point_of_contact": poc, "employees": employees}
        companies.append(company)
    return companies

# Generate user objects for each employee in each company
def generate_users(companies):
    users = []
    for company in companies:
        company_id = company["company_id"]

        for employee_id in company["employees"]:
            user = {"user_id": employee_id, "name": f"{random.choice(common_first_names)} {random.choice(common_last_names)}", "company_id": company_id}
            users.append(user)
    return users

if __name__ == "__main__":
    num_companies = int(sys.argv[1])

    # Generate companies and users
    companies = generate_companies(num_companies)
    users = generate_users(companies)

    # Write companies and users to JSON files
    with open("companies.json", "w") as f:
        json.dump(companies, f, indent=4)

    with open("users.json", "w") as f:
        json.dump(users, f, indent=4)
