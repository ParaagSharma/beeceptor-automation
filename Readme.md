# Beeceptor Proxy Automation Script

Automates the process of creating a proxy or callout in Beeceptor. This script uses Playwright to log in to the Beeceptor console, configure proxy settings, and save the configuration based on specified parameters.

## Features

- **Automated Login**: Logs in to Beeceptor using credentials stored in environment variables.
- **Proxy Configuration**: Sets up a proxy or callback with customizable parameters.
- **Secure and Flexible**: Uses environment variables for sensitive data like email and password.
- **Error Handling**: Provides detailed error messages for debugging.
- **Customizable**: Allows users to pass arguments for HTTP method, request conditions, match values, etc.

## Prerequisites

1. **Node.js**: Install Node.js if not already installed. [Download Node.js](https://nodejs.org/).
2. **Playwright**: Install Playwright for browser automation.
   ```bash
   npm install playwright
   ```
3. **dotenv**: Install dotenv for enviournment variables.
    ```bash
    npm install dotenv
    ```

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/ParaagSharma/beeceptor-automation.git
    cd beeceptor-automation
    ```
2. Install dependencies:
   ```bash
   npm install -y
   ```
3. Create a .env file in the project root and add the following:
    ```bash
    BEECEPTOR_EMAIL=your_email@example.com
    BEECEPTOR_PASSWORD=your_password
    ```


## Usage

Run the script using Node.js. You can provide arguments to customize the proxy configuration. If no arguments are provided, default values will be used.

### Command
```bash
node script.js <HTTP_METHOD> <REQUEST_CONDITION> <MATCH_VALUE> <RESPONSE_BEHAVIOR> <ENDPOINT> <MIN_DELAY> <MAX_DELAY>
```

### Arguments

| Argument           | Default Value | Description                                  |
|--------------------|---------------|----------------------------------------------|
| HTTP_METHOD        | GET           | HTTP method for the proxy.                  |
| REQUEST_CONDITION  | EM            | Path condition operator.                    |
| MATCH_VALUE        | /todos        | Path value to match.                        |
| RESPONSE_BEHAVIOR  | wait          | Proxy response behavior.                    |
| ENDPOINT           | `https://mp708f5744854a928749.free.beeceptor.com` | Target endpoint URL. |
| MIN_DELAY          | 1             | Minimum delay for the proxy in seconds.     |
| MAX_DELAY          | 5             | Maximum delay for the proxy in seconds.     |



## Features in Action

1. **Logs In**:
        Automates login to Beeceptor using environment variables for credentials.
2. **Configures Proxy**:
        Allows fine-grained control of the proxy's behavior via command-line arguments.
3. **Error Handling**:
        Graceful handling of missing credentials or runtime errors.
