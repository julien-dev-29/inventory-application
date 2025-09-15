export default {
    index: async (req, res) => {
        res.render('index', {title: "Home page"})
    }
}