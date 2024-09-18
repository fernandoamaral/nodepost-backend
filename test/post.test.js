import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js'
import Post from '../models/post.js'

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
})

beforeEach(async () => {
  await Post.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
})

describe('GET /posts', () => {
  it('Should return all the posts', async () => {
    const post1 = { title: 'Post 1', content: 'Content 1' }
    const post2 = { title: 'Post 2', content: 'Content 2' }

    await Post.create(post1)
    await Post.create(post2)

    const response = await supertest(app)
      .get('/posts')
      .expect(200)

    expect(response.body.posts.length).toBe(2)
    expect(response.body.posts[0].title).toBe(post1.title)
    expect(response.body.posts[1].title).toBe(post2.title)
  })
})

describe('GET /posts/:id', () => {
  it('Should return a 404 when the post doesn\'t exist', async () => {
    await supertest(app)
      .get('/posts/66c8db4b13a5ab5d7b8a3c9d')
      .expect(404)
  })

  it('Should return a post', async () => {
    const post = await Post.create({ title: 'Post', content: 'Content' })
    const response = await supertest(app)
      .get(`/posts/${post.id}`)
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
      .send(newPost)
      .expect(201)

    expect(response.body.title).toBe(newPost.title)
    expect(response.body.content).toBe(newPost.content)
  })

  it('Should return a 400 when the body is invalid', async () => {
    const invalidPost = {
      content: 'Test Content'
    }

    await supertest(app)
      .post('/posts')
      .send(invalidPost)
      .expect(400)
  })
})

describe('PUT /posts/:id', () => {
  it('Should return a 400 when the body is invalid', async () => {
    const post = await Post.create({ title: 'Post', content: 'Content' })
    await supertest(app)
      .put(`/posts/${post.id}`)
      .send({ invalid: 'invalid body' })
      .expect(400)
  })

  it('Should return a 404 when the post doesn\'t exist', async () => {
    await supertest(app)
      .put('/posts/66c8db4b13a5ab5d7b8a3c9d')
      .send({ title: 'Post', content: 'Content' })
      .expect(404)
  })

  it('Should return a 200 when the post is updated', async () => {
    const post = await Post.create({ title: 'Post', content: 'Content' })
    const response = await supertest(app)
      .put(`/posts/${post.id}`)
      .send({ title: 'Post updated', content: 'Content updated' })
      .expect(200)
    
    expect(response.body.title).toBe('Post updated')
    expect(response.body.content).toBe('Content updated')
  })
})

describe('DELETE /posts/:id', () => {
  it('Should return a 404 when the post doesn\'t exist', async () => {
    await supertest(app)
      .delete('/posts/66c8db4b13a5ab5d7b8a3c9d')
      .expect(404)
  })

  it('Shoud return a 200 when the post is deleted', async () => {
    const post = await Post.create({ title: 'Post', content: 'Content' })
    await supertest(app)
      .delete(`/posts/${post.id}`)
      expect(200)
    
    const storedPost = await Post.findById(post.id)
    expect(storedPost).toBe(null)
  })
})

describe('GET /posts/search', () => {
  it('Should search for posts by keyword', async () => {
    const post1 = { title: 'First Post', content: 'Content of the first post' }
    const post2 = { title: 'Second Post', content: 'Content of the second post' }

    await Post.create(post1)
    await Post.create(post2)

    const response = await supertest(app)
      .get('/posts/search?q=first')
      .expect(200)
    
      expect(response.body.posts.length).toBe(1)
      expect(response.body.posts[0].title).toBe(post1.title)
  })
})
