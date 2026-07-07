# Eurorack Market Guide // EMG-2026

[English](#english) | [Русский](#русский)

---

## English

An interactive web application designed to help musicians navigate the second-hand Eurorack synthesizer module market in Europe.

### Features
*   **Virtual Synthesizer UI**: Skeuomorphic layout mimicking real synthesizer faceplates, featuring glowing status LEDs, toggle switches, and a patch-socket styled navigation bar.
*   **Theme Modes**: Warm Analog Light and Synth Dark (neon orange/amber LEDs) with `localStorage` preference persistence.
*   **Live Resale Calculator & Charts**: Enter original prices and conditions to see dynamic payouts across different channels (P2P, Trade-in, Buyout, Commission), featuring interactive **Chart.js** visuals.
*   **Power Cable Simulator**: Interactive reverse-polarity checking board. Test cable connections (matching the `-12V` Red Stripe) with real-time green/red LED status and synth sound effects generated via Web Audio API.
*   **Safety Score Meter**: 5-step checklist for safe transactions with an animated VU-meter displaying your risk index in real-time.
*   **External Reference Links**: Direct URLs to B-Stock departments of shops, forum BST sections, manufacturer archives, and safety policies.

### Stack
*   **Bundler**: Vite
*   **Logic**: Vanilla JS (ES6 modules)
*   **Styles**: Tailwind CSS v4
*   **Charts**: Chart.js

### Local Development
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
   The compiled assets will be in the `dist/` folder.

---

## Русский

Интерактивное веб-приложение, спроектированное для помощи музыкантам в навигации по вторичному рынку синтезаторных модулей Eurorack в Европе.

### Особенности
*   **Визуальный интерфейс Eurorack**: Скевоморфный дизайн панелей модулей с декоративными винтами, светящимися индикаторами, тумблерами и патч-панелью навигации.
*   **Смена тем оформления**: Warm Analog Light (светлая) и Synth Dark (темная с неоновым янтарным свечением) с сохранением состояния в `localStorage`.
*   **Интерактивный калькулятор окупаемости**: Ввод цены и износа с авторасчетом чистой прибыли (с учетом доставки и комиссий PayPal) и подсветкой результатов на реактивном графике **Chart.js**.
*   **Симулятор шлейфа питания (Red Stripe)**: Обучающий интерактивный стенд для проверки подключения питания. При правильном совмещении красной полосы `-12V` загорается зеленый диод и звучит писк запуска (Web Audio API), при неверном — красный диод сигнализирует о КЗ и звучит сигнал тревоги.
*   **Консоль безопасности (Safety Score)**: Пошаговый чек-лист проверки продавца с анимированным светодиодным индикатором VU-meter уровня риска.
*   **Действующие ссылки**: Кнопки быстрого перехода на B-Stock разделы ритейлеров, маркетплейсы, прошивки и темы безопасности.

### Установка и запуск
1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
3. Соберите проект:
   ```bash
   npm run build
   ```
   Скомпилированные и оптимизированные файлы для публикации будут находиться в папке `dist/`.
