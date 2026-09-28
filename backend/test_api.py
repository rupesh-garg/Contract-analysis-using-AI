import requests

url = "http://localhost:8000/upload"
files = {'file': ('test_contract.pdf', open('test_contract.pdf', 'rb'), 'application/pdf')}

try:
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:", response.json())
except Exception as e:
    print(f"Error: {e}")
