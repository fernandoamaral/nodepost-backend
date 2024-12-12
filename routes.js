import { Router } from 'express'
import PostController from './controllers/PostController.js'
import AuthController from './controllers/AuthController.js'
import UserController from './controllers/UserController.js'
import Auth from './middleware/Auth.js'

const router = Router()

router.post('/auth/signup', AuthController.signup)
router.post('/auth/login', AuthController.login)

router.get('/users', Auth, UserController.index)

router.get('/posts', PostController.index)
router.get('/posts/search', PostController.search)
router.get('/posts/:id', PostController.show)
router.post('/posts', Auth, PostController.store)
router.put('/posts/:id', Auth, PostController.update)
router.delete('/posts/:id', Auth, PostController.destroy)

export default router
