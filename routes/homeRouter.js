import { Router } from "express";

const homeRouter = Router()

homeRouter.get('/', (req, res) => res.render('index', {title: "Home"}))

export default homeRouter