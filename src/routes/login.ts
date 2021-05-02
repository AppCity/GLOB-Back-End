import { Router } from "express";
import { catchAsync, guest, auth } from "../middleware";
import { User } from "../models";
import { validate, loginSchema } from "../validation";
import { Unauthorized } from "../errors";
import { logIn, logOut } from "../auth";

const router = Router()

router.post('/login', guest, catchAsync(async (req, res) => {
    await validate(loginSchema, req.body)
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user)
        console.log(await user.matchesPassword(password))


    /*
      TODO questo codice è vulnerabile ai TimingAttack,
      ossia con una serie di richieste riesco a capire quando sbaglia la mail
      e quando la password, poiché la password mette molto più tempo ad essere elaborata
    */
    if (!user || !(await user.matchesPassword(password))) {
        throw new Unauthorized('Incorrect email or password')
    }

    logIn(req, user.id)

    res.json({ message: 'OK'})
}))

router.post('/logout', auth, catchAsync(async(req, res) => {
    await logOut(req, res)
    
    res.json({ messsage: 'OK'})
}))

export default router