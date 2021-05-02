import express from 'express'
import session, { Store } from 'express-session'


import { SESSION_OPTIONS } from './config'
import { serverError, notFound, active, catchAsync } from './middleware';
import { home, login, register } from "./routes";


export const createApp = (store: Store) => {
    const app = express();

    app.use(express.json())

    app.use(
        session({
            ...SESSION_OPTIONS,
            store
        })
    )

    //app.use(catchAsync(active))

    app.use(login)

    app.use(register)

    app.use(home)

    app.use(notFound)

    app.use(serverError)
        
    return app
}
    
