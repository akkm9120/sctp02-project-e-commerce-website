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


// Enable CORS for all routes - allow all origins
app.use(cors({
    origin: true, // Allow all origins
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
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});



// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'E-commerce API is running',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

async function main() {
    try {
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
        app.use('/api/products', express.json(), api.products);
        app.use('/api/orders', express.json(), api.orders);
        
        console.log('All routes loaded successfully');
    } catch (error) {
        console.error('Error loading routes:', error.message);
        console.log('Server will continue with basic endpoints only');
    }
}

main();

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server has started on port ${PORT}`);
});