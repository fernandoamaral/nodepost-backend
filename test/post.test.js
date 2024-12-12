import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken'
import app from '../server.js'
import Post from '../models/post.js'
import User from '../models/user.js'

let mongo;
let token;
let user;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)

  user = await User.create({ name: 'Test User', email: 'test@example.com', password: 'password123' });

  token = jwt.sign(
    { email: user.email, userId: user._id.toString() },
    process.env.JWT_SECRET || 'batman',
    { expiresIn: '1h' }
  )
})

beforeEach(async () => {
  await Post.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
})

async function createPost(title, content){
  const post = await Post.create({ title, content, author: user.id })
  return post
}

describe('GET /posts', () => {
  it('Should return all the posts', async () => {
    const post1 = await createPost('Post 1', 'Content 1')
    const post2 = await createPost('Post 2', 'Content 2')

    const response = await supertest(app)
      .get('/posts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body.posts.length).toBe(2)

    // on desc order
    expect(response.body.posts[0].title).toBe(post2.title)
    expect(response.body.posts[1].title).toBe(post1.title)
  })
})

describe('GET /posts/:id', () => {
  it('Should return a 404 when the post doesn\'t exist', async () => {
    await supertest(app)
      .get('/posts/66c8db4b13a5ab5d7b8a3c9d')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  it('Should return a post', async () => {
    const post = await createPost('Post', 'Content')
    const response = await supertest(app)
      .get(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    
    expect(response.body.title).toBe('Post')
    expect(response.body.content).toBe('Content')
  })
})

describe('POST /posts', () => {
  it('Should return a 201 when the post is created', async () => {
    const newPost = {
      title: 'Test Title',
      content: 'Test Content'
    }

    const response = await supertest(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost)
      .expect(201)

    expect(response.body.title).toBe(newPost.title)
    expect(response.body.content).toBe(newPost.content)
  })

  it('Should return a 422 when the body is invalid', async () => {
    const invalidPost = {
      content: 'Test Content'
    }

    await supertest(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidPost)
      .expect(422)
  })
})

describe('PUT /posts/:id', () => {
  it('Should return a 422 when the body is invalid', async () => {
    const post = await createPost('Post', 'Content')
    await supertest(app)
      .put(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ invalid: 'invalid body' })
      .expect(422)
  })

  it('Should return a 404 when the post doesn\'t exist', async () => {
    await supertest(app)
      .put('/posts/66c8db4b13a5ab5d7b8a3c9d')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Post', content: 'Content' })
      .expect(404)
  })

  it('Should return a 200 when the post is updated', async () => {
    const post = await createPost('Post', 'Content')
    const response = await supertest(app)
      .put(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Post updated', content: 'Content updated' })
      .expect(200)

    expect(response.body.message).toBe('Post updated.')
  })
})

describe('DELETE /posts/:id', () => {
  it('Should return a 404 when the post doesn\'t exist', async () => {
    await supertest(app)
      .delete('/posts/66c8db4b13a5ab5d7b8a3c9d')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  it('Shoud return a 200 when the post is deleted', async () => {
    const post = await createPost('Post', 'Content')
    await supertest(app)
      .delete(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    
    const storedPost = await Post.findById(post.id)
    expect(storedPost).toBe(null)
  })
})

describe('GET /posts/search', () => {
  it('Should search for posts by keyword', async () => {
    const post1 = await createPost('First Post', 'Content of the first post')
    const post2 = await createPost('Second Post', 'Content of the second post')

    const response = await supertest(app)
      .get('/posts/search?q=first')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    
      expect(response.body.posts.length).toBe(1)
      expect(response.body.posts[0].title).toBe(post1.title)
  })
})
