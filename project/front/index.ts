import * as bodyParser from "body-parser";

const express = require('express');
const fetch = require('node-fetch');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const redis = require('redis');
const elasticsearch = require('elasticsearch');
var pub = redis.createClient('redis://redis:6379');

var ESclient = new elasticsearch.Client( {
    host:'http://project_es01_1:9200',
    log: 'trace',
    requestTimeout: Infinity
});

function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}

passport.use(new LocalStrategy(function(username, password, done) {
    fetch('http://project_users_1:5001/api/users/' + username).then(function(response) {
        if (response.status != 200) {
            return done(null, false);
        } else {
            return response.json();
        }
    }).then(function(result) {
        if(!result) {
            return done(null, false);
        }
        var hash = hashPassword(password, result.salt);
        if (hash == result.password) {
            return done(null, {id: result.person_id, username: result.username});
        }
        else return done(null, false);
    }).catch(function(err) {
        console.error(err);
    });
}));

passport.serializeUser(function(user, done) {
    return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    fetch('http://project_users_1:5001/api/users/byid/' + id).then(function(response) {
        return response.json();
    }).then(function(result) {
        if (!result) return done(null, false);
        return done(null, result);
    }).catch(function(err) {
        console.error(err);
    });
});

const app = express();
const port = 8080;

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser('hello'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.set('view options', {basedir: process.env.__dirname});

app.get('/sub/:Gname/:Gowner', function(req, res) {
    if(!req.user) res.redirect('/loginPage');
    else {
        var body = {
            address: 'http://project_groups_1:5002/api/groups/create',
            body: {
                name: req.params.Gname, 
                user: req.user.username, 
                owner: req.params.Gowner
            }
        }
        pub.publish('worker', JSON.stringify(body));
        res.redirect('/');
    }
});
app.get('/groups/:group_id', function(req, res) {
    if(!req.user) res.redirect('/loginPage');
    else {
        fetch('http://project_groups_1:5002/api/groups/get/' + req.params.group_id)
        .then (function(response) {
            return response.json();
        }).then(function(group) {
            fetch('http://project_varnish_1:80/api/dates/incoming/' + req.params.group_id) .then(function(response) {
                return response.json();
            }).then(function(dates) {
                res.render('group', {group:group, dates: dates.sort(function(a,b) 
                    { if (a.date > b.date) return 1; else return -1;})});
            }).catch(function(err) {
                console.error(err);
                return res.redirect('/');
            });
        }).catch(function(err) {
            console.error(err);
        });
    }
})

app.post('/createDate', function(req, res) {
    if (!req.user) res.redirect('/loginPage');
    else {
        var body = {
            address: 'http://project_varnish_1:80/api/dates/create',
            body: {
                date: req.body.dateDate,
                name: req.body.dateName,
                group_id: req.body.dateGroup
            }
        }
        console.log(body);
        pub.publish('worker', JSON.stringify(body));
        res.redirect('/');
    }
});

app.post('/createGroup', function(req, res) {
    if (!req.user) res.redirect('/loginPage');
    else {
        var body = {
            address: 'http://project_groups_1:5002/api/groups/create',
            body: {
                name: req.body.groupCreate, 
                user: req.user.username, 
                owner: req.user.username
            }
        };
        ESclient.indices.exists({index: 'groups'}).then(function(resp){
            if (resp) {
                console.log('index already exists');
                ESclient.index({
                    index: 'groups',
                    body: {
                        name: req.body.groupCreate,
                        owner: req.user.username
                    }
                }).then(function(resp) {
                    pub.publish('worker', JSON.stringify(body));
                    res.redirect('/');
                }).catch(function(err) {
                    console.log(err);
                    res.redirect('/');
                });
            } else {
                console.log('creating');
                ESclient.indices.create({index : 'groups'}).then(function(resp) {
                    ESclient.index({
                        index: 'groups',
                        body: {
                            name: req.body.groupCreate,
                            owner: req.user.username
                        }
                    }).then(function(resp) {
                        pub.publish('worker', JSON.stringify(body));
                        res.redirect('/');
                    }).catch(function(err) {
                        console.log(err);
                        res.redirect('/');
                    });
                }).catch(function(err) {
                    console.log(err);
                    res.redirect('/');
                });
            }
        }).catch(function(err) {
            console.log('error!');
            console.log(err);
            res.redirect('/');
        });
    };
});


app.post('/subscribeGroup', function(req, res) {
    console.log("here");
    if (!req.user) res.redirect('/loginPage');
    else {
        ESclient.search({
            index: 'groups',
            body: {
                query: {
                    bool : {
                        must: [
                            {
                                fuzzy : {
                                    "name" : req.body.groupSubscribe
                                }
                            },
                            {
                                fuzzy : {
                                    "owner" : req.body.owner
                                }
                            }
                        ]
                    }
                }
            }
        }).then(function(response){
            var result = [];
            for(var i = 0; i < response.hits.hits.length; i++) {
                result[i] = response.hits.hits[i]._source;
            }
            console.log("-------------");
            console.log(result);
            console.log("-------------");
            return res.render('group_list', {groups: result});
        }).catch(function(error) {
            console.error(error);
            return res.redirect('/')
        });
    }
});

app.get('/', function(req, res) {
    if(!req.user) res.redirect('/loginPage');
    else {
        fetch('http://project_groups_1:5002/api/groups/subscriptions/' + req.user.username)
        .then(function(response) {
            return response.json();
        }).then(function(group_list){
            console.log(group_list);
            fetch('http://project_groups_1:5002/api/groups/' + req.user.username)
            .then(function(response) {
                return response.json()
            }).then(function(group_own_list) {
                console.log(group_own_list);
                var body = group_own_list.concat(group_list);
                console.log(body);
                body = body.map(x => x.group_id);
                console.log(body);
                return fetch('http://project_varnish_1:80/api/dates/incoming', 
                {
                    method: 'POST', 
                    body: JSON.stringify(body), 
                    headers: {"Content-Type": "application/json"}
                }).then(function(response) {
                    return response.json();
                }).then(function(dates_inc_list) {
                    dates_inc_list = dates_inc_list.sort(function(a, b) {
                        if (a.date > b.date) return 1; else return -1;
                    });
                    console.log(group_list);
                    console.log(group_own_list);
                    res.render('index', {dates_inc_list: dates_inc_list, group_list: group_list, group_own_list: group_own_list});
                }).catch(function(err) {
                    console.error(err);
                });
            }).catch(function(err) {
                console.error(err);
            });
        }).catch(function(err) {
            console.error(err);
        });
    }
});

app.get('/loginPage', function(req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginPage'
}));

app.get('/registerPage', function(req, res) {
    res.render('register');
})

app.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = hashPassword(password, salt);
    var body = {username: username, password: hash, salt: salt}
    fetch('http://project_users_1:5001/api/users', {method: 'POST', body: JSON.stringify(body), headers: {"Content-Type": "application/json"}}).then(function(res){
        return res.json()
    }).then(function(result) {
        console.log(result);
        return res.redirect('/loginPage');
    }).catch(function(err) {
        console.error(err);
        return res.redirect('/registerPage');
    });
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/loginPage');
    });
});

app.listen(port, function(){});
