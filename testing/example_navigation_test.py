from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
import time  # Can be used for delay

service_obj = Service()

# To Keep Browser Open Indefinitely
options = webdriver.EdgeOptions()
options.add_experimental_option("detach", True)

driver = webdriver.Edge(options=options, service=service_obj)

driver.maximize_window()
driver.get("http://localhost:3000")

time.sleep(3)  # Give React time to load

# Try to find and click the Parent Portal link/button
try:
    # First look for an anchor tag with href containing dashboard/parent
    parent_link = driver.find_element(By.XPATH, "//a[contains(@href, '/dashboard/parent')]")
    parent_link.click()
except:
    # Fallback: look for text 'Parent Portal'
    try:
        parent_btn = driver.find_element(By.XPATH, "//*[contains(text(), 'Parent Portal')]")
        parent_btn.click()
    except Exception as e:
        print("Could not find Parent Portal link:", e)

time.sleep(3)  # Wait for dashboard to load

# Get navigation links from the sidebar
elements = driver.find_elements(By.TAG_NAME, "a")

print(f"Found {len(elements)} links on the page.")

print("Some visible links:")
count = 0
for E in elements:
    if E.text.strip():
        print(f"- {E.text}")
        count += 1
        if count >= 10:  # Just print the first 10
            break


