import userRepository from "../repositories/userRepository.js"
import bcrypt from 'bcrypt'
const appTitle = process.env.APP_TITLE

export default {
    index: (req, res) => {
        res.render('index', {
            appTitle: appTitle,
            title: "Home page"
        })
    },
    authGet: (req, res) => {
        res.render('auth/admin', { appTitle: appTitle, title: "Admin" })
    },
    registerGet: (req, res) => {
        res.render('auth/register', { appTitle: appTitle, title: "Register" })
    },
    registerPost: async (req, res, next) => {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        userRepository.insertUser(
            req.body.username,
            hashedPassword,
            true
        )
            .then(() => res.redirect('/admin'))
            .catch(err => next(err))
    },
    logout: (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    }
}