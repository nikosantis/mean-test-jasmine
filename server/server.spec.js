const express = require('express')
const logger = require('morgan')
const http = require('http')
const PinsRouter = require('./routes/pins')
const Pins = require('./models/Pins')
const request = require('request')

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
})
