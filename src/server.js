import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import studentRoutes from './students/index.js'

const server = express()
const port = 3001

server.use(cors())
server.use(express.json())
server.use('/students', studentRoutes)

console.log(listEndpoints(server))
server.listen(port, () => {
  console.log('Server is running on port ', port)
})