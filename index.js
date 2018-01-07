const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const pagesRoutes = require('./pages/routes');
const graphqlRoutes = require('./graphql/routes');

const { models } = require('./models');

const app = express();

app.use(bodyParser.json());

app.use('/', pagesRoutes);
app.use('/graphql', graphqlRoutes);
app.use(express.static(path.join(__dirname, 'public')));


// Api
app.get('/api/getRooms', function (req, res) {
    models.Room.findAll({}).then(result => {
            res.send(result);
        }, err => {
            console.log(err);
        }
    );
});

app.get('/api/getEvent', function (req, res) {
    models.Event.findById(req.query.id).then(result => {
            res.send(result);
        }, err => {
            console.log(err);
        }
    );
});

app.get('/api/getEvents', function (req, res) {
    models.Event.findAll({}).then(result => {
            res.send(result);
        }, err => {
            console.log(err);
        }
    );
});

app.get('/api/getUsers', function (req, res) {
    models.User.findAll({}).then(result => {
            res.send(result);
        }, err => {
            console.log(err);
        }
    );
});

app.get('/api/getEventUsers', function (req, res) {
    models.Event.findById(req.query.id).then(result => {
            result.getUsers().then(rez => {
                res.send(rez);
            });
        }, err => {
            console.log(err);
        }
    );
});

app.post('/api/createEvent', function (req, res) {
    models.Event.create(req.body.input)
        .then(event => {
            event.setRoom(req.body.roomId);

            return event.setUsers(req.body.usersIds)
                .then(() => {
                    res.send(event);
                });
        });
});

app.post('/api/updateEvent', function (req, res) {
    models.Event.findById(req.body.id)
        .then(event => {
            event.update(req.body.input)
                .then(ev => {
                    res.send(ev);
                });
        });
});

app.post('/api/removeEvent', function (req, res) {
    models.Event.findById(req.body.id)
        .then(event => {
            res.send(event);
            event.destroy();
        });
});

app.post('/api/removeUserFromEvent', function (req, res) {
    models.Event.findById(req.body.id)
        .then(event => {
            event.removeUser(req.body.userId);
            res.send(event);
        });
});

app.post('/api/addUserToEvent', function (req, res) {
    models.Event.findById(req.body.id)
        .then(event => {
            event.addUser(req.body.userId);
            res.send(event);
        });
});

app.post('/api/changeEventRoom', function (req, res) {
    models.Event.findById(req.body.id)
        .then(event => {
            event.setRoom(req.body.roomId);
            res.send(event);
        });
});

app.listen(3000, () => console.log('Express app listening on localhost:3000'));
