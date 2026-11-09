# <img width="64" height="64" alt="favicon" src="https://github.com/user-attachments/assets/f7a66263-a25c-4ec9-a9c2-41f104b9a301" /> Connections

> **Интерактивная доска для заметок, структурирования данных и визуализации связей прямо в браузере.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

---

<!-- МЕСТО ДЛЯ СКРИНШОТА -->
<p align="center">
  <img width="959" height="768" alt="image" src="https://github.com/user-attachments/assets/6d707eef-c86a-4c38-81f8-b92312696157" />
  <br>
</p>

---

## 🌟 Возможности

- 🕵️ **Карточки с данными и заметками:** создание и свободное перемещение информационных блоков с текстом или изображениями по холсту
- 🧵 **Визуальные связи-нити:** построение связей между блоками в виде визуальных линий с комментариями
- 💾 **Перенос данных:** импорт и экспорт доски в формате .json
- 🌐 **Offline:** все данные сохраняются локально в браузере

---

## 📸 Скриншоты интерфейса

<!-- МЕСТО ДЛЯ СКРИНШОТОВ: Демонстрация ключевых функций -->

| Карточки и создание связей | Панель инструментов и статус |
| :---: | :---: |
| <img width="948" height="512" alt="image" src="https://github.com/user-attachments/assets/7ed8e496-1f02-4658-bd39-d6f2d154a614" /> | <img width="618" height="100" alt="image" src="https://github.com/user-attachments/assets/d8b9519c-9629-4805-87d3-79160d1e3aab" />
| *Соединение двух карточек нитью* | *Панель Toolbar* |

---

## 🛠 Зависимости
```
typescript@7.0.2 vite@8.3.6 oxlint@1.92.0 @types/react@19.3.0 @types/react-dom@19.3.0 @vitejs/plugin-react@6.2.1 i18next@27.0.1 i18next-browser-languagedetector@8.3.0 react-i18next@18.0.1
```
---

## 📁 Структура проекта

```text
connections-board/
├── public/                 # Статические ресурсы
├── src/
│   ├── assets/             # Иконки, изображения и стили
│   ├── components/         # Компоненты приложения
│   │   ├── canvas/         # Холст, карточки (EvidenceNode) и нити (StringEdge)
│   │   └── ui/             # Элементы интерфейса (Toolbar, InfoBadge)
│   ├── db/                 # Локальная база данных (IndexedDB)
│   ├── i18n/               # Переводы (ru, en) и конфигурация локализации
│   ├── store/              # Глобальный стор доски (useBoardStore)
│   ├── types/              # Описания типов TypeScript
│   ├── App.tsx             # Корневой компонент
│   └── main.tsx            # Точка входа в приложение
├── .oxlintrc.json          # Конфигурация линтера
└── vite.config.ts          # Конфигурация Vite
```
