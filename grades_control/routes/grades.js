import express from "express";
import { promises } from "fs";
import winston from "winston";

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

/*endpoint para inserir novo aluno*/
router.post("/", async (req, res) => {

  let grade = req.body;

  try {
    let data = await readFile(global.fileGrade, "utf8")
    let json = JSON.parse(data)

    grade = { id: json.nextId++, ...grade }
    json.grades.push(grade)

    await writeFile(global.fileGrade, JSON.stringify(json))

    res.send(grade);
    logger.info(`POST /grade -${JSON.stringify(grade)}`);

  } catch (err) {
    res.status(400).send({ error: err.message })
    logger.error(`POST /grade - ${err.message}`)
  };

});

/*endpoint para atualizar alguma infomação do aluno*/
router.put("/", async (req, res) => {

  try {
    let updateStudent = req.body;
    let data = await readFile(global.fileGrade, "utf8");
    let json = JSON.parse(data);

    if (json.grades.find(Grade => Grade.id === updateStudent.id)) {

      let oldIndex = json.grades.findIndex(grade => grade.id === updateStudent.id);
      json.grades[oldIndex].student = updateStudent.student
      json.grades[oldIndex].subject = updateStudent.subject
      json.grades[oldIndex].type = updateStudent.type
      json.grades[oldIndex].value = updateStudent.value

      await writeFile(global.fileGrade, JSON.stringify(json))

      res.send(updateStudent)
      logger.info(`PUT /grade - ${JSON.stringify(updateStudent)}`);

    } else {
      throw new Error("Identificador desconhecido")
    };

  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT /grade - ${err.message}`)
  };

});

/* endpoint para excluir alguma grade específica */
router.delete("/:id", async (req, res) => {

  try {
    let data = await readFile(global.fileGrade, "utf8");
    let json = JSON.parse(data);

    if (json.grades.find(grade => grade.id === parseInt(req.params.id, 10))) {

      let records = json.grades.filter(Grade => Grade.id !== parseInt(req.params.id, 10))
      json.grades = records

      await writeFile(global.fileGrade, JSON.stringify(json))
      res.send("Registro deletado com sucesso")
      logger.info(`DELETE /grade/:id - ${req.params.id}`);

    } else {
      throw new Error("Identificador não encontrado")
    };

  } catch (err) {
    res.status(400).send({ error: err.message })
    logger.error(`DELETE /grade/:id - ${err.message}`)
  };

});

/* endpoint para pesquisar um grade específico */
router.get("/:id", async (req, res) => {

  try {
    let data = await readFile(global.fileGrade, "utf8");
    let json = JSON.parse(data);
    const foundStudent = json.grades.find(index => index.id === parseInt(req.params.id, 10));

    if (foundStudent) {
      res.send(foundStudent)
      logger.info(`GET /grade/:id - ${JSON.stringify(foundStudent)}`)

    } else {
      throw new Error("Aluno não encontrado. Verifique o id.")
    };

  } catch (err) {
    res.status(400).send({ error: err.message })
    logger.error(`GET /grade/:id - ${err.message}`)
  };

});

/* endpoint para pesquisar nota total de um aluno*/

router.get("/:student/:subject", async (req, res) => {

  try {
    let data = await readFile(global.fileGrade, "utf8");
    let json = JSON.parse(data);

    if (json.grades.find(grade => grade.student === req.params.student && grade.subject === req.params.subject)) {
      let records = json.grades.filter((Grade => Grade.student === req.params.student && Grade.subject === req.params.subject))

      json.grades = records

      let sumGrade = json.grades.reduce((accumulator, current) => {
        return accumulator + current.value
      }, 0)
      //json.grades = sumGrade
      //res.sendStatus(sumGrade)
      res.send(records)

      logger.info(`GET /grade:student/:subject - Nota total do aluno ${req.params.student} na disciplina ${req.params.subject} = ${JSON.stringify(sumGrade)} pontos`);

    } else {
      throw new Error("Aluno ou disciplina não encontrado")
    };

  } catch (err) {
    res.status(400).send({ error: err.message })
    logger.error(`GET /grade/:student/:subject - ${err.message}`)
  };

});


/* endpoint para pesquisar média das notas */
router.get("/:subject/:type/:media", async (req, res) => {

  try {
    let data = await readFile(global.fileGrade, "utf8");
    let json = JSON.parse(data);

    if (json.grades.find(grade => grade.subject === req.params.subject && grade.type === req.params.type)) {
      let records = json.grades.filter(Grade => Grade.subject === req.params.subject && Grade.type === req.params.type)

      json.grades = records

      let avgGrade = json.grades.reduce((accumulator, current) => {
        return accumulator + current.value / records.length
      }, 0);

      //json.grades = avgGrade
      //res.sendStatus(avgGrade)
      res.send(records)
      logger.info(`GET /grade/:subject/:type/:media - A média das notas na disciplina ${req.params.subject} = ${avgGrade} pontos`);

    } else {
      throw new Error("Disciplina ou tipo de avaliação não encontrado")
    };

  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grade/:subject/:type/:media - ${err.message}`)
  };

});


/* endpoint para ordenar do maior para menor somente os 3 primeiros */
router.get("/:subject/:type/:destaques/:2020", async (req, res) => {

  try {
    let data = await readFile(global.fileGrade, "utf8");
    let json = JSON.parse(data);

    if (json.grades.find(grade => grade.subject === req.params.subject && grade.type === req.params.type)) {
      let records = json.grades.filter(Grade => Grade.subject === req.params.subject && Grade.type === req.params.type).sort((a, b) => {
        return b.value - a.value
      }).slice(this.length, 3)

      json.grades = records
      res.send(records);
      logger.info(`GET /grade/:subject/:type/:destaques/:2020 - As três maiores notas na disciplina ${req.params.subject} : ${JSON.stringify(records)}`)

    } else {
      throw new Error("Disciplina ou tipo de avaliação não encontrado")
    };

  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /grade/:subject/:type/:destaques/:2020 - ${err.message}`)
  };

});

export default router;