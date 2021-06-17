const { Router } = require("express")
const { guest, auth } = require("../middleware/auth")
const { catchAsync } = require("../middleware/errors")
const { User } = require("../models/user")
const { validate } = require("../validation/joi")
const { loginSchema } = require("../validation/auth")
const { Unauthorized } = require("../errors/index")
const { logIn, logOut } = require("../auth")

const router = Router()

router.post('/login', guest, catchAsync(async (req, res) => {
    await validate(loginSchema, req.body)
    const { email, password } = req.body

    const user = await User.findOne({ email })

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

    res.end()

    return true
}))

router.post('/logout', auth, catchAsync(async(req, res) => {
    await logOut(req, res)
    
    res.json({ messsage: 'OK'})

    res.end()

    return true
}))

module.exports = {
    router
}