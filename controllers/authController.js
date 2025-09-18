const appTitle = process.env.APP_TITLE || "App"

export default {
    authGet: (req, res) => {
        res.render('auth/login', { appTitle: appTitle, title: "Admin" })
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
            .then(() => res.redirect('/login'))
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