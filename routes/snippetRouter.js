import { Router } from "express";
import snippetController from '../controllers/snippetController.js'

const snippetRouter = Router()

snippetRouter.get('/snippet/create', snippetController.createSnippetGet)
snippetRouter.post('/snippet/create', snippetController.createSnippetPost)

snippetRouter.get('/snippet', snippetController.listAllSnippet)
snippetRouter.get('/snippet/:id', snippetController.editSnippetGet)
snippetRouter.post('/snippet/:id', snippetController.editSnippetPost)

snippetRouter.delete('/snippet/:id', snippetController.deleteSnippet)

export default snippetRouter 