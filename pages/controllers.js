module.exports.index = function (req, res) {
    res.sendFile(__dirname + '/app/index.html');
};

module.exports.test = function (req, res) {
    res.sendFile(__dirname + '/app/test.html');
};