import dbSnippet from '../db/snippetQueries.js'
import dbLanguage from '../db/languageQueries.js'
import dbTags from '../db/tagQueries.js'
import dbProjects from '../db/projectQueries.js'

export default {
    index: async (req, res) => {
        const { count } = await dbSnippet.count()
        const currentPage = req.query.p || 1
        const pages = Math.ceil(count / 8)
        const offset = (currentPage - 1) * 8
        res.render('snippets/index', {
            title: "Snippets",
            snippets: await dbSnippet.getPaginateSnippetsWithLanguageAndCategoryAndTags(offset),
            currentPage: currentPage,
            pages: pages
        })
    },
    details: async (req, res) => {
        res.render('snippets/details', {
            title: "Details",
            snippet: await dbSnippet.getSnippetByIdWithLanguageAndCategoryAndTags(req.params.snippetId)
        })
    },
    edit: async (req, res) => {
        res.render('snippets/edit', {
            title: "Edit",
            snippet: await dbSnippet.getSnippetByIdWithLanguageAndCategoryAndTags(req.params.snippetId),
            languages: await dbLanguage.getAllLanguages(),
            tags: await dbTags.getAllTags(),
            projects: await dbProjects.getAllProjects()
        })
    },
    update: async (req, res) => {
        await dbSnippet.updateSnippetById(req.params.snippetId, req.body)
        res.redirect(`/snippets/${req.params.snippetId}`)
    },
    create: async (req, res) => {
        res.render('snippets/create', {
            title: "Ajouter un snippet",
            languages: await dbLanguage.getAllLanguages(),
            tags: await dbTags.getAllTags(),
            projects: await dbProjects.getAllProjects()
        })
    },
    store: async (req, res) => {
        await dbSnippet.insertSnippet(req.body)
        res.redirect('/snippets')
    },
    delete: async (req, res) => {
        await dbSnippet.deleteSnippetById(req.params.snippetId)
        res.redirect('/snippets')
    }   
}