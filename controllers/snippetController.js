import db from '../db/queries.js'
export default {
    /**
     * Récupère tous les snippets
     * @param {*} req 
     * @param {*} res 
     */
    getAllSnippetsGet: async (req, res) => {
        res.render('snippet/index', {
            title: "Tous les snippets",
            snippets: await db.getAllSnippets()
        })
    },

    /**
     * Récupère un snippet par son id
     * @param {*} req 
     * @param {*} res 
     */
    getSnippetGet: async (req, res) => {
        res.render('snippet/edit', {
            title: "Editer",
            snippet: await db.getSnippetById(Number(req.params.id))
        })
    },

    /**
     * Met à jour un snippet par son id
     * @param {*} req 
     * @param {*} res 
     */
    getSnippetPost: async (req, res) => {
        db.updateSnippetById(req.params.id, req.body.name)
        res.redirect('/snippet')
    }
}