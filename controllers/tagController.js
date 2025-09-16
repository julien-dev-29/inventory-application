import tagRepository from '../repositories/tagRepository.js'
import { body, validationResult } from 'express-validator'

const appTitle = process.env.APP_TITLE

const lengthMinErr = "doit contenir au moins 3 caractères."
const lengthMinDescErr = "doit contenir au moins 8 caractères."
const lengthMaxErr = "ne peut pas dépasser 10 caractères."

const validateTag = [
    body('name').trim()
        .isLength({ min: 3 }).withMessage("Nom " + lengthMinErr)
]


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
        const currentPage = Number(req.query.p) || 1
        const count = await tagRepository.count()
        const pages = Math.ceil(count / 8)
        const offset = (currentPage - 1) * 8
        tagRepository.getAllTags(offset)
            .then(tags => {
                res.render('tags/index', {
                    appTitle: appTitle,
                    title: "Liste des tags",
                    tags: tags,
                    currentPage: currentPage,
                    slug: "tags",
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
        res.render('tags/create', {
            appTitle: appTitle,
            title: "Ajouter un tag"
        })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    details: (req, res) => {
        tagRepository.getTagById(req.params.id)
            .then(tag => {
                res.render('tags/details', {
                    appTitle: appTitle,
                    title: `Détails du tag : ${tag.name}`,
                    tag: tag
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
        validateTag,
        (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).render('tags/create', {
                    appTitle: appTitle,
                    title: "Ajouter un tag",
                    errors: errors.array()
                })
            }
            tagRepository.insertTag(req.body)
                .then(() => {
                    res.redirect("/tags")
                })
                .catch(err => {
                    console.log(err);
                })
        }],

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    update: [
        validateTag,
        (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return tagRepository.getTagById(req.params.id)
                    .then(tag => {
                        res.render('tags/edit', {
                            appTitle: appTitle,
                            title: "Editer le tag: " + tag.name,
                            tag: tag,
                            errors: errors.array()
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            const id = req.params.id
            tagRepository.updateTagById(id, req.body)
                .then(() => {
                    res.redirect('/tags/' + id)
                })
                .catch(err => {
                    console.log(err);
                })
        }],

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    edit: (req, res) => {
        tagRepository.getTagById(req.params.id)
            .then(tag => {
                res.render('tags/edit', {
                    appTitle: appTitle,
                    title: "Editer le tag: " + tag.name,
                    tag: tag
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
        console.log(req);
        tagRepository.deleteTagById(req.params.id)
            .then(() => {
                res.redirect('/tags')
            })
            .catch(err => {
                console.log(err);
            })
    }
}