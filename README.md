# Кейсы с гарантированным призом

Веб-приложение с анимацией открытия кейсов в стиле CS:GO.

## Запуск

```bash
npm install
npm run dev
```

## Структура

- `src/config/prizes.js` — реэкспорт призов
- `src/config/tanks.js` — танки и ресурсы (description, sound, hasParticles, backendId)
- `src/config/cases.js` — кейсы по нациям, классам, ЛБЗ
- `src/config/settings.js` — ROULETTE_SCROLL_DURATION_MS, COUNTDOWN_ENABLED
- `src/config/i18n.js` — переводы RU/EN
- `src/utils/dropLogic.js` — логика выпадения (2%, гарант на 30-м)
- `src/components/` — React-компоненты

## Кейсы

- **По нациям:** СССР, США, Германия (все танки нации)
- **По классам:** лёгкие, средние, тяжёлые, ПТ-САУ (все танки класса)
- **ЛБЗ:** 3 категории личных боевых задач (по 3 танка в каждой)

## Медиафайлы

Добавьте вручную в `public/`:
- `sounds/open.mp3` — звук открытия
- `sounds/common.mp3`, `rare.mp3`, `epic.mp3`, `legendary.mp3` — по редкости
- `images/` — изображения призов и кейсов (пути в tanks.js и cases.js)

## Функции

- Описание призов, звук по редкости, частицы на legendary
- Страница шансов, инвентарь, прогресс до гаранта
- Достижения, экспорт статистики (JSON)
- Быстрое открытие (без анимации), обратный отсчёт
- Тёмная/светлая тема, RU/EN
