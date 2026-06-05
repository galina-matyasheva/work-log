# Журнал работ на строительном объекте

Full Stack Engineer test assignment — веб-приложение для учёта выполненных работ на строительном объекте.
Дополнительно реализована сортировка по дате, клиентская пагинация (так как предполагаю небольшой объем данных. При большом объеме можно расширить, реализовав серверную пагинацию), нотификации при удалении, добавлении и редактировании записи. 

## Стек

| Слой | Технология |
|------|-----------|
| **Frontend** | React 18, TypeScript, Zod, react-icons, CSS (CSS-var) |
| **Backend** | Node.js, Express 4, TypeScript, mysql2 |
| **Database** | MySQL 8 |
| **Infrastructure** | Docker Compose, Nginx (production build) |

## Быстрый старт (Docker)

```bash
docker compose up --build
```

- Фронтенд: `http://localhost:3000`
- Бэкенд: `http://localhost:5000`

При первом запуске `init.sql` автоматически создаёт таблицы и заполняет справочники.

### Переменные окружения

Все переменные имеют значения по умолчанию — можно запустить без `.env`.

| Переменная | По умолчанию | Назначение |
|-----------|-------------|------------|
| `PORT` | `5000` | Порт бэкенда |
| `DB_HOST` | `localhost` | Хост MySQL |
| `DB_PORT` | `3306` | Порт MySQL |
| `DB_USER` | `appuser` | Пользователь MySQL |
| `DB_PASSWORD` | `1234` | Пароль MySQL |
| `DB_NAME` | `construction_journal` | Название БД |
| `CORS_ORIGIN` | `http://localhost:3000` | Разрешённый origin для CORS |
| `REACT_APP_API_URL` | `http://localhost:5000` | URL бэкенда для фронтенда |

### Полезные команды Docker

```bash
# Пересобрать и запустить
docker compose up --build

# Только бэкенд (если меняли только его)
docker compose up --build backend

# Сбросить всё (удаляет volume БД!)
docker compose down -v && docker compose up --build

# Логи конкретного сервиса
docker compose logs -f backend
```

## Локальный запуск (без Docker)

### 1. БД

Установите MySQL 8, создайте БД и выполните миграцию:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS construction_journal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p construction_journal < init.sql
```

### 2. Бэкенд

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Фронтенд

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

## Тестирование

### Стек

| Слой | Инструмент |
|------|-----------|
| **Backend** | Jest + ts-jest, supertest (HTTP), мокинг mysql2/promise |
| **Frontend** | Jest (CRA), @testing-library/react, @testing-library/jest-dom |

### Структура тестов

```
backend/src/__tests__/
  db.test.ts        # Конфигурация пула MySQL
  app.test.ts       # Все роуты + валидация + loadReferences

frontend/src/
  __tests__/App.test.tsx
  api/__tests__/          # client, LogApi, UnitsApi, WorkersApi
  schemas/__tests__/      # logSchema, editLogSchema
  utils/__tests__/        # formatDate, formatVolume
  components/
    common/*/__tests__/   # FormField, Loader, Notification, Pagination
    logForm/__tests__/
    logTable/__tests__/
    modals/*/__tests__/   # ConfirmDeleteModal, EditLogModal
```

### Запуск

```bash
# Бэкенд (118 тестов)
cd backend
npm test                  # однократно
npm test -- --watch       # watch-режим
npm run test:coverage     # с отчётом покрытия

# Фронтенд (81 тест)
cd frontend
npm test                  # watch-режим (по умолчанию)
npm test -- --watchAll=false  # однократно
```

### Что тестируется

**Бэкенд:** каждый роут (`/health`, `/log`, `/workers`, `/units`) на успех, ошибки БД, а также валидация каждого поля — пропущенные поля, неверный тип/длина/диапазон, проверка по справочникам (`allowedUnits`, `allowedWorkers`), загрузка справочников с ретраями.

**Фронтенд:** рендер компонентов, пустое состояние, сабмит форм, валидация Zod (граничные случаи), вызов API, нотификации, disabled-состояние кнопок, пагинация, сортировка, модальные окна.

## API

| Метод | Путь | Описание |
|-------|------|---------|
| `GET` | `/health` | Healthcheck |
| `GET` | `/log` | Список записей (сортировка по дате DESC) |
| `POST` | `/log` | Создать запись |
| `PATCH` | `/log/:id` | Обновить запись (только разрешённые поля) |
| `DELETE` | `/log/:id` | Удалить запись |
| `GET` | `/workers` | Список исполнителей |
| `GET` | `/units` | Список единиц измерения |

### POST /log

```json
{
  "date": "2026-06-04",
  "work_type": "Бетонирование",
  "volume": "12.5",
  "unit": "m3",
  "worker_name": "ivanov"
}
```

Валидация: обязательные поля; `work_type` (string, ≤35); `volume` (число, >0, ≤9999999.99); `unit` и `worker_name` — из справочников.

### DELETE /log/:id, PATCH /log/:id

Возвращают `404` если запись с указанным `id` не найдена.

## Проект

```
backend/
├── src/
│   ├── db.ts          # Пул соединений MySQL
│   └── index.ts       # express-приложение, роуты, CORS, валидация
├── .env.example
└── Dockerfile

frontend/
├── src/
│   ├── api/           # HTTP-клиенты
│   ├── components/    # UI-компоненты
│   │   ├── common/    #  FormField, Loader, Pagination, Notification
│   │   ├── logForm/   #  Форма добавления
│   │   ├── logTable/  #  Таблица записей
│   │   └── modals/    #  ConfirmDeleteModal, EditLogModal
│   ├── constants/     #  Тексты (texts.ts)
│   ├── schemas/       #  Zod-схемы валидации
│   ├── types/         #  TypeScript-типы
│   └── utils/         #  Вспомогательные функции
├── .env.example
└── Dockerfile

docker-compose.yml     # mysql + backend + frontend (nginx)
init.sql               # Схема БД + seed-данные
```

## Функционал

- CRUD записей журнала с серверной валидацией
- Справочники исполнителей и единиц измерения (подтягиваются из БД)
- Валидация форм на клиенте (Zod) и на сервере
- Сортировка по дате, пагинация (14 записей на страницу)
- Модальные окна: редактирование, подтверждение удаления
- Отключение кнопок на время отправки (double-submit prevention)
- Пустое состояние таблицы
- Уведомления об успехе/ошибке
- Загрузчик при инициализации
- Docker-инфраструктура с healthcheck'ами и restart policy
- Обработка 404 на DELETE/PATCH
- Защита от утечки ошибок БД клиенту
- CORS, ограничение размера тела запроса
