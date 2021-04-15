import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

//to target Json folder (for the function)
const pathTojsondataFolder = join(dirname(fileURLToPath(import.meta.url)), "../jsondata")

//to target raw-files folder
const studentImgFolderPath = join(dirname(fileURLToPath(
  import.meta.url)), "../../public/img/students")

export const getStudents = async () => await readJSON(join(pathTojsondataFolder, "students.json"))
export const getProjects = async () => await readJSON(join(pathTojsondataFolder, "projects.json"))
export const writeStudents = async () => await writeJSON(join(pathTojsondataFolder, "students.json"))
export const writeProjects = async () => await writeJSON(join(pathTojsondataFolder, "projects.json"))

export const getCurrentFolderPath = (currentFile) => dirname(fileURLToPath(currentFile))

export const writeStudentPic = async (fileName, content) => await writeFile(join(studentImgFolderPath, fileName), content)