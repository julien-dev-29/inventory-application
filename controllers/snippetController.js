import snippetRepository from '../repositories/snippetRepository.js'
import languageRepository from '../repositories/languageRepository.js'
import tagRepository from '../repositories/tagRepository.js'
import projectRepository from '../repositories/projectRepository.js'
import { body, validationResult } from 'express-validator'

const appTitle = process.env.APP_TITLE

const lengthMinErr = "doit contenir au moins 2 caractères."
const lengthMinDescErr = "doit contenir au moins 8 caractères."
const lengthMaxErr = "ne peut pas dépasser 10 caractères."

const validateSnippet = [
    body('title').trim()
        .isLength({ min: 2 }).withMessage('Nom ' + lengthMinErr)
        .isLength({ max: 10 }).withMessage('Nom ' + lengthMaxErr),
    body('description').trim()
        .isLength({ min: 8 }).withMessage('Description ' + lengthMinDescErr)
]

export default {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    index: async (req, res) => {
        const { count } = await snippetRepository.count()
        const currentPage = Number(req.query.p) || 1
        const pages = Math.ceil(count / 8)
        const offset = (currentPage - 1) * 8
        res.render('snippets/index', {
            appTitle: appTitle,
            title: "Liste des snippets",
            snippets: await snippetRepository
                .getPaginatedSnippetsWithLanguageAndProjectsAndTags(offset),
            currentPage: currentPage,
            slug: "snippets",
            pages: pages
        })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    details: async (req, res) => {
        res.render('snippets/details', {
            appTitle: appTitle,
            title: "Details",
            snippet: await snippetRepository
                .getSnippetByIdWithLanguageAndProjectsAndTags(req.params.id)
        })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    edit: async (req, res) => {
        res.render('snippets/edit', {
            appTitle: appTitle,
            title: "Edit",
            snippet: await snippetRepository
                .getSnippetByIdWithLanguageAndProjectsAndTags(req.params.id),
            languages: await languageRepository.getAllLanguages(),
            tags: await tagRepository.getAllTags(),
            projects: await projectRepository.getAllProjects()
        })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    update: [
        validateSnippet,
        async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).render('snippets/edit', {
                    appTitle: appTitle,
                    title: "Edit",
                    snippet: await snippetRepository
                        .getSnippetByIdWithLanguageAndProjectsAndTags(req.params.id),
                    languages: await languageRepository.getAllLanguages(),
                    tags: await tagRepository.getAllTags(),
                    projects: await projectRepository.getAllProjects(),
                    errors: errors.array()
                })
            }
            snippetRepository.updateSnippetById(req.params.id, req.body)
                .then(() => res.redirect(`/snippets/${req.params.id}`))
                .catch(err => console.log(err))
        }],

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    create: async (req, res) => {
        res.render('snippets/create', {
            appTitle: appTitle,
            title: "Ajouter un snippet",
            languages: await languageRepository.getAllLanguages(),
            tags: await tagRepository.getAllTags(),
            projects: await projectRepository.getAllProjects()
        })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    store: [
        validateSnippet,
        async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).render('snippets/create', {
                    appTitle: appTitle,
                    title: "Ajouter un snippet",
                    languages: await languageRepository.getAllLanguages(),
                    tags: await tagRepository.getAllTags(),
                    projects: await projectRepository.getAllProjects(),
                    errors: errors.array()
                })
            }
            snippetRepository.insertSnippet(req.body)
                .then(() => res.redirect('/snippets'))
                .catch(err => {
                    console.log(err); rs
                })
        }],

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    delete: async (req, res) => {
        await snippetRepository.deleteSnippetById(req.params.id)
        res.redirect('/snippets')
    }
}