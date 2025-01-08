const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csurf = require('csurf');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: ['https://3000-akkm9120-project02front-umtcl5bzv03.ws-us117.gitpod.io'], // Array of allowed origins
    credentials: true
}));

app.use(express.json());

// Use hbs for the view engine
app.set('view engine', 'hbs');

// Enable the static folder
app.use(express.static('public'));

// Enable wax-on for template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// Enable forms
app.use(express.urlencoded({ extended: false }));

// Enable sessions
app.use(session({
    store: new FileStore(),
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash()); // Enable flash messages

// Share the current logged-in user with all hbs files
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

// Enable CSRF protection
const csurfInstance = csurf();
app.use(function (req, res, next) {
    if (req.url.slice(0, 5) == '/api/') {
        return next();
    }
    csurfInstance(req, res, next);
});

// Share the CSRF token with all hbs files
app.use(function (req, res, next) {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
});

// Handle CSRF errors
app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash("error_messages", "The form has expired, please try again");
        res.redirect('back');
    } else {
        next();
    }
});

// Routes
async function main() {
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');
    const userRoutes = require('./routes/users');
    const cloudinaryRoutes = require('./routes/cloudinary');
    const shoppingCartRoutes = require('./routes/shoppingCart');
    const checkoutRoutes = require('./routes/checkout');

    const api = {
        products: require('./routes/api/products'),
        orders: require('./routes/api/order')
    };

    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/cart', shoppingCartRoutes);
    app.use('/checkout', checkoutRoutes);

    // RESTful API endpoints
    app.use('/api/products', cors(), express.json(), api.products);
    app.use('/api/orders', express.json(), api.orders);

}

main();

app.listen(3000, () => {
    console.log("Server has started on port 3000");
});