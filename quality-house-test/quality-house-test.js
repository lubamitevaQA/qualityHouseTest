const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function automateContactUs() {
  let options = new chrome.Options();

  // Initialize the WebDriver
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Maximize the browser window
    await driver.manage().window().maximize();
    //Open qualityhouse.com website
    await driver.get("https://qualityhouse.com/");

    //Click “Contact Us” button from the main banner.
    let contactUsButton = await driver.findElement(
      By.xpath("//*[@id='mainNav']/li[4]/a")
    );
    await contactUsButton.click();

    await driver.sleep(3000);

    //Check you are correctly redirected to the Contact us page using any unique element present on the page.
    //initilise the chosen element - 'Our Offices' heading
    let uniqueElement = await driver.wait(
      until.elementLocated(
        By.xpath("/html/body/div[2]/div/div[1]/div/div[2]/div")
      ),
      10000
    );

    // Verify the the element is displayed on the page
    if (await uniqueElement.isDisplayed()) {
      console.log("Successfully redirected to the Contact Us page.");

      //Fill in all fields in the “Contact us” form with relevant data.
      //full name
      await driver
        .findElement(By.xpath("//*[@id='name']"))
        .sendKeys("Lyubov Miteva");
      //email address
      await driver
        .findElement(By.xpath("//*[@id='email']"))
        .sendKeys("lubamiteva@gmail.com");
      //subject
      await driver
        .findElement(By.xpath("//*[@id='subject']"))
        .sendKeys("QH Automation task");
      //message
      await driver
        .findElement(By.xpath("//*[@id='message']"))
        .sendKeys("QH Automation task");
      //how did you hear about us - select option
      await driver
        .findElement(
          By.xpath("//*[@id='hear'] //option[text()='Another Website']")
        )
        .click();
      //how did you hear about us - add extra info
      await driver
        .findElement(By.xpath("//*[@id='other']"))
        .sendKeys("jobs.bg");

      //Tick the GDPR checkbox
      let gdprCheckbox = await driver.findElement(
        By.css('input[type="checkbox"]')
      );
      await gdprCheckbox.click();

      //submit the form
      let submitButton = await driver.findElement(
        By.xpath(
          "/html/body/div[2]/div/div[1]/div/div[1]/form/div[7]/div/input"
        )
      );
      await submitButton.click();

      await driver.sleep(3000); // Wait for 3 seconds

      //verify expected result of successful form submission
      //wait for the element to be displayed
      let successMessage = await driver.wait(
        until.elementLocated(
          By.xpath("/html/body/div[2]/div/div[1]/div/div[1]/div/div")
        ),
        10000
      );
      //if the element is displayed, show
      if (await successMessage.isDisplayed()) {
        console.log("Form submission is Successful");
      } else {
        console.log("Form submission failed.");
      }

      //get the text from the <div>
      let actualText = await successMessage.getText();

      //verify the text
      const expectedText = "Your message is sent successfully!";
      //verify you're not getting a false positive, see notes in instructions
      //const expectedText = "Your test failed successfully!";

      if (actualText === expectedText) {
        console.log("Text verification successful: ", actualText);
      } else {
        console.log(
          "Text verification failed. Expected: ",
          expectedText,
          "but got: ",
          actualText
        );
      }
    } else {
      console.log("Failed to verify redirection to the Contact Us page.");
    }
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    // Close the browser
    await driver.quit();
  }
})();
