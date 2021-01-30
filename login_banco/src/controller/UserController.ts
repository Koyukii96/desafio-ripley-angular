import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import {validate} from "class-validator";

export class UserController {

    static getAll = async(req: Request, res: Response)=>{
        const userRepository = getRepository(User);
        try {
            const users = await userRepository.find();
            res.send(users);
        } catch (error) {
            res.status(404).json({message: 'No se han encontrado resultados'});
        }

    };

    static getById = async(req: Request, res: Response)=>{
        const {id} = req.params;
        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOneOrFail(id);
            res.send(user);
        } catch (error) {
            res.status(404).json({message: "Sin Resultados"});
        }
    };

    static newUser = async(req: Request, res: Response)=>{
        const {username, password, role} = req.body;
        const user = new User();

        user.username = username;
        user.password = password;
        user.role = role;

        //Validaciones
        const validationOption = {validationError:{target:false, value:false}};
        const errors = await validate(user, validationOption);
        if(errors.length > 0){
            return res.status(400).json(errors);
        }
        //TODO HACER EL HASH
        const userRepository = getRepository(User);
        try {
            user.hashPassword();
            await userRepository.save(user);
        } catch (error) {
            return res.status(409).json({message: "El Usuario ya existe!."});
        }
        res.send("Usuario Creado Correctamente");
    };

    static editUser = async(req: Request, res: Response)=>{
        let user;
        const {id} = req.params;
        const {username, role} = req.body;

        const userRepository = getRepository(User);
        //Buscar el usuario
        try {
            user = await userRepository.findOneOrFail(id);
            user.username = username;
            user.role = role;
        } catch (error) {
            return res.status(404).json({message: "Usuario no encontrado!."});
        }
        const validationOption = {validationError:{target:false, value:false}};
        const errors = await validate(user, validationOption);

        if(errors.length > 0 ){
            return res.status(400).json(errors);
        }

        //Guardar Usuario

        try {
            await userRepository.save(user);
        } catch (error) {
            return res.status(409).json({message: "El usuario ya esta en uso."})
        }

        res.status(201).json({message: "Usuario Modificado."});
    };

    static deleteUser = async(req: Request, res: Response)=> {
        const {id} = req.params;
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json({message: "Usuario no encontrado."});
        }
        userRepository.delete(id);
        res.status(201).json({message: "Usuario Eliminado"});
    };
}

export default UserController;