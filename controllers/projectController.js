import { body, validationResult } from 'express-validator'
import projectRepository from '../repositories/projectRepository.js'

const lengthErr = "Le nom doit faire entre 3 et 15 charactères"

const validateProject = [
    body('name').trim()
        .isLength({ min: 3, max: 15 }).withMessage(lengthErr),
    body('description').trim()
        .isLength({ min: 3, max: 15 }).withMessage(lengthErr),
    body('github_repo').trim()
        .isLength({ min: 3, max: 15 }).withMessage(lengthErr)

]

const appTitle = process.env.APP_TITLE
/**
 * 
 */
export default {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    index: async (req, res) => {
        const currentPage = req.query.p || 1
        const count = await projectRepository.count()
        const pages = Math.ceil(count / 8)
        const offset = (currentPage - 1) * 8
        projectRepository.getAllProjects(offset)
            .then(projects => {
                res.render('projects/index', {
                    appTitle: appTitle,
                    title: "Liste des projets",
                    projects: projects,
                    currentPage: currentPage,
                    pages: pages
                })
            })
            .catch(err => {
                console.log(err);
            })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    create: (req, res) => {
        res.render('projects/create', {
            appTitle: appTitle,
            title: "Ajouter un projet"
        })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    details: (req, res) => {
        projectRepository.getProjectById(req.params.id)
            .then(project => {
                res.render('projects/details', {
                    appTitle: appTitle,
                    title: `Détails du projet ${project.title}`,
                    project: project
                })
            })
            .catch(err => {
                console.log(err);
            })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    store: [
        validateProject,
        (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).render('projects/create', {
                    appTitle: appTitle,
                    title: "Ajouter un projet",
                    errors: errors.array()
                })
            }
            projectRepository.createProject(req.body)
                .then(() => {
                    res.redirect("/projects")
                })
                .catch(err => {
                    console.log(err);
                })
        }
    ],

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    update: [
        validateProject,
        (req, res) => {
            const project = req.body
            projectRepository.updateProject(req.params.id, project)
                .then(() => {
                    res.redirect('/projects')
                })
                .catch(err => {
                    console.log(err);
                })
        }
    ],

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    edit: (req, res) => {
        projectRepository.getProjectById(req.params.id)
            .then(project => {
                res.render('projects/edit', {
                    appTitle: appTitle,
                    title: "Editer le projet",
                    project: project
                })
            })
            .catch(err => {
                console.log(err);
            })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    delete: (req, res) => {
        projectRepository.deleteProject(req.params.id)
            .then(() => {
                res.redirect('/projects')
            })
            .catch(err => {
                console.log(err);
            })
    }
}