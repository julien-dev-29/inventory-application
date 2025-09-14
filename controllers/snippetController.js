import dbSnippet from '../db/snippetQueries.js'
import dbTags from '../db/tagQueries.js'
import dbProjects from '../db/projectQueries.js'
import dbLanguage from '../db/languageQueries.js'
import languageQueries from '../db/languageQueries.js'

export default {
    /**
     * Récupère tous les snippets
     * @param {*} req 
     * @param {*} res 
     */
    listAllSnippet: async (req, res) => {
        const { count } = await dbSnippet.count()
        let pages = Math.ceil(count / 8)
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
            tags: await dbTags.getAllTags(),
            projects: await dbProjects.getAllProjects(),
            languages: await dbLanguage.getAllLanguages()
        })
    },

    /**
     * Met à jour un snippet par son id
     * @param {*} req 
     * @param {*} res 
     */
    editSnippetPost: async (req, res) => {
        await dbSnippet.updateSnippetById(req.params.id, req.body)
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.redirect('/snippet');
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
        res.render('snippet/create', {
            title: "Créer un snippet",
            languages: await dbLanguage.getAllLanguages(),
            tags: await dbTags.getAllTags(),
            projects: await dbProjects.getAllProjects()
        })
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    createSnippetPost: async (req, res) => {
        console.log(req.body);
        await dbSnippet.insertSnippet(req.body)
        res.redirect('/snippet')
    }
}