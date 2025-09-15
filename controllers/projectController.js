import dbProjects from '../db/projectQueries.js'

export default {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    index: async (req, res) => {
        const currentPage = req.query.p || 1
        const count = await dbProjects.count()
        const pages = Math.ceil(count / 8)
        const offset = (currentPage - 1) * 8
        dbProjects.getAllProjects(offset)
            .then(projects => {
                res.render('projects/index', {
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
            title: "Ajouter un projet"
        })
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    details: (req, res) => {
        dbProjects.getProjectById(req.params.projectId)
            .then(project => {
                res.render('projects/details', {
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
    store: (req, res) => {
        dbProjects.createProject(req.body)
            .then(() => {
                res.redirect("/projects")
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
    update: (req, res) => {
        const project = req.body
        dbProjects.updateProject(req.params.projectId, project)
            .then(() => {
                res.redirect('/projects')
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
    edit: (req, res) => {
        dbProjects.getProjectById(req.params.projectId)
            .then(project => {
                res.render('projects/edit', {
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
        dbProjects.deleteProject(req.params.projectId)
            .then(() => {
                res.redirect('/projects')
            })
            .catch(err => {
                console.log(err);
            })
    }
}