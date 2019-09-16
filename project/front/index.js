var express = require('express');
var app = express();
var port = 8080;
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.set('view options', { basedir: process.env.__dirname });
app.use(express.static('public'));
app.get('/', function (req, res) {
    // zapytaj o group_list
    // zapytaj o date_inc_list
    // zapytaj o group_own_list
    res.render('index', {
        group_list: {},
        date_inc_list: {},
        group_own_list: {}
    });
});
app.listen(port, function () { });
