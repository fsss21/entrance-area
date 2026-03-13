# Entrance Area

React-проект: Vite + CSS Modules + React Router. Данные в `public/data/*.json`.

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`, просмотр сборки: `npm run preview`.

## Структура

- **Стили**: файлы `*.module.css` — CSS Modules (скопленные классы).
- **Роутинг**: `react-router-dom`, маршруты в `App.jsx`.
- **Данные**: JSON в `public/data/`. Загрузка по пути `/data/имя_файла.json`, например `/data/info.json`.

Добавьте свои JSON в `public/data/` и откройте их по маршруту `/data/имя_файла.json`.
