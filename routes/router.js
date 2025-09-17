import { Router } from "express";
import controller from "../controllers/controller.js";
import passport from "passport";

const router = Router()

router.get('/', controller.index)
router.get('/admin', controller.authGet)
router.post('/admin', passport.authenticate("local", {
    successRedirect: '/snippets',
    failureRedirect: '/admin'
}))
router.get('/register', controller.registerGet)
router.post('/register', controller.registerPost)
router.get('/logout', controller.logout)

export default router