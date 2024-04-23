// setup express
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csurf = require('csurf');
require('dotenv').config();

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

// enable csurf for CSRF protection after sessions are enabled
// because csurf requires sessions to work
const csurfInstance = csurf();

// for csrf protection exclusion
app.use(function(req,res,next){
    // check if the request is  meant for the webhook
    if (req.url === "/checkout/process_payment" || req.url.slice(0, 5) == '/api/') {
        // exclude from CSRF protection
        return next();
    } 
    csurfInstance(req,res,next);
})

// middleware to share the CSRF token with all hbs files
app.use(function(req,res,next){
    // req.csrfToken() is available because of `app.use(csurf())`
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

// middleware to handle csrf errors
app.use(function(err, req, res, next){
    // if the middleware function has four parameters
    // then it is an error handler for the middleware
    // directly before it
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash("error_messages", "The form has expired, please try again");
        res.redirect('back'); // go back one page
    } else {
        next();
    }
})

async function main() {
    // routes will be inside here
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');
    const userRoutes = require('./routes/users');
    const cloudinaryRoutes = require('./routes/cloudinary');
    const shoppingCartRoutes = require('./routes/shoppingCart');
    const checkoutRoutes = require('./routes/checkout')

    const api = {
        products: require('./routes/api/products')
    }

    // use the landing routes
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/cart', shoppingCartRoutes);
    app.use('/checkout', checkoutRoutes);

    // for RESTFul API endpoints
    app.use('/api/products',  express.json(), api.products);

  
}

main();

app.listen(3000, ()=>{
    console.log("server has started");
})