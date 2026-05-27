<<<<<<< HEAD
=======
# pyrefly: ignore [missing-import]
>>>>>>> prova
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
import time

def test_parent_dashboard():
    # Setup Edge Driver
    service_obj = Service()
    options = webdriver.EdgeOptions()
    options.add_experimental_option("detach", True)
    driver = webdriver.Edge(options=options, service=service_obj)

    try:
        # Maximize and navigate to local frontend
        driver.maximize_window()
        print("Navigating to http://localhost:3000...")
        driver.get("http://localhost:3000")
        
        # Give React app time to load
        time.sleep(3)
        
        # Test 1: Go to Parent Dashboard
        print("Testing Parent Login...")
        # Finding the button with text 'Parent Portal'
        parent_buttons = driver.find_elements(By.XPATH, "//div[contains(text(), 'Parent Portal')]")
        if parent_buttons:
            parent_buttons[0].click()
        else:
            # Fallback if standard buttons have different text
            buttons = driver.find_elements(By.TAG_NAME, "button")
            for btn in buttons:
                if "Parent" in btn.text:
                    btn.click()
                    break
        
        time.sleep(2)
        
<<<<<<< HEAD
=======
        # Login test step (manually providing credentials for the user to see, or waiting)
        # We created parent@gmail.com with password 1234
        
>>>>>>> prova
        # Test 2: Check Sidebar Navigation
        print("Testing Sidebar Navigation...")
        
        # Click on Adoption
        print("Navigating to Adoption...")
        adoption_link = driver.find_element(By.XPATH, "//a[contains(text(), 'Adoption')]")
        adoption_link.click()
        time.sleep(2)
        
        # Click on Browse Children
        print("Navigating to Browse Children...")
        browse_children = driver.find_element(By.XPATH, "//*[contains(text(), 'Browse Children')]")
        browse_children.click()
        time.sleep(3)
<<<<<<< HEAD
=======
        # Enter name
        driver.find_element(By.CLASS_NAME, "mt-2").send_keys("Somik")
>>>>>>> prova
        
        print("Navigation test completed successfully.")
        
    except Exception as e:
        print(f"Test failed with error: {str(e)}")
        
if __name__ == "__main__":
    test_parent_dashboard()
