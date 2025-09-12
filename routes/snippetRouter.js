import { Router } from "express";
import snippetController from '../controllers/snippetController.js'

const snippetRouter = Router()

snippetRouter.get('/snippet', snippetController.getAllSnippetsGet)
snippetRouter.get('/snippet/:id', snippetController.getSnippetGet)
snippetRouter.post('/snippet/:id', snippetController.getSnippetPost)

export default snippetRouter 