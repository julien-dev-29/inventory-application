import { Router } from "express";
import snippetController from "../controllers/snippetController.js";
import { isAdmin } from "./authMiddleware.js";

const snippetRouter = Router()

snippetRouter.get('/', snippetController.index)
snippetRouter.get('/create', isAdmin, snippetController.create)
snippetRouter.post('/create', isAdmin, snippetController.store)
snippetRouter.get('/:id', snippetController.details)
snippetRouter.get('/:id/edit', isAdmin, snippetController.edit)
snippetRouter.put('/:id/edit', isAdmin, snippetController.update)
snippetRouter.delete('/:id/delete', isAdmin, snippetController.delete)

export default snippetRouter