const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const exphbr = require('express-handlebars');

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

app.use((req, res, next) => {
    if (req.session.user && (req.session.timeout > Date.now())) {
        next();
    } else {
        res.redirect('/login');
    }
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    res.redirect('/');
});

app.get('/dashboard', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});