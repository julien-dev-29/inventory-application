import { Router } from "express";
import projectController from "../controllers/projectController.js";
import { isAdmin } from "./authMiddleware.js";

const projectRouter = Router()

projectRouter.get('/', projectController.index)
projectRouter.get('/create', isAdmin, projectController.create)
projectRouter.post('/create', isAdmin, projectController.store)
projectRouter.get('/:id', projectController.details)
projectRouter.get('/:id/edit', isAdmin, projectController.edit)
projectRouter.put('/:id/edit', isAdmin, projectController.update)
projectRouter.delete('/:id/delete', isAdmin, projectController.delete)

export default projectRouter