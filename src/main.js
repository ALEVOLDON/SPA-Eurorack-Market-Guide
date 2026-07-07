import './style.css';
import Chart from 'chart.js/auto';
import { channelsData, tooltipsData } from './data.js';

// Глобальное состояние
let currentTab = 'retailers';
let activeFilters = [];
let chartInstance = null;
let cablePlugged = false;
let cableFlipped = false;
let audioCtx = null;

// Список ID чекбоксов чек-листа
const checklistIds = ['check-1', 'check-2', 'check-3', 'check-4', 'check-5'];

// Инициализация при загрузке DOM
window.addEventListener('DOMContentLoaded', () => {
  // Настройка темы
  const themeToggle = document.getElementById('themeToggle');
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    updateThemeUI(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeUI(false);
  }

  // Слушатель смены темы
  themeToggle.addEventListener('click', toggleTheme);

  // Настройка слушателей вкладок
  document.getElementById('tab-retailers').addEventListener('click', () => switchTab('retailers'));
  document.getElementById('tab-p2p').addEventListener('click', () => switchTab('p2p'));
  document.getElementById('tab-regional').addEventListener('click', () => switchTab('regional'));

  // Настройка слушателей кнопок фильтров
  document.querySelectorAll('#filterContainer button').forEach(button => {
    button.addEventListener('click', (e) => {
      const filter = e.target.getAttribute('data-filter');
      toggleFilter(filter);
    });
  });

  // Настройка слушателей калькулятора
  document.getElementById('calcPrice').addEventListener('input', updateCalculator);
  document.getElementById('calcCondition').addEventListener('change', updateCalculator);
  document.getElementById('calcChannel').addEventListener('change', updateCalculator);
  document.getElementById('calcShipping').addEventListener('input', updateCalculator);
  document.getElementById('calcPaypal').addEventListener('change', updateCalculator);

  // Настройка симулятора питания
  document.getElementById('flipCableBtn').addEventListener('click', flipCable);
  document.getElementById('plugBtn').addEventListener('click', togglePlug);

  // Настройка чек-листа безопасности
  checklistIds.forEach(id => {
    document.getElementById(id).addEventListener('change', updateSafetyScore);
  });
  document.getElementById('resetChecklistBtn').addEventListener('click', resetChecklist);

  // Отрисовка каналов продаж
  switchTab('retailers');
  
  // Инициализация графика Chart.js
  initChart();

  // Загрузка чек-листа из localStorage
  loadChecklist();

  // Преобразование стандартных select в кастомные списки
  convertSelectsToCustom();

  // Первоначальный расчет калькулятора
  updateCalculator();

  // Подключение всплывающих подсказок (Tooltips)
  setupTooltips();

  // Настройка мобильного меню
  setupMobileMenu();

  // Настройка кнопки наверх
  setupScrollToTop();

  // Настройка скролла вкладок на мобильном
  setupTabsScrolling();
});

// Функция переключения тем оформления
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeUI(isDark);
  
  // Перестраиваем график с новыми цветами сетки и текста
  if (chartInstance) {
    chartInstance.destroy();
    initChart();
    updateCalculator();
  }
}

function updateThemeUI(isDark) {
  const knob = document.getElementById('themeToggleKnob');
  const led = document.getElementById('themeLed');
  // На мобильном переключатель w-10, на десктопе w-12 → разный сдвиг ноба
  const isMobile = window.innerWidth < 640;
  const translateClass = isMobile ? 'translate-x-4' : 'translate-x-6';
  if (isDark) {
    knob.classList.remove('translate-x-4', 'translate-x-6');
    knob.classList.add(translateClass);
    led.classList.remove('bg-stone-400');
    led.classList.add('bg-amber-500', 'led-glow-amber');
  } else {
    knob.classList.remove('translate-x-4', 'translate-x-6');
    led.classList.add('bg-stone-400');
    led.classList.remove('bg-amber-500', 'led-glow-amber');
  }
}

// Логика работы с вкладками и фильтрами
function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('border-amber-500', 'text-amber-500');
    btn.classList.add('border-transparent', 'text-stone-400', 'dark:text-stone-500');
  });
  
  const activeTabBtn = document.getElementById(`tab-${tabId}`);
  activeTabBtn.classList.add('border-amber-500', 'text-amber-500');
  activeTabBtn.classList.remove('border-transparent', 'text-stone-400', 'dark:text-stone-500');

  renderChannels();
}

