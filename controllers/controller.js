const appTitle = process.env.APP_TITLE

export default {
    index: async (req, res) => {
        res.render('index', {
            appTitle: appTitle,
            title: "Home page"
        })
    }
}