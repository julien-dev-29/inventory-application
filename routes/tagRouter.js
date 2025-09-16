import { Router } from "express";
import tagController from "../controllers/tagController.js";

const tagRouter = Router()

tagRouter.get('/', tagController.index)
tagRouter.get('/create', tagController.create)
tagRouter.post('/create', tagController.store)
tagRouter.get('/:id', tagController.details)
tagRouter.get('/:id/edit', tagController.edit)
tagRouter.put('/:id/edit', tagController.update)
tagRouter.delete('/:id/delete', tagController.delete)

export default tagRouter