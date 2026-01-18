import { Router } from "express";
import passport from "passport";
import authController from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/login", authController.authGet);
authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/snippets",
    failureRedirect: "/login",
  }),
);
//authRouter.get('/register', authController.registerGet)
//authRouter.post('/register', authController.registerPost)
authRouter.get("/logout", authController.logout);

export default authRouter;
