import { Router } from 'express'
import PostController from './controllers/PostController.js'

const router = Router()

router.get('/posts', PostController.index)
router.get('/posts/search', PostController.search)
router.get('/posts/:id', PostController.show)
router.post('/posts', PostController.store)
router.put('/posts/:id', PostController.update)
router.delete('/posts/:id', PostController.destroy)

export default router
