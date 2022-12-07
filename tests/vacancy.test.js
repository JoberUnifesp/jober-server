const request = require("supertest")
const app = require("../server")

const validId = 1
const invalidId = 10000
const savedId = 39

const vacancyInvalidCompany = {
  "idCompany": 1000,
  "cargo": "Engenheiro de Software - Júnior",
  "area": "Tecnologia",
  "softSkill1": "Liderança",
  "softSkill2": "Proatividade",
  "softSkill3": "Colaboração",
  "tempoExperiencia": 36,
  "idioma": "Inglês",
  "idiomaNivel": "Intermediário",
  "cidade": "Híbrido - São Paulo",
  "hardSkill1Desc": "Java",
  "hardSkill1Nivel": "Avançado",
  "hardSkill2Desc": "HTML/CSS",
  "hardSkill2Nivel": "Avançado",
	"hardSkill3Desc": "Git",
  "hardSkill3Nivel": "Intermediário"
}

const vacancyExample = {
  "idCompany": 15,
  "cargo": "Engenheiro de Software - Júnior",
  "area": "Tecnologia",
  "softSkill1": "Liderança",
  "softSkill2": "Proatividade",
  "softSkill3": "Colaboração",
  "tempoExperiencia": 36,
  "idioma": "Inglês",
  "idiomaNivel": "Intermediário",
  "cidade": "Híbrido - São Paulo",
  "hardSkill1Desc": "Java",
  "hardSkill1Nivel": "Avançado",
  "hardSkill2Desc": "HTML/CSS",
  "hardSkill2Nivel": "Avançado",
  "hardSkill3Desc": "Git",
  "hardSkill3Nivel": "Intermediário"
}

describe('Register a Vacancy', () => {
    it('should return success when a vacancy is registered', async () => {
       const res = await request(app).post("/vacancy/").send(vacancyExample)
       expect(res.statusCode).toEqual(200)
       expect(res.body).toHaveProperty('message')
       expect(res.body.message).toEqual('vacancy registered sucessfully')
    })

    it('should return error when try to register a vacancy with invalid company', async () => {
        const res = await request(app).post("/vacancy/").send(vacancyInvalidCompany)
        expect(res.statusCode).toEqual(404)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('not found company')
     })
})

describe('Get Info from a Vacancy', () => {
    it('should return info from a vacancy with success', async () => {
       const res = await request(app).get("/vacancy/oneVacancy/:validId")
       expect(res.statusCode).toEqual(200)
    })

    it('should return error when try to get info from a vacancy with invalid id', async () => {
        const res = await request(app).get("/vacancy/oneVacancy/1000")
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Vacancy not founded. Invalid ID')
     })
})

describe('Edit a Vacancy', () => {
    it('should return success when try to edit a vacancy', async () => {
        vacancyExample.cargo = "Engenheiro de Software - Pleno"
        const res = await request(app).patch("/vacancy/:savedId").send(vacancyExample)
       expect(res.statusCode).toEqual(200)
    })

    it('should return error when try to edit info from a vacancy with invalid id', async () => {
        const res = await request(app).patch("/vacancy/:invalidId").send(vacancyExample)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Fail to Edit: Vacancy not founded')
     })
})

describe('Delete a Vacancy', () => {
    it('should return success when try to delete a vacancy', async () => {
        const res = await request(app).delete("/vacancy/:savedId")
       expect(res.statusCode).toEqual(200)
    })

    it('should return error when try to edit info from a vacancy with invalid id', async () => {
        const res = await request(app).delete("/vacancy/:invaliId")
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Vacancy not founded')
     })
})

