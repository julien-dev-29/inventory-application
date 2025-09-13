import dbSnippet from '../db/snippetQueries.js'
import dbTags from '../db/tagQueries.js'

export default {
    /**
     * Récupère tous les snippets
     * @param {*} req 
     * @param {*} res 
     */
    listAllSnippet: async (req, res) => {
        const { count } = await dbSnippet.count()
        let pages = (count / 8) + 1
        const currentPage = Number(req.query.p) || 1
        let offset = (currentPage - 1) * 8
        const snippets = await dbSnippet.getPaginateSnippetsWithLanguageAndCategoryAndTags(offset)
        res.render('snippet/index', {
            title: "Tous les snippets",
            pages: pages,
            currentPage: currentPage,
            snippets: snippets
        })
    },

    /**
     * Récupère un snippet par son id
     * @param {*} req 
     * @param {*} res 
     */
    editSnippetGet: async (req, res) => {
        res.render('snippet/edit', {
            title: "Editer",
            snippet: await dbSnippet.getSnippetByIdWithLanguageAndCategoryAndTags(Number(req.params.id)),
            tags: await dbTags.getAllTags()
        })
    },

    /**
     * Met à jour un snippet par son id
     * @param {*} req 
     * @param {*} res 
     */
    editSnippetPost: async (req, res) => {
        dbSnippet.updateSnippetById(req.params.id, req.body)
        res.redirect('/snippet')
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    deleteSnippet: async (req, res) => {
        dbSnippet.deleteSnippetById(req.params.id)
        res.redirect('/')
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    createSnippetGet: async (req, res) => {
        res.render('snippet/create', { title: "Créer un snippet" })
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    createSnippetPost: async (req, res) => {
        await dbSnippet.addSnippet(req.body)
        res.redirect('/snippet')
    }
}