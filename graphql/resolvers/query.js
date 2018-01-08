const { models } = require('../../models');

module.exports = {
  //Event
  event (root, { id }, context) {
    return models.Event.findById(id);
  },

  events (root, args, context) {
    return models.Event.findAll({});
  },

  //User
  user (root, { id }, context) {
    return models.User.findById(id);
  },

  users (root, args, context) {
    return models.User.findAll({});
  },

  //Room
  room (root, { id }, context) {
    return models.Room.findById(id);
  },

  rooms (root, args, context) {
    return models.Room.findAll({});
  },

  //Recommendations
  getRecommendation (root, {date, members}, context) {

      return Promise.all([models.Room.findAll(), models.Event.findAll()])
        .then(function ([rooms, events]) {

          //Выберем события за конкретный день (date.start)
          let filteredEvents = events.filter((ev) => {
            function getFormattedString(date) {
                return new Date(date).getFullYear() + "-" + new Date(date).getMonth() + "-" + new Date(date).getDate();
            }

            return (getFormattedString(ev.dateStart) === getFormattedString(date.start));
          });

          //Для каждой комнаты запишем соответствующие события. roomId: { floorsForPassage: Number, events: {Event}[] }
          let roomEventsMap = {};
          let recommendations = [];

          for(let i = 0; i < rooms.length; i++) {

            //Сразу исключаем комнаты, которые не могут вместить members.length
            if(rooms[i].capacity < members.length) continue;

            //Расчитаем суммарное кол-во этажей для прохождения всеми участниками и запишем его в отдельное св-во floorsForPassage
            roomEventsMap[rooms[i].id] = {};
            roomEventsMap[rooms[i].id].floorsForPassage = members.reduce((sum, item) => {
              return sum + Math.abs(rooms[i].floor - item.floor);
            }, 0);

            for(let j = 0; j < filteredEvents.length; j++) {
                if(!roomEventsMap[rooms[i].id].events) {
                  roomEventsMap[rooms[i].id].events = [];
                }

                if(filteredEvents[j].RoomId === rooms[i].id) {
                  roomEventsMap[rooms[i].id].events.push(filteredEvents[j]);
                }
            }

            /*
             На данном этапе пробегаем по всем событиям в переговорке и смотрим,
             нет ли пересечения по датам между существующими событиями и новым
           */
            function datesHaveIntersection(iterEvDate) {
              let iterEvDateStart = new Date(iterEvDate.dateStart).getTime();
              let iterEvDateEnd = new Date(iterEvDate.dateEnd).getTime();
              let dateStart = new Date(date.start).getTime();
              let dateEnd = new Date(date.end).getTime();

              return ((iterEvDateStart >= dateStart && iterEvDateStart < dateEnd) || (iterEvDateEnd > dateStart && iterEvDateEnd <= dateEnd)) ||
                     ((dateStart >= iterEvDateStart && dateStart < iterEvDateEnd) || (dateEnd > iterEvDateStart && dateEnd <= iterEvDateEnd))
            }

            roomEventsMap[rooms[i].id].hasIntersection = roomEventsMap[rooms[i].id].events.some(datesHaveIntersection);

            if(!roomEventsMap[rooms[i].id].hasIntersection) {
              recommendations.push({date: date, room: rooms[i].id, floorsForPassage: roomEventsMap[rooms[i].id].floorsForPassage});
            }
          }

          if(recommendations.length) {
            recommendations
              .sort(function (a, b) {
                return a.floorsForPassage - b.floorsForPassage;
              }).forEach(function (el) {
                  delete el.floorsForPassage;
              });

            return recommendations;
          } else {
            /*
              В данном случае все переговорки на желаемое время заняты.
              Необходимо произвести swap, если это возможно. Либо дождаться освобождения одной из переговорок.
            */

            return {status: 1, message: "В выбраный промежуток все переговорки заняты. Перенесите, по возможности, встречи в другие переговорки, либо измените дату и время новой встречи."};
          }
      });
  }
};
