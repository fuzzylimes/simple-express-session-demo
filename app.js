const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Session Middleware
app.use(session({
    genid: (req) => {
        return uuid()
    },
    key: 'user_sid',
    store: new FileStore(),
    secret: 'dontforgetthecoffee',
    resave: false,
    saveUninitialized: true
}));

// Constants
const port = 5555;

var sessionCheck = ((req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
});

app.get('/', (req, res) => {
    res.render('home', { user: req.session.user, loggedIn: req.session.loggedIn });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/api/login', (req, res) => {
    req.session.user = req.body.email;
    req.session.loggedIn = true;
    res.redirect('/');
});

app.get('/logout', sessionCheck, (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;
    res.redirect('/');
});

app.get('/dashboard', sessionCheck, (req, res) => {
    res.render('home', { user: req.session.user, loggedIn: req.session.loggedIn });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});