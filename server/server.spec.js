const express = require('express')
const logger = require('morgan')
const http = require('http')
const PinsRouter = require('./routes/pins')
const Pins = require('./models/Pins')
const request = require('request')
const requestPromise = require('request-promise-native')
const axios = require('axios')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use('/api', PinsRouter.router)
app.set('port', 3000)

describe('Testing Router', () => {
  let server

  beforeAll(() => {
    server = http.createServer(app)
    server.listen(3000)
  })

  afterAll(() => {
    server.close()
  })

  describe('GET ALL PINS', () => {
    // GET 200
    it('200 and find pin', done => {
      const data = [{ _id: 1 }]
      spyOn(Pins, 'find').and.callFake(callBack => {
        callBack(false, data)
      })

      request.get('http://localhost:3000/api', (err, res, body) => {
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.body)).toEqual([{ _id: 1 }])
        done()
      })
    })

    // GET 500
    it('500', done => {
      const data = [{ _id: 1 }]
      spyOn(Pins, 'find').and.callFake(callBack => {
        callBack(true, data)
      })

      request.get('http://localhost:3000/api', (err, res, body) => {
        expect(res.statusCode).toBe(500)
        done()
      })
    })
  })

  describe('GET SINGLE PIN BY ID', () => {
    // GET 200
    it('should return 200 and find pin by id', done => {
      const data = [{ _id: 1 }]
      spyOn(Pins, 'findById').and.callFake((id, callBack) => {
        callBack(false, data)
      })
      request.get('http://localhost:3000/api/1', (err, res, body) => {
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.body)).toEqual([{ _id: 1 }])
        done()
      })
    })

    // GET 500
    it('should return 500', done => {
      const data = [{ _id: 1 }]
      spyOn(Pins, 'findById').and.callFake((id, callBack) => {
        callBack(true, data)
      })

      request.get('http://localhost:3000/api/1', (err, res, body) => {
        expect(res.statusCode).toBe(500)
        done()
      })
    })
  })

  describe('POST - SAVE PIN', () => {
    // 200
    it('should return 200', done => {
      const post = [{
        title: 'Post Nombre',
        author: 'Nikolas',
        description: 'Nikolas rules',
        percentage: 0,
        tags: [],
        assets: [
          {
            title: 'title',
            description: 'description',
            reader: false,
            url: 'http://nikolas.com'
          }
        ]
      }]
      spyOn(Pins, 'create').and.callFake((pin, callBack) => {
        callBack(false, {})
      })

      spyOn(requestPromise, 'get').and.returnValue(
        Promise.resolve('<title>Post Nombre</title><meta name="description" content="Nikolas rules">')
      )

      const assets = [{ url: 'http://nikolas.com' }]

      axios.post(
        'http://localhost:3000/api',
        { title: 'title', author: 'author', description: 'description', assets })
        .then(res => {
          expect(res.status).toBe(200)
          done()
        })
    })

    // 200
    it('should return 200 PDF', done => {
      spyOn(Pins, 'create').and.callFake((pins, callBack) => {
        callBack(false, {})
      })

      const assets = [{ url: 'http://nikolas.pdf' }]

      axios.post(
        'http://localhost:3000/api',
        { title: 'title', author: 'author', description: 'description', assets })
        .then(res => {
          expect(res.status).toBe(200)
          done()
        })
    })

    // 500 requestPromise
    it('should return 500', done => {
      const post = [{
        title: 'Post Nombre',
        author: 'Nikolas',
        description: 'Nikolas rules',
        percentage: 0,
        tags: [],
        assets: [
          {
            title: 'title',
            description: 'description',
            reader: false,
            url: 'http://nikolas.com'
          }
        ]
      }]
      spyOn(Pins, 'create').and.callFake((pin, callBack) => {
        callBack(true, {})
      })

      spyOn(requestPromise, 'get').and.returnValue(
        Promise.resolve('<title>Post Nombre</title><meta name="description" content="Nikolas rules">')
      )

      const assets = [{ url: 'http://nikolas.com' }]

      axios.post(
        'http://localhost:3000/api',
        { title: 'title', author: 'author', description: 'description', assets })
        .catch(error => {
          expect(error.response.status).toBe(500)
          done()
        })
    })

    // 500 create
    it('should return 500', done => {
      spyOn(Pins, 'create').and.callFake((pins, callBack) => {
        callBack(true, {})
      })

      const assets = [{ url: 'http://nikolas.com' }]

      axios.post(
        'http://localhost:3000/api',
        { title: 'title', author: 'author', description: 'description', assets })
        .catch(error => {
          expect(error.response.status).toBe(500)
          done()
        })
    })
  })
})
