import { Router } from "express";
import tagController from "../controllers/tagController.js";
import { isAdmin } from "./authMiddleware.js";

const tagRouter = Router()

tagRouter.get('/', tagController.index)
tagRouter.get('/create', isAdmin, tagController.create)
tagRouter.post('/create', isAdmin, tagController.store)
tagRouter.get('/:id', tagController.details)
tagRouter.get('/:id/edit', isAdmin, tagController.edit)
tagRouter.put('/:id/edit', isAdmin, tagController.update)
tagRouter.delete('/:id/delete', isAdmin, tagController.delete)

export default tagRouter