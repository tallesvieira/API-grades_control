/*import express from "express";
import { promises } from "fs";
import winston from "winston";
import gradesRouter from "../routes/grades.js";

const app = express();
const readFile = promises.readFile;
const writeFile = promises.writeFile;
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
});

global.fileGrade = "grades.json";
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: "grades_control.log" })
  ],
  format: combine(
    label({ label: "grades-control-API" }),
    timestamp(),
    myFormat
  )
});

app.use(express.json());
app.use("/grade", gradesRouter);

app.listen(3000, async () => {

  try {
    await readFile(global.fileGrade, "utf8");
    logger.info("API started");

  } catch (err) {

    const initialGrade = {
      nextId: 49,
      grades: [],
    }

    writeFile(global.fileGrade, JSON.stringify(initialGrade)).catch(err => {
      logger.error(err);
    });
  };

});
*/