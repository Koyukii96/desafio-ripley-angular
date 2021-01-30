import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import config from '../config/config';

export const checkJwt = (req: Request, res: Response, next: NextFunction)=> {

    console.log("HEADERS ->", req.headers);
    
    const token = <string>req.headers['auth'];
    let jwtpayload;

    try {
        jwtpayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtpayload = jwtpayload;
    } catch (error) {
        return res.status(401).json({message: "Usuario no autorizado para realizar esta acción"});
    }

    const {userId, username} = jwtpayload;

    const newToken = jwt.sign({ userId, username }, config.jwtSecret, { expiresIn: '1h' });
    res.setHeader('token', newToken);

    next();
}