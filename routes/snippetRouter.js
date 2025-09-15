import { Router } from "express";
import snippetController from "../controllers/snippetController.js";

const snippetRouter = Router()

snippetRouter.get('/snippets', snippetController.index)
snippetRouter.get('/snippets/create', snippetController.create)
snippetRouter.post('/snippets/create', snippetController.store)
snippetRouter.get('/snippets/:snippetId', snippetController.details)
snippetRouter.get('/snippets/:snippetId/edit', snippetController.edit)
snippetRouter.post('/snippets/:snippetId/edit', snippetController.update)
snippetRouter.post('/snippets/:snippetId/delete', snippetController.delete)

export default snippetRouter