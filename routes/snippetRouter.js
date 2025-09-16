import { Router } from "express";
import snippetController from "../controllers/snippetController.js";

const snippetRouter = Router()

snippetRouter.get('/', snippetController.index)
snippetRouter.get('/create', snippetController.create)
snippetRouter.post('/create', snippetController.store)
snippetRouter.get('/:id', snippetController.details)
snippetRouter.get('/:id/edit', snippetController.edit)
snippetRouter.put('/:id/edit', snippetController.update)
snippetRouter.delete('/:id/delete', snippetController.delete)

export default snippetRouter