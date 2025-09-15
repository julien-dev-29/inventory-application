import express from 'express'
import 'dotenv/config'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import bodyParser from 'body-parser'
import path from 'node:path'
import router from './routes/router.js'
import snippetRouter from './routes/snippetRouter.js'
import projectRouter from './routes/projectRouter.js'

// App
const app = express()
const PORT = process.env.PORT || 3000

// Dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// EJS
app.set('view engine', 'ejs')

// Middlewares
app.use(bodyParser.urlencoded())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Router
app.use(router)
app.use('/snippets', snippetRouter)
app.use('/projects', projectRouter)

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: "404" })
})

// Server
app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Server runs on port: ${PORT}`);
})