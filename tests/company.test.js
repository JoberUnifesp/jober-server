const request = require("supertest")
const app = require("../server")

const companyAlreadyRegistered = {
    "nome": "Unifesp",
    "email": "unifesp@unifesp.br",
    "senha": "Unifesp",
    "cnpj": "12.345.678/0001-91",
    "telefone": "+5512911112222"
}

const companyExample = {
    "nome": "Example",
    "email": "example@company.br",
    "senha": "example",
    "cnpj": "13.333.444/0001-55",
    "telefone": "+5512911112222"
}

const companyProfileExample = {
    "endereco": "Avenida Brasil, 123",
    "contato": "1192222-3333",
    "descricao": "Uma empresa de tecnologia focada no aprendizado e com ideal de mudar a educação no Brasil"
}

const validId = 24
const invalidId = 1000

describe('Register a Company', () => {
    it('should return success when company is registered', async () => {
       const res = await request(app).post("/company/SignUp").send(companyExample)
       expect(res.statusCode).toEqual(200)
       expect(res.body).toHaveProperty('message')
       expect(res.body.message).toEqual('company registered sucessfully')
    })

    it('should return error when try to register a company with an email that is already registered', async () => {
        const res = await request(app).post("/company/SignUp").send(companyAlreadyRegistered)
        expect(res.statusCode).toEqual(409)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('email already registered')
     })

     it('should return error when try to register a company with cnpj that is already registered', async () => {
        companyAlreadyRegistered.email = "unifesp@email.br"
        const res = await request(app).post("/company/SignUp").send(companyAlreadyRegistered)
        expect(res.statusCode).toEqual(409)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('cnpj already registered')
     })
})

describe('Get Company Info', () => {
   it('should return all companies registered', async () => {
       const res = await request(app).get("/company")
       expect(res.statusCode).toEqual(200)
    })

    it('should get a company successfully', async () => {
       const res = await request(app).get("/company/4")
       expect(res.statusCode).toEqual(200)
    })

    it('should return error when try to get a company with invalid id', async () => {
       const res = await request(app).get("/company/:invalidId")
       expect(res.statusCode).toEqual(404)
       expect(res.body).toHaveProperty('message')
       expect(res.body.message).toEqual('company not founded')
    })
})

describe('Update Company Info', () => {
   it('should update name and email from company with success', async() => {
      await request(app).post("/company/SignUp").send(companyExample)
      const res = await request(app).patch("/company/updateNameAndEmail/4").send(companyExample)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('company info updated sucessfully')
   })
   
   it('should get an error when try to update name and email from inexisted company', async() => {
      const res = await request(app).patch('/company/updateNameAndEmail/:invalidId').send(companyExample)
      expect(res.statusCode).toEqual(404)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('company id not found')
   })
   
   it('should set info to company profile with success', async () => {
      const res = await request(app).patch('/company/profile/24').send(companyProfileExample)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('company profile updated sucessfully')
   })
   
   it('should get 404 error when try to set info to company profile from a company that does not existed', async () => {
      const res = await request(app).patch('/company/profile/:invalidId').send(companyProfileExample)
      expect(res.statusCode).toEqual(404)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('company id not found')
   })
})
