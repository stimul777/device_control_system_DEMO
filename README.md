## Описание
Система для мониторинга состояния и контроля физического оборудования.  
В системе используется:  
- [ ] VueJS(vueX, vueRouter)
- [ ] UI: Vuetify
- [ ] Запросы: axios, webSocket
- [ ] Linter

:computer: Система служит для мониторинга и управления физчисеким оборудованием(сервера, коммутаторы, хранилища), которое было вручную обнаружено(пингом) с помощью этой системы в заданном диапазоне IP адресов.  
С помощью системы возможно отслеживать состояние оборудования - включено\выключено\на перезагрузке или обслуживании, устанавливать софт и операционные системы(сервера), наблюдать перепады температур, скорость вращения куллеров и так далее, всячески группировать оборудование, редактировать его параметры, создавать конфигурации, удалять из системы и предупреждать пользователя об изменениях, вести логи в журнале и так далее.  
Реализована авторизация пользователя с использованием токенов. Реализованы роли - добавление пользователей с различными правами (Оператор, Админ, СуперАдмин), а также настройка отображения страниц и отдельных компонентов для разных ролей (пользователь с большими правами может настраивать отображение для пользователя с меньшими правами).


 :exclamation: __Это демонстрационная версия - вся бизнес логика удалена: запросы и ссылки на них удалены, все ключи удалены, логотипы удалены, версия полностью обезличена. Здесь она нужна для демонстрации архитектуры и кодстайла.__

