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

app.listen(3000, () => console.log('Express app listening on localhost:3000'));
