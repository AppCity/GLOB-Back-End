import { Request, Response, Router } from 'express'
import { auth, catchAsync } from '../middleware'
import { User } from '../models'

const router = Router()

router.get('/home', auth, catchAsync(async (req: Request, res: Response) => {
    // 2 methods, remove the unwanted fields
    // or use a Mongoose model (see user.ts -> end)
    const user = await User.findById(req.session!.userId)
    //const user = await User.findById(req.session!.userId).select('-password -__v')
    res.json(user)

    res.end()

    return true
}))

export default router