const express = require('express');
const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms');
const { User } = require('../models');
const router = express.Router();
const crypto = require('crypto');
const { checkIfAuthenticated } = require('../middlewares');

const getHashedPassword = function (plainPassword) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(plainPassword).digest('base64');
    return hash;
}


router.get('/register', function (req, res) {
    const userForm = createRegistrationForm();
    res.render('users/register', {
        userForm: userForm.toHTML(bootstrapField)
    })
});

router.post('/register', function (req, res) {
    console.log("preparing to go inside form");
    const userForm = createRegistrationForm();
    userForm.handle(req, {
        'success': async function (form) {
            console.log("this is inside form success")
            const user = new User({
                username: form.data.username,
                password: getHashedPassword(form.data.password),
                email: form.data.email
            });
            await user.save();
            console.log(user);
            req.flash('success_messages', "Your account has been created successfully!");
            res.redirect('/users/login');
        },
        'empty': function (form) {
            console.log("this is inside form success")
            res.render('users/register', {
                userForm: form.toHTML(bootstrapField)
            })
        },
        'error': function (form) {
            console.log("this is inside form success")
            res.render('users/register', {
                userForm: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', function (req, res) {
    const loginForm = createLoginForm();
    res.render('users/login', {
        loginForm: loginForm.toHTML(bootstrapField),
        isLoginPage: true,
    });
});

router.post('/login', function (req, res) {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        'success': async function (form) {
            // 1. find the user by the given email
            const user = await User.where({
                'email': form.data.email
            }).fetch({
                require: false
            });


            // if the user with the provided email is found
            if (user) {
                // 2. check if hashed version of the password from the form
                // matches the password in the user table
                if (getHashedPassword(form.data.password) === user.get('password')) {
                    // 3. if so, then the user is logged in and we will store the user in the session

                    // save the user's data to session
                    req.session.user = {
                        id: user.get('id'),
                        username: user.get('username'),
                        email: user.get('email')
                    }
                    req.flash('success_messages', `Welcome back ${user.get('username')}`);
                    
                    res.redirect('/products')
                      
                } else {
                    req.flash('error_messages', "Invalid authentication");
                    res.status(401);
                    res.redirect("/users/login");
                }


            } else {
                req.flash('error_messages', "Invalid authentication");
                res.status(401);
                res.redirect('/users/login');
            }


        },
        'empty': function (form) {
            res.render('users/login', {
                loginForm: loginForm.toHTML(bootstrapField)
            });
        },
        'error': function (form) {
            res.render('users/login', {
                loginForm: loginForm.toHTML(bootstrapField)
            });
        }
    })
})

router.get('/profile', [checkIfAuthenticated], function (req, res) {
    const user = req.session.user;
    res.render('users/profile', {
        user
    })
});

router.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success_messages', "Goodbye! You have been logged out!");
    res.redirect('/users/login');
})

module.exports = router;