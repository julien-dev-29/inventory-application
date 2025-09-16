import { Router } from "express";
import projectController from "../controllers/projectController.js";

const projectRouter = Router()

projectRouter.get('/', projectController.index)
projectRouter.get('/create', projectController.create)
projectRouter.post('/create', projectController.store)
projectRouter.get('/:id', projectController.details)
projectRouter.get('/:id/edit', projectController.edit)
projectRouter.put('/:id/edit', projectController.update)
projectRouter.delete('/:id/delete', projectController.delete)

export default projectRouter