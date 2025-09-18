import { Router } from "express";
import controller from "../controllers/controller.js";
import passport from "passport";

const router = Router()

router.get('/', controller.index)


export default router