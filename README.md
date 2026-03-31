# 🍪 Cookie Inspector – Privacy & Risk Detection Extension

Cookie Inspector is a Chrome browser extension designed to improve user awareness of web tracking. It analyzes cookies used by websites, classifies them, evaluates privacy risks, and allows users to reset cookie preferences easily.


## Features

**1. Cookie Scanning:**
Detects all cookies associated with the current website

**2. Cookie Classification:**
  - First-party vs Third-party
  - Session vs Persistent cookies

**3. Risk Detection:**
Classifies cookies in to - Low, Medium, High, based on cookie type, expiration time and tracking behavior. Displays risk summary with total number of cookies by each level.

**4. Reset Cookie Preferences:**
Remove all cookie preferences from the current website with reset cookie button.


## Technologies Used

- JavaScript (Core logic)
- HTML (Extension UI)
- CSS (Styling)
- Chrome Extension APIs: Cookies API, Tabs API, Scripting API


## Installation Steps

### 1. Clone the repository

```bash
git clone https://github.com/srdesh/cookie-inspector.git
```

### 2. Manage extension
Open the chrome browser. Go to "manage extensions" or copy and paste the url.

```bash
chrome://extensions/
```

### 3. Load extension
Click "Load unpacked" to upload the extension folder from the local device.

### 4. Run extension!
Run cookie-inspector extension from the top bar. 
Click scan or reset button to inspect cookies or reset preferences from the current browsing website.
