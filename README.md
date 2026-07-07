# 🎛️ Eurorack Market Guide // EMG-2026

🇷🇺 [Русская версия](README.ru.md)

An interactive web console & navigator for the second-hand Eurorack modular synthesizer market in Europe.

---

Welcome to the **Eurorack Market Guide** — a premium, skeuomorphic, synthesizer-themed web application designed to empower Eurorack enthusiasts in buying, selling, and safely rotating modular synthesizers within the European market.

## 🌟 Core Features

### 1. Market Overview & Analytics
*   **Module Liquidity Data**: Comprehensive insights into depreciation, valuation retention, and fast-moving brands (Intellijel, Make Noise, Mutable Instruments).
*   **Actionable Advice**: Learn why used Eurorack modules hold 65%–85% of their initial retail value.

### 2. Interactive Sales Channels
*   **Curated Databases**: Split into three categories: Official Retailers (B-Stock), P2P Platforms, and Regional Classifieds.
*   **Real-time Tags Filter**: Filter modules instantly by country (DE, IT, FR, ES, NL, SE, PL, CZ) or parameters like `B-Stock`, `Warranty`, `Escrow`, `Forum`.
*   **Interactive Tooltips**: Hover over tags or terms to see detailed definitions and explanations.

### 3. Yield & Payout Calculator
*   **Advanced Cost Simulator**: Enter the original module price, select its physical condition, and view instant returns.
*   **European Shipping & Commission Math**: Factoring in average EU shipping costs and PayPal Goods & Services fees (-3.4% + €0.35) for 100% calculation accuracy.
*   **Reactive Data Visualization**: A horizontal **Chart.js** bar chart that dynamically updates and highlights the selected channel using glowing ambient indicators.

### 4. Technical Guide & Ribbon Cable Simulator
*   **US vs EU Power Guidance**: Warnings on mains power adapter voltages (110V vs 220V) and case power supplies.
*   **Reverse Polarity Simulation**: Test Eurorack 10-pin ribbon cable orientation. Connect the cable to see real-time status:
    *   *Correct Alignment (Red Stripe to -12V)*: Green LED glows, analog startup sound plays (simulated via Web Audio API).
    *   *Incorrect Alignment (Red Stripe to +12V)*: Flashing red warning LED, warning buzzer tone plays (fried module simulator).

### 5. Safety Console & Risk VU-Meter
*   **Step-by-step Verifications**: 5 safety tasks before sending funds (Timestamps, PayPal G&S protection, verification lists).
*   **LED VU-Meter Risk Gauge**: Visual LED indicators change colors dynamically (Red ➔ Amber ➔ Green) to display transaction safety levels from 0% to 100%. Persistence powered by `localStorage`.

---

## 🎨 Visual & Audio Design
*   **Virtual Eurorack Faceplate**: Modular containers with corner screws, synth toggle theme switches, and glowing active LEDs.
*   **Dual Themes**:
    *   `Warm Analog Light`: Cream faceplate feel (`#f8f7f4`) with amber and stone tones.
    *   `Synth Dark`: Glowing synthesizer case dark mode (`#0f0e0d`) featuring neon amber buttons and indicators.
*   **Web Audio API**: Real-time analog synthesizer sound engine generating triangle/sawtooth waves directly in the browser to model module electrical statuses.

---

## 📂 File Structure

```text
├── public/                 # Static assets (Favicons, Icons)
├── src/
│   ├── assets/             # Branding and images
│   ├── data.js             # Sales channels database & tooltips data
│   ├── style.css           # Tailwind v4 directives, @theme variables & animations
│   └── main.js             # Application core logic & Chart.js integration
├── index.html              # Main HTML markup entry point
├── vite.config.js          # Vite bundler & Tailwind v4 plugin configuration
├── package.json            # Project dependencies & scripts
└── README.md               # English Documentation
```

---

## 🛠️ Local Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/ALEVOLDON/SPA-Eurorack-Market-Guide.git
    cd SPA-Eurorack-Market-Guide
    ```

2.  **Install NPM Packages**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173/` in your browser. HMR is enabled.

4.  **Build Production Bundle**:
    ```bash
    npm run build
    ```
    This compiles and optimizes all files into the `dist/` directory.

---

## ⚡️ GitHub Pages Deployment

Since relative asset paths are configured (`base: './'` in `vite.config.js`), deploying to GitHub Pages is seamless:

1.  Install the `gh-pages` helper package:
    ```bash
    npm install -D gh-pages
    ```
2.  Add a deploy script to your `package.json` under `"scripts"`:
    ```json
    "deploy": "npm run build && gh-pages -d dist"
    ```
3.  Deploy the project to the `gh-pages` branch:
    ```bash
    npm run deploy
    ```
4.  Go to **Settings** -> **Pages** in your GitHub repository and verify the deployment branch is set to `gh-pages` (root folder).
