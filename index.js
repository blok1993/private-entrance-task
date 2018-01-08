const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const pagesRoutes = require('./pages/routes');
const graphqlRoutes = require('./graphql/routes');
const graphqlResolversQuery = require('./graphql/resolvers/query');
const graphqlResolversMutation = require('./graphql/resolvers/mutation');

const { models } = require('./models');


const app = express();

app.use(bodyParser.json());

app.use('/', pagesRoutes);
app.use('/graphql', graphqlRoutes);
app.use(express.static(path.join(__dirname, 'public')));


// Api
app.get('/api/getRooms', function (req, res) {
    graphqlResolversQuery.rooms().then(r => {
        res.send(r);
    });
});

app.get('/api/getEvent', function (req, res) {
    graphqlResolversQuery.event(null, {id: req.query.id}).then(r => {
        res.send(r);
    });
});

app.get('/api/getEvents', function (req, res) {
    graphqlResolversQuery.events().then(r => {
        res.send(r);
    });
});

app.get('/api/getUsers', function (req, res) {
    graphqlResolversQuery.users().then(r => {
        res.send(r);
    });
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
    graphqlResolversMutation.createEvent(null, {input: req.body.input, usersIds: req.body.usersIds, roomId: req.body.roomId}).then(r => {
        res.send(r);
    });
});

app.post('/api/updateEvent', function (req, res) {
    graphqlResolversMutation.updateEvent(null, {id: req.body.id, input: req.body.input}).then(r => {
        res.send(r);
    });
});

app.post('/api/removeEvent', function (req, res) {
    graphqlResolversMutation.removeEvent(null, {id: req.body.id}).then(r => {
        res.send(r);
    });
});

app.post('/api/removeUserFromEvent', function (req, res) {
    graphqlResolversMutation.removeUserFromEvent(null, {id: req.body.id, userId: req.body.userId}).then(r => {
        res.send(r);
    });
});

app.post('/api/addUserToEvent', function (req, res) {
    graphqlResolversMutation.addUserToEvent(null, {id: req.body.id, userId: req.body.userId}).then(r => {
        res.send(r);
    });
});

app.post('/api/changeEventRoom', function (req, res) {
    graphqlResolversMutation.changeEventRoom(null, {id: req.body.id, roomId: req.body.roomId}).then(r => {
        res.send(r);
    });
});

app.listen(3000, () => console.log('Express app listening on localhost:3000'));