function toggleFilter(filterTag) {
  const index = activeFilters.indexOf(filterTag);
  if (index > -1) {
    activeFilters.splice(index, 1);
  } else {
    activeFilters.push(filterTag);
  }
  
  // Стилизация кнопок фильтров
  document.querySelectorAll('.tag-btn').forEach(btn => {
    const tag = btn.getAttribute('data-filter');
    if (activeFilters.includes(tag)) {
      btn.classList.add('bg-amber-500', 'text-white', 'border-amber-600');
      btn.classList.remove('bg-stone-100', 'dark:bg-stone-900', 'border-synth-border-light', 'dark:border-synth-border-dark');
    } else {
      btn.classList.remove('bg-amber-500', 'text-white', 'border-amber-600');
      btn.classList.add('bg-stone-100', 'dark:bg-stone-900', 'border-synth-border-light', 'dark:border-synth-border-dark');
    }
  });

  renderChannels();
}

function renderChannels() {
  const container = document.getElementById('channelsContainer');
  container.style.opacity = '0';
  
  setTimeout(() => {
    container.innerHTML = '';
    const items = channelsData[currentTab];

    items.forEach(item => {
      // Проверяем, совпадает ли хотя бы один активный фильтр
      let hasMatch = activeFilters.length === 0;
      if (activeFilters.length > 0) {
        hasMatch = item.tags.some(tag => activeFilters.includes(tag));
      }

      // Карточка модуля
      const card = document.createElement('div');
      card.className = `relative border-2 border-synth-border-light dark:border-synth-border-dark bg-synth-panel-light dark:bg-synth-panel-dark p-5 rounded-lg transition-all duration-300 shadow-sm flex flex-col justify-between ${hasMatch ? 'opacity-100 scale-100' : 'opacity-40 scale-95 pointer-events-none'}`;
      
      // Небольшие крепежные винты по углам
      card.innerHTML = `
        <div class="absolute top-1.5 left-1.5 w-2 h-2 rounded-full border border-stone-400 dark:border-stone-600 flex items-center justify-center"><div class="w-1.5 h-[1px] bg-stone-400 dark:bg-stone-600 rotate-45"></div></div>
        <div class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-stone-400 dark:border-stone-600 flex items-center justify-center"><div class="w-1.5 h-[1px] bg-stone-400 dark:bg-stone-600 -rotate-45"></div></div>
        
        <div>
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-bold text-sm text-stone-800 dark:text-stone-100 uppercase tracking-wide">${item.name}</h4>
            <div class="flex gap-1">
              ${item.tags.map(t => `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-500">${t}</span>`).join('')}
            </div>
          </div>
          <p class="text-xs text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">${item.desc}</p>
        </div>
        
        <div class="mt-4 pt-3 border-t border-synth-border-light dark:border-synth-border-dark">
          <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Специфика канала:</span>
          <p class="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed mb-4">${item.features}</p>
          
          <a href="${item.url}" target="_blank" class="w-full inline-block text-center bg-stone-200 dark:bg-stone-800 border border-synth-border-light dark:border-synth-border-dark text-[10px] uppercase font-bold py-2 rounded hover:border-amber-500 hover:text-amber-500 transition-colors">
            Перейти на сайт ↗
          </a>
        </div>
      `;
      container.appendChild(card);
    });

    container.style.opacity = '1';
  }, 150);
}

// Инициализация и обновление графика Chart.js
function initChart() {
  const ctx = document.getElementById('profitChart').getContext('2d');
  const isDark = document.documentElement.classList.contains('dark');
  
  const gridColor = isDark ? '#2e2a27' : '#e5e1d8';
  const textColor = isDark ? '#f8f7f4' : '#1c1917';

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Выкуп наличными', 'Trade-in / Обмен', 'Комиссия агента', 'Прямая P2P продажа'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)'
        ],
        borderColor: [
          '#ef4444',
          '#f59e0b',
          '#3b82f6',
          '#10b981'
        ],
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: 'Space Grotesk' } }
        },
        y: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Space Grotesk', weight: 'bold' } }
        }
      }
    }
  });
}

// Логика калькулятора выгоды
function updateCalculator() {
  const price = parseFloat(document.getElementById('calcPrice').value) || 0;
  const condition = document.getElementById('calcCondition').value;
  const channel = document.getElementById('calcChannel').value;
  const shipping = parseFloat(document.getElementById('calcShipping').value) || 0;
  const usePaypal = document.getElementById('calcPaypal').checked;

  // Динамически управляем доступностью полей ввода (доставка/PayPal) в зависимости от канала
  const shippingInput = document.getElementById('calcShipping');
  const paypalCheckbox = document.getElementById('calcPaypal');
  const paypalLabel = paypalCheckbox.closest('label');
  const shippingLabel = shippingInput.previousElementSibling;

  if (channel === 'buyout' || channel === 'tradein') {
    // В офлайн каналах (выкуп, трейд-ин) доставка и PayPal не применяются
    shippingInput.disabled = true;
    shippingInput.classList.add('opacity-40', 'pointer-events-none');
    shippingLabel.classList.add('opacity-40');
    
    paypalCheckbox.disabled = true;
    paypalLabel.classList.add('opacity-40', 'pointer-events-none');
  } else if (channel === 'commission') {
    // При комиссии агента есть доставка, но нет комиссии PayPal (агент берет фиксу/процент)
    shippingInput.disabled = false;
    shippingInput.classList.remove('opacity-40', 'pointer-events-none');
    shippingLabel.classList.remove('opacity-40');

    paypalCheckbox.disabled = true;
    paypalLabel.classList.add('opacity-40', 'pointer-events-none');
  } else if (channel === 'p2p') {
    // При прямой P2P продаже применяется и доставка, и комиссия PayPal
    shippingInput.disabled = false;
    shippingInput.classList.remove('opacity-40', 'pointer-events-none');
    shippingLabel.classList.remove('opacity-40');

    paypalCheckbox.disabled = false;
    paypalLabel.classList.remove('opacity-40', 'pointer-events-none');
  }

  // Модификатор состояния
  let conditionMod = 0.8;
  if (condition === 'mint') conditionMod = 0.9;
  if (condition === 'excellent') conditionMod = 0.8;
  if (condition === 'good') conditionMod = 0.7;
  if (condition === 'poor') conditionMod = 0.5;

  const baseValue = price * conditionMod;
  document.getElementById('baseValueText').textContent = `€${baseValue.toFixed(2)}`;

  // Расчет комиссии PayPal (3.4% + 0.35 EUR)
  const calcPaypalFee = (amount) => {
    return usePaypal ? (amount * 0.034 + 0.35) : 0;
  };

  // Варианты сбыта (базовый расчет)
  const buyoutValue = Math.max(0, baseValue * 0.5); // Выкуп: 50%, без доставки/PayPal
  const tradeinValue = Math.max(0, baseValue * 0.65); // Trade-in: 65%, без доставки/PayPal
  
  // Комиссия агента: 20-25% комиссия, берем среднее 22.5% -> остается 77.5%, вычитаем доставку
  const commissionValue = Math.max(0, baseValue * 0.775 - shipping);
  
  // P2P: 95% от базовой цены, вычитаем доставку и PayPal
  const p2pGross = baseValue * 0.95;
  const p2pValue = Math.max(0, p2pGross - shipping - calcPaypalFee(p2pGross));

  // Определение чистой выручки для выбранного канала
  let netPayout = 0;
  if (channel === 'buyout') netPayout = buyoutValue;
  if (channel === 'tradein') netPayout = tradeinValue;
  if (channel === 'commission') netPayout = commissionValue;
  if (channel === 'p2p') netPayout = p2pValue;

  document.getElementById('netPayoutText').textContent = `€${netPayout.toFixed(2)}`;

  // Обновление данных графика
  if (chartInstance) {
    chartInstance.data.datasets[0].data = [buyoutValue, tradeinValue, commissionValue, p2pValue];
    
    // Подсветим выбранный бар
    const normalColors = [
      'rgba(239, 68, 68, 0.4)',
      'rgba(245, 158, 11, 0.4)',
      'rgba(59, 130, 246, 0.4)',
      'rgba(16, 185, 129, 0.4)'
    ];
    const highlightColors = [
      'rgba(239, 68, 68, 0.85)',
      'rgba(245, 158, 11, 0.85)',
      'rgba(59, 130, 246, 0.85)',
      'rgba(16, 185, 129, 0.85)'
    ];

    let indexToHighlight = 0;
    if (channel === 'buyout') indexToHighlight = 0;
    if (channel === 'tradein') indexToHighlight = 1;
    if (channel === 'commission') indexToHighlight = 2;
    if (channel === 'p2p') indexToHighlight = 3;

    const newBg = [...normalColors];
    newBg[indexToHighlight] = highlightColors[indexToHighlight];
    
    chartInstance.data.datasets[0].backgroundColor = newBg;
    chartInstance.update();
  }
}

// Симулятор правильной полярности питания
function flipCable() {
  cableFlipped = !cableFlipped;
  const redStripe = document.getElementById('redStripe');
  const indicator = document.getElementById('redStripeIndicator');
  
  if (cableFlipped) {
    redStripe.classList.remove('right-0');
    redStripe.classList.add('left-0');
    redStripe.classList.remove('rounded-l');
    redStripe.classList.add('rounded-r');
    indicator.textContent = '-12V ►';
    indicator.classList.remove('mr-1');
    indicator.classList.add('ml-1');
  } else {
    redStripe.classList.remove('left-0');
    redStripe.classList.add('right-0');
    redStripe.classList.remove('rounded-r');
    redStripe.classList.add('rounded-l');
    indicator.textContent = '◄ -12V';
    indicator.classList.remove('ml-1');
    indicator.classList.add('mr-1');
  }

  if (cablePlugged) {
    checkPowerSafety();
  }
}

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSynthSound(freq, type, duration) {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.type = type;
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ошибки Web Audio API подавляются
  }
}

function togglePlug() {
  cablePlugged = !cablePlugged;
  const cable = document.getElementById('cable');
  const plugBtn = document.getElementById('plugBtn');

  if (cablePlugged) {
    cable.classList.remove('bg-stone-300', 'dark:bg-stone-800');
    cable.classList.add('bg-stone-400', 'dark:bg-stone-700', 'translate-y-[-24px]');
    plugBtn.textContent = 'Отключить';
    plugBtn.classList.remove('bg-amber-600', 'hover:bg-amber-500');
    plugBtn.classList.add('bg-stone-500', 'hover:bg-stone-400');
    checkPowerSafety();
  } else {
    cable.classList.add('bg-stone-300', 'dark:bg-stone-800');
    cable.classList.remove('bg-stone-400', 'dark:bg-stone-700', 'translate-y-[-24px]');
    plugBtn.textContent = 'Подключить';
    plugBtn.classList.add('bg-amber-600', 'hover:bg-amber-500');
    plugBtn.classList.remove('bg-stone-500', 'hover:bg-stone-400');
    
    const led = document.getElementById('powerLed');
    led.className = 'w-3 h-3 rounded-full bg-stone-400';
    document.getElementById('powerStatus').textContent = 'Кабель отключен. Проверьте полярность.';
    document.getElementById('powerStatus').className = 'text-[11px] text-stone-500 mt-2 text-center uppercase tracking-wider';
  }
}

function checkPowerSafety() {
  const led = document.getElementById('powerLed');
  const statusText = document.getElementById('powerStatus');

  if (!cableFlipped) {
    led.className = 'w-3 h-3 rounded-full bg-green-500 led-glow-green';
    statusText.textContent = 'ПИТАНИЕ ПОДАНО: Модуль работает штатно.';
    statusText.className = 'text-[11px] text-green-600 dark:text-green-400 mt-2 text-center font-bold uppercase tracking-wider';
    
    playSynthSound(440, 'triangle', 0.6);
    setTimeout(() => playSynthSound(880, 'sine', 0.3), 150);
  } else {
    led.className = 'w-3 h-3 rounded-full bg-red-500 led-glow-red animate-ping';
    statusText.textContent = 'ОШИБКА ПОЛЯРНОСТИ! Модуль сгорел!';
    statusText.className = 'text-[11px] text-red-500 mt-2 text-center font-bold uppercase tracking-wider animate-bounce';
    
    playSynthSound(110, 'sawtooth', 0.8);
  }
}

// Загрузка состояния чек-листа
function loadChecklist() {
  checklistIds.forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved === 'true') {
      document.getElementById(id).checked = true;
    }
  });
  updateSafetyScore();
}

function updateSafetyScore() {
  let score = 0;
  checklistIds.forEach(id => {
    const isChecked = document.getElementById(id).checked;
    localStorage.setItem(id, isChecked);
    if (isChecked) score++;
  });

  // Отрисовка светодиодов шкалы VU-Meter
  for (let i = 1; i <= 5; i++) {
    const led = document.getElementById(`led-${i}`);
    if (i <= score) {
      if (i <= 2) {
        led.className = 'w-full h-3 rounded bg-red-500 led-glow-red';
      } else if (i === 3) {
        led.className = 'w-full h-3 rounded bg-amber-500 led-glow-amber';
      } else {
        led.className = 'w-full h-3 rounded bg-green-500 led-glow-green';
      }
    } else {
      led.className = 'w-full h-3 rounded bg-stone-300 dark:bg-stone-800';
    }
  }

  const statusText = document.getElementById('safetyStatusText');
  const adviseText = document.getElementById('safetyAdviseText');

  if (score <= 1) {
    statusText.textContent = 'Критический уровень риска';
    statusText.className = 'text-xs uppercase font-bold text-red-500 tracking-wider';
    adviseText.textContent = 'Сделка крайне небезопасна. Запросите подтверждение личности.';
  } else if (score === 2) {
    statusText.textContent = 'Высокий уровень риска';
    statusText.className = 'text-xs uppercase font-bold text-red-400 tracking-wider';
    adviseText.textContent = 'Откажитесь от предоплаты без защиты PayPal G&S.';
  } else if (score === 3) {
    statusText.textContent = 'Средний уровень риска';
    statusText.className = 'text-xs uppercase font-bold text-amber-500 tracking-wider';
    adviseText.textContent = 'Проверьте дату регистрации профиля продавца.';
  } else if (score === 4) {
    statusText.textContent = 'Минимальный уровень риска';
    statusText.className = 'text-xs uppercase font-bold text-green-500 tracking-wider';
    adviseText.textContent = 'Остался один шаг проверки для полной уверенности.';
  } else if (score === 5) {
    statusText.textContent = 'Безопасно';
    statusText.className = 'text-xs uppercase font-bold text-green-400 tracking-wider led-glow-green';
    adviseText.textContent = 'Все проверки пройдены. Можете совершать покупку!';
  }
}

function resetChecklist() {
  checklistIds.forEach(id => {
    document.getElementById(id).checked = false;
    localStorage.setItem(id, false);
  });
  updateSafetyScore();
}

// Настройка всплывающих подсказок (Tooltips)
function setupTooltips() {
  const tooltip = document.getElementById('tooltip');
  let touchTimeout = null;

  const showTooltip = (target) => {
    const isTag = target.classList.contains('tag-btn') || target.tagName === 'A';
    if (!isTag) return false;
    const text = target.textContent.trim().split(' ')[0].replace('(', '').replace(')', '');
    const tooltipText = tooltipsData[text];
    if (!tooltipText) return false;

    tooltip.textContent = tooltipText;
    tooltip.classList.remove('hidden');

    const rect = target.getBoundingClientRect();
    const tooltipLeft = Math.min(rect.left + window.scrollX, window.innerWidth - 200);
    tooltip.style.left = `${Math.max(8, tooltipLeft)}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
    return true;
  };

  const hideTooltip = () => {
    tooltip.classList.add('hidden');
  };

  // Mouse-события (десктоп)
  document.addEventListener('mouseover', (e) => {
    showTooltip(e.target);
  });
  document.addEventListener('mouseout', (e) => {
    const isTag = e.target.classList.contains('tag-btn') || e.target.tagName === 'A';
    if (isTag) hideTooltip();
  });

  // Touch-события (мобильный)
  document.addEventListener('touchstart', (e) => {
    const target = e.target;
    if (showTooltip(target)) {
      // Автоскрытие через 2 секунды
      clearTimeout(touchTimeout);
      touchTimeout = setTimeout(hideTooltip, 2000);
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    // Не скрываем сразу — даём пользователю прочитать подсказку
  }, { passive: true });
}
// Мобильное меню (Drawer)
function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const menuDrawer = document.getElementById('menuDrawer');
  const menuOverlay = document.getElementById('menuOverlay');
  const burgerLine1 = document.getElementById('burgerLine1');
  const burgerLine2 = document.getElementById('burgerLine2');
  const burgerLine3 = document.getElementById('burgerLine3');

  if (!menuToggle || !menuDrawer) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    // Открыть drawer
    menuDrawer.classList.remove('translate-x-full');
    // Показать overlay
    menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
    menuOverlay.classList.add('opacity-100');
    // Анимация бургера → X
    burgerLine1.style.transform = 'translateY(7px) rotate(45deg)';
    burgerLine2.style.opacity = '0';
    burgerLine3.style.transform = 'translateY(-7px) rotate(-45deg)';
    // Блокировать скролл тела
    document.body.style.overflow = 'hidden';
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    isOpen = false;
    // Скрыть drawer
    menuDrawer.classList.add('translate-x-full');
    // Скрыть overlay
    menuOverlay.classList.add('opacity-0', 'pointer-events-none');
    menuOverlay.classList.remove('opacity-100');
    // Анимация X → бургер
    burgerLine1.style.transform = '';
    burgerLine2.style.opacity = '';
    burgerLine3.style.transform = '';
    // Разблокировать скролл
    document.body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  // Кнопка открытия (бургер)
  menuToggle.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Кнопка закрытия (X)
  menuClose.addEventListener('click', closeMenu);

  // Клик на overlay закрывает меню
  menuOverlay.addEventListener('click', closeMenu);

  // Клик по ссылке в меню — закрыть и прокрутить
  document.querySelectorAll('.menu-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Закрытие по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Закрыть меню при изменении размера экрана (переход на десктоп)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 640 && isOpen) closeMenu();
  });
}

// Кнопка прокрутки наверх
function setupScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (!scrollToTopBtn) return;

  // Показываем кнопку при прокрутке вниз на 300px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
      scrollToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }
  }, { passive: true });

  // Плавная прокрутка наверх при клике
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Управление прокруткой вкладок на мобильном (стрелки + градиент)
function setupTabsScrolling() {
  const container = document.getElementById('tabsScrollContainer');
  const btnLeft = document.getElementById('tabsScrollLeft');
  const btnRight = document.getElementById('tabsScrollRight');
  if (!container || !btnLeft || !btnRight) return;

  function updateArrows() {
    const scrollLeft = container.scrollLeft;
    // Округляем из-за субпиксельного рендеринга на ретина-экранах
    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);

    // Стрелка влево
    if (scrollLeft > 8) {
      btnLeft.classList.remove('opacity-0', 'pointer-events-none');
      btnLeft.classList.add('opacity-100');
    } else {
      btnLeft.classList.remove('opacity-100');
      btnLeft.classList.add('opacity-0', 'pointer-events-none');
    }

    // Стрелка вправо
    if (scrollLeft < maxScroll - 8) {
      btnRight.classList.remove('opacity-0', 'pointer-events-none');
      btnRight.classList.add('opacity-100');
    } else {
      btnRight.classList.remove('opacity-100');
      btnRight.classList.add('opacity-0', 'pointer-events-none');
    }
  }

  // Скролл по кнопкам
  btnLeft.addEventListener('click', () => {
    container.scrollBy({ left: -150, behavior: 'smooth' });
  });

  btnRight.addEventListener('click', () => {
    container.scrollBy({ left: 150, behavior: 'smooth' });
  });

  // Отслеживание прокрутки и ресайза
  container.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows, { passive: true });

  // Дополнительная проверка при смене вкладок
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Даем время на рендер перед проверкой
      setTimeout(updateArrows, 100);
    });
  });

  // Первоначальный запуск
  setTimeout(updateArrows, 200);
}

