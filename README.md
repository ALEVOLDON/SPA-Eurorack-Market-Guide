# 🎛️ Eurorack Market Guide // EMG-2026

An interactive web console & navigator for the second-hand Eurorack modular synthesizer market in Europe.  
*Интерактивная веб-консоль и навигатор по вторичному рынку Eurorack-модулей в Европе.*

---

## 🧭 Navigation / Навигация

*   [English Documentation](#english-version)
    *   [Core Features](#-core-features)
    *   [Visual & Audio Design](#-visual--audio-design)
    *   [File Structure](#-file-structure)
    *   [Local Setup](#%EF%B8%8F-local-setup)
    *   [GitHub Pages Deployment](#%EF%B8%8F-github-pages-deployment)
*   [Русская документация](#русская-версия)
    *   [Основные возможности](#-основные-возможности)
    *   [Визуальный и аудио дизайн](#-визуальный-и-аудио-дизайн)
    *   [Структура файлов](#-структура-файлов)
    *   [Локальный запуск](#%EF%B8%8F-локальный-запуск)
    *   [Развертывание на GitHub Pages](#%EF%B8%8F-развертывание-на-github-pages)

---

# English Version

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
└── README.md               # Documentation
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

---

# Русская версия

Добро пожаловать в **Eurorack Market Guide** — интерактивное веб-приложение, стилизованное под лицевую панель аппаратного Eurorack-синтезатора. Проект разработан для помощи музыкантам в покупке, продаже и безопасной ротации модулей на вторичном рынке Европы.

## 🌟 Основные возможности

### 1. Аналитика рынка
*   **Данные ликвидности**: Анализ амортизации, сохранности ценности б/у модулей и популярности различных брендов (Intellijel, Make Noise, Mutable Instruments).
*   **Практические советы**: Объяснение того, почему б/у модули сохраняют от 65% до 85% своей первоначальной цены.

### 2. Интерактивные каналы продаж
*   **Курируемые каталоги**: Сайты сгруппированы по трем вкладкам: Официальные ритейлеры (разделы B-Stock), P2P платформы и Региональные доски объявлений.
*   **Мгновенные фильтры**: Фильтрация модулей в реальном времени по странам (DE, IT, FR, ES, NL, SE, PL, CZ) и опциям: `B-Stock`, `Гарантия`, `Эскроу`, `Форум`.
*   **Подсказки (Tooltips)**: Всплывающие подсказки с объяснением специфических терминов при наведении на теги.

### 3. Калькулятор доходности и график
*   **Симулятор чистой выгоды**: Введите стоимость нового модуля, укажите состояние и посмотрите расчет чистой прибыли по разным каналам сбыта.
*   **Расчет доставки и комиссий**: Учет расходов на доставку по ЕС и комиссии платежной системы PayPal Goods & Services (-3.4% + €0.35) для абсолютной точности расчетов.
*   **Интерактивный график**: Горизонтальная столбчатая диаграмма **Chart.js** автоматически подсвечивает выбранный канал мягким янтарным свечением.

### 4. Технический гид и Симулятор шлейфа питания
*   **Электрическая совместимость**: Информация о разнице напряжения БП США (110В) и Европы (220В).
*   **Симулятор полярности питания (Red Stripe)**: Интерактивный тест подключения 10-контактного кабеля Eurorack. Подключите кабель и проверьте полярность:
    *   *Правильное подключение (Красная полоса к -12V)*: Загорается зеленый диод, звучит аналоговый сигнал запуска (синтезирован через Web Audio API).
    *   *Неправильное подключение (Красная полоса к +12V)*: Загорается красный мигающий диод КЗ, звучит сигнал тревоги.

### 5. Консоль безопасности и VU-индикатор риска
*   **Пошаговый чек-лист**: 5 ключевых шагов перед переводом денег (проверка таймстампов, защита PayPal G&S, репутация на форумах).
*   **VU-Meter шкала риска**: Стрелочный/светодиодный индикатор меняет цвета (Красный ➔ Желтый ➔ Зеленый) в зависимости от уровня безопасности сделки. Сохраняет состояние в `localStorage`.

---

## 🎨 Визуальный и аудио дизайн
*   **Скевоморфный Eurorack-интерфейс**: Контейнеры с декоративными винтами, ручки (knobs) и тумблеры управления, светящиеся диоды.
*   **Режимы темы оформления**:
    *   `Warm Analog Light`: Светлый аналоговый интерфейс (`#f8f7f4`) в теплых бежевых тонах.
    *   `Synth Dark`: Темный светящийся режим кейса (`#0f0e0d`) с неоново-янтарными элементами.
*   **Web Audio API**: Аудио-движок генерирует реальные синтезаторные волны (треугольник/пила) прямо в браузере для звукового моделирования электроники.

---

## 📂 Структура файлов

```text
├── public/                 # Статические файлы (Фавикон, иконки)
├── src/
│   ├── assets/             # Изображения и логотипы
│   ├── data.js             # База данных площадок и подсказок
│   ├── style.css           # Директивы Tailwind v4, переменные @theme и анимации
│   └── main.js             # Логика приложения и инициализация Chart.js
├── index.html              # Основная разметка HTML
├── vite.config.js          # Конфигурация сборщика Vite и плагина Tailwind v4
├── package.json            # Зависимости и скрипты запуска
└── README.md               # Документация
```

---

## 🛠️ Локальный запуск

1.  **Клонируйте репозиторий**:
    ```bash
    git clone https://github.com/ALEVOLDON/SPA-Eurorack-Market-Guide.git
    cd SPA-Eurorack-Market-Guide
    ```

2.  **Установите зависимости**:
    ```bash
    npm install
    ```

3.  **Запустите сервер разработки**:
    ```bash
    npm run dev
    ```
    Откройте в браузере `http://localhost:5173/`. Поддерживается HMR (мгновенное обновление при изменении кода).

4.  **Соберите проект для продакшена**:
    ```bash
    npm run build
    ```
    Готовый оптимизированный билд появится в папке `dist/`.

---

## ⚡️ Развертывание на GitHub Pages

Благодаря настроенным относительным путям (`base: './'` в `vite.config.js`), деплой выполняется очень просто:

1.  Установите вспомогательный пакет `gh-pages`:
    ```bash
    npm install -D gh-pages
    ```
2.  Добавьте скрипт деплоя в `package.json` в секцию `"scripts"`:
    ```json
    "deploy": "npm run build && gh-pages -d dist"
    ```
3.  Запустите команду деплоя:
    ```bash
    npm run deploy
    ```
4.  В настройках репозитория **Settings** -> **Pages** на GitHub убедитесь, что в качестве источника выбрана ветка `gh-pages` (root).
