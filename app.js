import express from 'express'
import 'dotenv/config'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import path from 'node:path'
import router from './routes/router.js'
import session from 'express-session'
import pgSession from 'connect-pg-simple'
import pool from './repositories/pool.js'
import passport from 'passport'
import snippetRouter from './routes/snippetRouter.js'
import projectRouter from './routes/projectRouter.js'
import tagRouter from './routes/tagRouter.js'
import authRouter from './routes/authRouter.js'

// App
const app = express()
const PORT = process.env.PORT || 3000

// Dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// EJS
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs')

// Middlewares
app.use(bodyParser.urlencoded())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method
        delete req.body._method
        return method
    }
}))
app.use(express.json())

// PG Session
const PgSession = pgSession(session);
app.use(session({
    store: new PgSession({ pool, tableName: 'user_sessions' }),
    secret: process.env.SESSI0N_SECRET || 'cats',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Passport
import './config/passport.js'
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.admin = req.user;
    next();
});
app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next()
})




// Router
app.use(router)
app.use('/snippets', snippetRouter)
app.use('/projects', projectRouter)
app.use('/tags', tagRouter)
app.use(authRouter)

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: "404" })
})

// Server
app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Server runs on port: ${PORT}`);
})