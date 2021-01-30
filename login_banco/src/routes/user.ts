import {UserController} from "./../controller/UserController";
import {Router} from "express";
import {checkJwt } from "./../middlewares/jwt";
import {checkRole} from "./../middlewares/role";

const router = Router();

//Obtener todos los usuarios
router.get('/', [checkJwt, checkRole(["admin"])], UserController.getAll);

//Obtener un Usuario
router.get('/:id', [checkJwt, checkRole(["admin"])], UserController.getById);

//Crear nuevo usuario
router.post('/', [checkJwt, checkRole(["admin"])], UserController.newUser);

//Editar Usuario
router.patch('/:id', [checkJwt, checkRole(["admin"])], UserController.editUser);

//Eliminar Usuario
router.delete('/:id', [checkJwt, checkRole(["admin"])], UserController.deleteUser);

export default router;