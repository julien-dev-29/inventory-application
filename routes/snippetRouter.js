import { Router } from "express";
import snippetController from "../controllers/snippetController.js";

const snippetRouter = Router()

snippetRouter.get('/', snippetController.index)
snippetRouter.get('/create', snippetController.create)
snippetRouter.post('/create', snippetController.store)
snippetRouter.get('/:snippetId', snippetController.details)
snippetRouter.get('/:snippetId/edit', snippetController.edit)
snippetRouter.post('/:snippetId/edit', snippetController.update)
snippetRouter.post('/:snippetId/delete', snippetController.delete)

export default snippetRouter