// Преобразование стандартных select в красивые кастомные списки в стиле Eurorack
function convertSelectsToCustom() {
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    if (select.classList.contains('custom-select-hidden')) return;

    // Скрываем оригинальный select
    select.style.display = 'none';
    select.classList.add('custom-select-hidden');

    // Обертка
    const wrapper = document.createElement('div');
    wrapper.className = 'relative w-full';

    // Кнопка-триггер (выглядит как селектор на панели)
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'w-full bg-white dark:bg-stone-950 border border-synth-border-light dark:border-synth-border-dark rounded p-2 text-stone-800 dark:text-stone-100 font-medium focus:ring-1 focus:ring-amber-500 outline-none flex justify-between items-center cursor-pointer select-none text-left text-xs sm:text-sm transition-all duration-200';
    
    const selectedOption = select.options[select.selectedIndex];
    const textSpan = document.createElement('span');
    textSpan.className = 'truncate pr-2';
    textSpan.textContent = selectedOption ? selectedOption.textContent : '';
    trigger.appendChild(textSpan);

    // Стрелочка шеврона
    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('class', 'w-4 h-4 text-stone-500 flex-shrink-0 transition-transform duration-200');
    arrowSvg.setAttribute('fill', 'none');
    arrowSvg.setAttribute('viewBox', '0 0 24 24');
    arrowSvg.setAttribute('stroke', 'currentColor');
    arrowSvg.setAttribute('stroke-width', '2');
    arrowSvg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />';
    trigger.appendChild(arrowSvg);

    wrapper.appendChild(trigger);

    // Выпадающее меню с опциями
    const dropdown = document.createElement('div');
    dropdown.className = 'absolute left-0 right-0 mt-1 bg-white dark:bg-stone-950 border border-synth-border-light dark:border-synth-border-dark rounded shadow-xl hidden z-20 max-h-60 overflow-y-auto custom-select-dropdown';

    Array.from(select.options).forEach((opt, idx) => {
      const optDiv = document.createElement('div');
      optDiv.className = 'option-item p-2.5 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-amber-500 dark:hover:text-amber-500 cursor-pointer transition-colors text-xs sm:text-sm text-stone-800 dark:text-stone-200 select-none flex items-center justify-between';
      
      const valSpan = document.createElement('span');
      valSpan.textContent = opt.textContent;
      optDiv.appendChild(valSpan);

      // Маленький LED-индикатор для выбранного элемента
      const led = document.createElement('span');
      led.className = 'w-1.5 h-1.5 rounded-full bg-transparent flex-shrink-0 ml-2';
      optDiv.appendChild(led);

      // Подсветка при инициализации
      if (select.selectedIndex === idx) {
        optDiv.classList.add('bg-stone-100', 'dark:bg-stone-900', 'font-semibold', 'text-amber-500', 'dark:text-amber-500');
        led.classList.add('bg-amber-500', 'led-glow-amber');
      }

      optDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        select.selectedIndex = idx;
        textSpan.textContent = opt.textContent;
        
        // Сбрасываем стили у всех опций
        dropdown.querySelectorAll('.option-item').forEach(item => {
          item.classList.remove('bg-stone-100', 'dark:bg-stone-900', 'font-semibold', 'text-amber-500', 'dark:text-amber-500');
          item.querySelector('.w-1.5').className = 'w-1.5 h-1.5 rounded-full bg-transparent flex-shrink-0 ml-2';
        });
        
        // Активируем выбранную
        optDiv.classList.add('bg-stone-100', 'dark:bg-stone-900', 'font-semibold', 'text-amber-500', 'dark:text-amber-500');
        led.classList.add('bg-amber-500', 'led-glow-amber');

        // Закрываем меню
        dropdown.classList.add('hidden');
        arrowSvg.classList.remove('rotate-180');

        // Генерируем событие изменения, чтобы калькулятор пересчитал значения
        select.dispatchEvent(new Event('change'));
      });

      dropdown.appendChild(optDiv);
    });

    wrapper.appendChild(dropdown);

    // Открытие/закрытие меню по клику на кнопку
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Закрываем все остальные открытые меню
      document.querySelectorAll('.custom-select-dropdown').forEach(d => {
        if (d !== dropdown) {
          d.classList.add('hidden');
          d.previousElementSibling.querySelector('svg').classList.remove('rotate-180');
        }
      });

      const isHidden = dropdown.classList.contains('hidden');
      if (isHidden) {
        dropdown.classList.remove('hidden');
        arrowSvg.classList.add('rotate-180');
      } else {
        dropdown.classList.add('hidden');
        arrowSvg.classList.remove('rotate-180');
      }
    });

    // Вставляем кастомный список в то же место DOM дерева
    select.parentNode.insertBefore(wrapper, select);
  });

  // Закрытие выпадающих списков при клике в любом другом месте экрана
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-dropdown').forEach(d => {
      d.classList.add('hidden');
      d.previousElementSibling.querySelector('svg').classList.remove('rotate-180');
    });
  });
}

// eof
