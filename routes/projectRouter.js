import { Router } from "express";
import projectController from "../controllers/projectController.js";

const projectRouter = Router()

projectRouter.get('/', projectController.index)
projectRouter.get('/create', projectController.create)
projectRouter.post('/create', projectController.store)
projectRouter.get('/:projectId', projectController.details)
projectRouter.get('/:projectId/edit', projectController.edit)
projectRouter.post('/:projectId/edit', projectController.update)
projectRouter.post('/:projectId/delete', projectController.delete)

export default projectRouter