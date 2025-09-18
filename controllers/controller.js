import userRepository from "../repositories/userRepository.js"
import bcrypt from 'bcrypt'
const appTitle = process.env.APP_TITLE

export default {
    index: (req, res) => {
        res.render('index', {
            appTitle: appTitle,
            title: "Home page"
        })
    }
}