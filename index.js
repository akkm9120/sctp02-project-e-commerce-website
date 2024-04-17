// setup express
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

const app = express();

// use hbs for the view engine
app.set('view engine', 'hbs');

// enable the static folder
app.use(express.static('public'));

// enable wax-on for template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// enable forms
app.use(
    express.urlencoded({
        'extended': false
    })
);

// enable sessions
// req.session is only available after you enable sessions
app.use(session({
    store: new FileStore(), // store session data in files
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true // if a browser connects to the server without a session, create a new one immediately
}))

// setup flash messages
app.use(flash());  // enable flash messages

// must do this after sessions are enabled because flash messages rely on sessions
app.use(function(req,res, next){
    // req.flash() without a second parameter
    // return the current flash message and delete it
    res.locals.success_messages = req.flash('success_messages');
    
    // extract out error flash messages
    res.locals.error_messages = req.flash('error_messages');
    next();
});

// share the current logged in user with all hbs file
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
})

async function main() {
    // routes will be inside here
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');
    const userRoutes = require('./routes/users');


    // use the landing routes
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);

  
}

main();

app.listen(3000, ()=>{
    console.log("server has started");
})