# Приложение для создания и редактирования информации о встречах сотрудников

Написано для Node.js 8 и использует библиотеки:
* express
* sequelize
* graphql

## Задание
Код содержит ошибки разной степени критичности. Некоторых из них стилистические, а некоторые даже не позволят вам запустить приложение. Вам необходимо найти и исправить их.

Пункты для самопроверки:
1. Приложение должно успешно запускаться
2. Должно открываться GraphQL IDE - http://localhost:3000/graphql/
3. Все запросы на получение или изменения данных через graphql должны работать корректно. Все возможные запросы можно посмотреть в вкладке Docs в GraphQL IDE или в схеме (typeDefs.js)
4. Не должно быть лишнего кода
5. Все должно быть в едином codestyle

## Запуск
```
npm i
npm run dev
```

Для сброса данных в базе:
```
npm run reset-db
```



## Решение поставленных задач

1. При 1-м запуске ошибка в консоли: Error: Dialect needs to be explicitly supplied as of v4.0.0

   - Решение: при создании, new Sequelize() требует 4 аргумента, а не 3. (файл index.js, 7 строка)
      const sequelize = new Sequelize('database', 'username', 'password', {
        ... some options
      });

2. Некорректно работает http://localhost:3000/graphql/ (Cannot GET /graphql/)

   - Решение: Исправить опечатку в файле index.js, 14 строка graphgl -> graphql (g -> q);
            И не влияющий на работу приложения недочет: в Файле index.js, 13 строка - пропущена точка с запятой.
    
3. a) в GraphQL IDE неверно работал запрос на получение events. 

   - Решение: graphql/resolvers/query.js, 8 строка - заменяем argumets на {}.
 
 
   b) Неверно работал запрос на получение rooms. 
  
   - Решение: graphql/resolvers/query.js, 20 строка - Убираем сво-во { offset : 1 }, так как в этом случае мы упускаем 1 комнату.
 
   c)  - В файле typeDefs.js, в определении input UserInput - добавляем необязательное поле avatarUrl, для возможности изменения аватара. А также делаем необязательным поле login.
       - В определениях (input RoomInput) и (input EventInput) делаем все поля необязательными, т.к. мы не обязаны всегда их все указывать при изменении.
       - graphql/resolvers/index.js - 14 и 17 строчки, добавляем return в тела методов, иначе эти значения не возвращаются.
       - mutation.js, 67 строчка - в вызов метода event.setRoom нужно передавать roomId, а не id.
       - Метод addUserToEvent не был реализован. Соответственно реализовал его в mutation.js
   
 4. 5. Реализованы при выполнении пунктов 1, 2 и 3.

Мелкие недочеты:
 -  Файл graphql/routes.js, 18 строка - была лишняя запятая.
 