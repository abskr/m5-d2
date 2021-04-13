/* STUDENTS CRUD
1. get all students --> GET http://localhost:3001/students
2. get single student --> GET http://localhost:3001/students/:id
3. create single student --> POST http://localhost:3001/students
4. edit single student --> PUT http://localhost:3001/students/:id
5. delete single student --> DELETE http://localhost:3001/students/:id
*/

import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const studentsJSONPath = join(dirname(__filename), 'students.json')

const fileAsABuffer = fs.readFileSync(studentsJSONPath) // returns a buffer (machine readable, not human readable)
const fileAsAString = fileAsABuffer.toString() // returns a string from a buffer
const fileAsAJSON = JSON.parse(fileAsAString) // converts string into JSON
const students = JSON.parse(fileAsAString)

router.get("/", (req, res) => {
  console.log("GET ROUTE")
  res.send(fileAsAJSON) // sends the json as response
})

router.get('/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id)
  res.send(student)
})

router.post('/', (req, res) => {
  //extract the req. body and create an unique id for him/her
  const newStudents = req.body
  console.log(newStudents)
  newStudents.id = uniqid()

  // 2.1 extract the req. body and create an unique id for him/her
  
  students.push(newStudents)

  // 3. replace old content in the file with new array
  fs.writeFileSync(studentsJSONPath, JSON.stringify(students))

  res.status(201).send(newStudents)
})

router.put('/:id', (req, res) => {

  const newStudentsArray = students.filter(student => student.id !== req.params.id)

  const modifiedUser = req.body
  modifiedUser.ID = req.params.id

  newStudentsArray.push(modifiedUser)

  fs.writeFileSync(studentsJSONPath, JSON.stringify(newStudentsArray))

  res.send({ msg: 'Data edited'})

})

router.delete('/:id', (req, res) => {
  const newStudentsArray = students.filter(student => student.ID !== req.params.id)

  fs.writeFileSync(studentsJSONPath, JSON.stringify(newStudentsArray))

  res.status(204).send()
})


export default router