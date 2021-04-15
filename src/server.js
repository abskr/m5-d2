import express from 'express'
import listEndpoints from 'express-list-endpoints'
import { join } from "path"
import cors from 'cors'
import studentRoutes from './students/index.js'
import projectsRoutes from './projects/index.js'
import filesRoutes from "./filesorganizer/index.js"
import { getCurrentFolderPath } from "./lib/fs-tools.js"
// import {
//   badRequestErrorHandler,
//   notFoundErrorHandler,
//   forbiddenErrorHandler,
//   catchAllErrorHandler
// } from "./errorHandler"

const server = express()
const port = process.env.PORT || 3001
const pathToPublicFolder = join(getCurrentFolderPath(import.meta.url), "../public")

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method: ${req.method} ${req.url} -- ${new Date()}`)
  next()
}

server.use(express.static(pathToPublicFolder))
server.use(cors())
server.use(express.json())
server.use('/students', loggerMiddleware, studentRoutes)
server.use('/projects', projectsRoutes)
server.use('/files', filesRoutes)

// server.use(badRequestErrorHandler)
// server.use(notFoundErrorHandler)
// server.use(forbiddenErrorHandler)
// server.use(catchAllErrorHandler)

console.log(listEndpoints(server))
server.listen(port, () => {
  console.log('Server is running on port ', port)
})