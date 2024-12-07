/**
 * Automates the process of creating a proxy or callback in Beeceptor.
 *
 * This script uses Playwright to log in to Beeceptor, navigate to the configuration page,
 * and set up a proxy/callback with specified parameters.
 *
 * Usage:
 *   1. Set the environment variables `BEECEPTOR_EMAIL` and `BEECEPTOR_PASSWORD`.
 *   2. Run the script:
 *      node script.js <HTTP_METHOD> <REQUEST_CONDITION> <MATCH_VALUE> <RESPONSE_BEHAVIOR> <ENDPOINT> <MIN_DELAY> <MAX_DELAY>
 *   3. Replace arguments as needed or let the defaults apply.
 *
 * Parameters:
 *   - HTTP_METHOD: HTTP method for the proxy (default: "GET").
 *   - REQUEST_CONDITION: Path condition operator (default: "EM").
 *   - MATCH_VALUE: Path value to match (default: "/todos").
 *   - RESPONSE_BEHAVIOR: Proxy response behavior (default: "wait").
 *   - ENDPOINT: Target endpoint URL (default: "https://mp708f5744854a928749.free.beeceptor.com").
 *   - MIN_DELAY: Minimum delay for the proxy in seconds (default: "1").
 *   - MAX_DELAY: Maximum delay for the proxy in seconds (default: "5").
 */

const { chromium } = require("playwright");
require("dotenv").config();

// Function to validate HTTP method
function validateHttpMethod(method) {
  const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];
  if (!validMethods.includes(method.toUpperCase())) {
    console.error(`Error: Invalid HTTP method. Must be one of ${validMethods.join(", ")}`);
    process.exit(1);
  }
}

// Function to validate delay values (must be positive integers)
function validateDelay(value, name) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num <= 0) {
    console.error(`Error: ${name} must be a positive integer.`);
    process.exit(1);
  }
  return num;
}

// Function to validate URL format
function validateURL(url) {
  const urlPattern = /^(https?):\/\/[^\s$.?#].[^\s]*$/;
  if (!urlPattern.test(url)) {
    console.error(`Error: Invalid URL format. Provided URL: ${url}`);
    process.exit(1);
  }
}


(async () => {
  // Validate environment variables
  const email = process.env.BEECEPTOR_EMAIL;
  const password = process.env.BEECEPTOR_PASSWORD;
  if (!email || !password) {
    console.error("Error: Missing BEECEPTOR_EMAIL or BEECEPTOR_PASSWORD in environment variables.");
    process.exit(1);
  }

  // Collect and validate command-line arguments
  const httpMethod = (process.argv[2] ? process.argv[2].toUpperCase() : "GET");
  validateHttpMethod(httpMethod);

  const requestCondition = process.argv[3] || "EM"; 
  const matchValue = process.argv[4] || "/todos";
  const responseBehavior = process.argv[5] || "wait"; 
  const endpoint = process.argv[6] || "https://mp708f5744854a928749.free.beeceptor.com";
  validateURL(endpoint);

  const minDelay = process.argv[7] || "1";
  const maxDelay = process.argv[8] || "5";

  validateDelay(minDelay, "Minimum delay");
  validateDelay(maxDelay, "Maximum delay");

  // Ensure maxDelay is not less than minDelay
  if (parseInt(maxDelay, 10) < parseInt(minDelay, 10)) {
    console.error("Error: Maximum delay cannot be less than minimum delay.");
    process.exit(1);
  }

  console.log("\n\nVerify your configuration details:");
  console.log(`HTTP Method: ${httpMethod}`);
  console.log(`Request Condition: ${requestCondition}`);
  console.log(`Match Value: ${matchValue}`);
  console.log(`Response Behavior: ${responseBehavior}`);
  console.log(`Target Endpoint: ${endpoint}`);
  console.log(`Min Delay: ${minDelay} seconds`);
  console.log(`Max Delay: ${maxDelay} seconds\n\n`);

  // Launching the browser
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("Navigating to Beeceptor...");
    await page.goto("https://app.beeceptor.com/");
    await page.waitForLoadState("domcontentloaded");

    console.log("Logging in...");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click('button[type="submit"]');

    console.log("Navigating to endpoint settings...");
    await page.goto("https://app.beeceptor.com/console/paraag");

    console.log("Accessing Mocking Rules...");
    await page.click('a.btn.btn-link.btn-sm[data-toggle="modal"][data-target=".allRules"]');
    await page.click('button[aria-haspopup="true"][aria-expanded="false"]');
    await page.click(
      'div.btn-group ul.dropdown-menu li a[href="#"]:has-text("Create Proxy or Callout")'
    );

    console.log("Configuring the proxy...");
    await page.selectOption("#matchMethod", { value: httpMethod });
    await page.selectOption("#pathOperator", { value: requestCondition });
    await page.fill("#matchPath", matchValue);

    await page.waitForSelector("#proxyEdit\\.behavior");
    await page.selectOption("#proxyEdit\\.behavior", { value: responseBehavior });
    await page.fill("#targetEndpoint", endpoint);
    await page.fill("#proxyMinDelay", minDelay);
    await page.fill("#proxyMaxDelay", maxDelay);

    console.log("Saving the configuration...");
    await page.click("#saveProxy");

    console.log("Proxy/callback configuration completed successfully.");
  } catch (error) {
    console.error("An error occurred during the execution:", error.message);
    process.exit(1);
  } finally {
    console.log("Closing the browser...");
    await browser.close();
  }
})();
