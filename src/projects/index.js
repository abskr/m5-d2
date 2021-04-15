/*     GET /projects => returns the list of projects
    GET /projects/id => returns a single project
    POST /projects => create a new project (Add an extra property NumberOfProjects on student and update it every time a new project is created)
    PUT /projects/id => edit the project with the given id
    DELETE /projects/id => delete the project with the given id */

import express from 'express'
import {check, validationResult} from 'express-validator'
//import fs from 'fs'
// import { fileURLToPath } from 'url'
// import { dirname, join, parse } from 'path'
import {getProjects, writeProjects, getStudents } from "../lib/fs-tools.js"
import uniqid from 'uniqid'

const router = express.Router()

// const __currentPath = fileURLToPath(import.meta.url)
// console.log(__currentPath)
// const projectsJSONPath = join(dirname(__currentPath), 'projects.json')

// const __currentPath = fileURLToPath(import.meta.url)
// //C:\Users\abskr\Documents\Studium\Strive\m5-d2\src\projects\index.js

// const __pathToProjects = dirname(__currentPath)
// //C:\Users\abskr\Documents\Studium\Strive\m5-d2\src\projects

// const __pathToProjectsJson = join(__pathToProjects, "projects.json")
// //C:\Users\abskr\Documents\Studium\Strive\m5-d2\src\projects\projects.json

// const __pathToSrc = dirname(__pathToProjects)
// //C:\Users\abskr\Documents\Studium\Strive\m5-d2\src

// const __pathToStudents = join(__pathToSrc, "students")
// //C:\Users\abskr\Documents\Studium\Strive\m5-d2\src\students

// const __pathToStudentsJson = join(__pathToStudents, "students.json")
// //C:\Users\abskr\Documents\Studium\Strive\m5-d2\src\students\students.json

// const getProjects = () => {
//   const toBeBuffer = fs.readFileSync(__pathToProjectsJson)
//   const toBeString = toBeBuffer.toString()
//   const toBeJSON = JSON.parse(toBeString)
//   return toBeJSON
// }

// const getStudents = () => {
//   const toBeBuffer = fs.readFileSync(__pathToStudentsJson)
//   const toBeString = toBeBuffer.toString()
//   const toBeJSON = JSON.parse(toBeString)
//   return toBeJSON
// }

router.get("/", async (req, res, next) => {
  try {
      const projects = await getProjects()
      if (req. query && req.query.name) {
        const filteredProjects = projects.filter(project => {
          project.hasOwnProperty("name") && (project.name === req.params.name)
        })
        res.status(200).send(filteredProjects)
      } else { 
        res.status(200).send(projects)
      }
  } catch (error) {
    console.log(error)
    next(error)
  }

})

router.get("/:id", async (req, res, next) => {
  try {
    const projects = await getProjects()
    const project = projects.filter(project => project.projectId === req.params.id)
    if (project.length > 0){
      res.send(project)
    } else {
      const err = new Error ()
      err.httpStatusCode = 404
      next(err)
    }
  } catch (error) {
    next(error)
  }
})

router.post("/", [check("name").exists().withMessage("Insert name!"), check("repoURL").exists().isURL().withMessage("Insert a valid URL of the repository!"), check("liveURL").exists().isURL().withMessage("Insert a valid URL of your project!"), check("studentId").exists().withMessage("Insert your valid student ID!")], async (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const projects = await getProjects()
      const students = await getStudents()
      const newProject = {
        ...req.body,
        projectId: uniqid(),
        createdAt: new Date(),
      }
      const selectedStudent = students.filter(student => student.id === newProject.studentId)
      if (selectedStudent) {
        projects.push(newProject)
        // fs.writeFileSync(__pathToProjectsJson, JSON.stringify(projects))
        await writeProjects(projects)
        res.status(201).send(newProject)
      } else {
        const err = new Error()
        err.errorList = errors
        err.httpStatusCode = 400
        next(err)
      }
    } else {
      const err = new Error()
      err.errorList = errors
      err.httpStatusCode = 400
      next(err)
    }
  } catch (error) {
    error.httpStatusCode = 500
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const projects = await getProjects()
    const newArrayOfProjects = projects.filter(project => project.projectId !== req.params.id)
    const editedProject = {
      ...req.body,
      projectId: req.params.id,
      updatedAt : new Date ()
    }

    if (editedProject.projectId === req.params.id) {
      newArrayOfProjects.push(editedProject)
      //fs.writeFileSync(__pathToProjectsJson, JSON.stringify(newArrayOfProjects))
      await writeProjects(newArrayOfProjects)
      res.send(editedProject)
    } else {
      res.status(400).send({errMsg: "No project found!"})
    }

  } catch(error) {
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const projects = await getProjects()
    const filteredProjects = projects.filter(project => project.projectId !== req.params.id)
    //fs.writeFileSync(__pathToProjectsJson, JSON.stringify(filteredProjects))
    await writeProjects(filteredProjects)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router