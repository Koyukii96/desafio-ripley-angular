import {Router} from "express";
import AuthController from "../controller/AuthController";
import {checkJwt} from "./../middlewares/jwt";
const router = Router();

//Logeo
router.post('/login', AuthController.login);

//Cambio de COntraseña
router.post('/cambio-password', [checkJwt], AuthController.changePass);

export default router;