import { NextFunction, Request, Response } from "express";
import { isLoggedIn, logOut } from '../auth'
import { Unauthorized } from "../errors";
import { SESSION_ABSOLUTE_TIMEOUT } from "../config";

export const guest = (req: Request, res: Response, next: NextFunction) => {
    if (isLoggedIn(req)) {
        return next(new Unauthorized('You are already logged in'))
    }

    next()
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    if (!isLoggedIn(req)) {
        return next(new Unauthorized('You must be logged in'))
    }

    next()
}

export const active = async (req: Request, res: Response, next: NextFunction) => {
    if (isLoggedIn(req)) {
        const now = Date.now()
        const { createdAt } = req.session //as Express.Session

        if (!createdAt || now > createdAt + SESSION_ABSOLUTE_TIMEOUT) {
            await logOut(req, res)

            return next(new Unauthorized('Session Expired'))
        }
    }

    next()
}