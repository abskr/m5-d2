import express from "express"
import { writeStudentPic} from "../lib/fs-tools.js"
import multer from "multer"
import { pipeline } from "stream"

const router = express.Router()

// router.post("/uploadPhoto", multer().single("profilePic"), async (req, res, next) => {
//   //  const students = await getStudents()
//   //  const student = students.find(s => s.id === req.params.id)
//   try {
//     console.log(req.file)
//     res.send("ok")
//   } catch (error) {
    
//   }
// })

router.post("/upload", multer().single("profilePic"), async (req, res, next) => {
  try {
    console.log(req.file)
    await writeStudentPic(req.file.originalname, req.file.buffer)
    res.send("ok")
  } catch (error) {
    console.log(error)
  }
})

export default router