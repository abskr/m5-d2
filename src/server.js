import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import studentRoutes from './students/index.js'
import projectsRoutes from './projects/index.js'
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler
} from "./errorHandler"

const server = express()
const port = process.env.PORT || 3001

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method: ${req.method} ${req.url} -- ${new Date()}`)
  next()
}

server.use(cors())
server.use(express.json())
server.use('/students', loggerMiddleware, studentRoutes)
server.use('/projects', projectsRoutes)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.log(listEndpoints(server))
server.listen(port, () => {
  console.log('Server is running on port ', port)
})