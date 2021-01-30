import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import * as jwt from "jsonwebtoken";
import config from "./../config/config";
import { validate } from "class-validator";

class AuthController {
    static login = async (req: Request, res: Response) =>{
        const {username, password} = req.body;

        if(!(username && password)){
            res.status(400).json({message: 'Usuario y Contraseña Requeridos!!'});
        }

        const userRepository = getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneOrFail({where: {username: username}});
        }catch(e){
            return res.status(400).json({message: 'Usuario o Contraseña Incorrecto!'});
        }

        //Comprobar pass
        if(!user.checkPassword(password)){
            return res.status(400).json({message:"Usuario o Contraseña Incorrecto!"});
        }

        const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {expiresIn: '1h'})
        
        res.json({message:'OKI', token, userId: user.id, role: user.role});
    }

    static changePass = async (req: Request, res: Response)=>{
        const { userId } = res.locals.jwtpayload;
        const { oldPass, newPass}= req.body;

        if(!(oldPass && newPass)){
            res.status(400).json({message: "Contraseña nueva y antigua son requeridas"});
        }

        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(userId);
        } catch (error) {
            res.status(400).json({message: "Algo salio Mal"});
        }
        
        if(!user.checkPassword(oldPass)){
            return res.status(401).json({message: "Verifica tu contraseña."});
        }

        user.password = newPass;
        const validationOps = {validationError: {target:false, value:false}};
        const errors = await validate(user, validationOps);
        
        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        //Encriptar Pass
        user.hashPassword();
        userRepository.save(user);

        res.json({message: "Constraseña cambiada con exito!"});
    }
}
export default AuthController;