import supertest from "supertest"
import { createServer } from "../app"
import { basicAuthUsers as users } from "../shared/data"
import { mockBasicAuthUsers } from "./mock-data"

describe("POST /register", () => {
    var app: Express.Application
    var numUsers = 0

    const url = "/basicauth/register"

    beforeAll(() => {
        users.length = 0
        users.push(...mockBasicAuthUsers)
        app = createServer()
        numUsers = users.length
    })

    it("fails when email or password are missing or empty", async () => {
        // Data missing
        await supertest(app)
            .post(url)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400)
        // Data empty
        await supertest(app)
            .post(url)
            .send({
                email: "",
                password: "abcd",
            })
            .expect("Content-Type", /json/)
            .expect(400)
        await supertest(app)
            .post(url)
            .send({
                email: "test@mail.com",
                password: "",
            })
            .expect("Content-Type", /json/)
            .expect(400)
    })

    it("fails if email already exists", async () => {
        await supertest(app)
            .post(url)
            .send(mockBasicAuthUsers[0])
            .expect("Content-Type", /json/)
            .expect(409)
        expect(users.length).toEqual(numUsers)
    })

    it("create a new user when data is valid", async () => {
        await supertest(app)
            .post(url)
            .send({
                email: "asdf@test.com",
                password: "abcd",
            })
            .expect("Content-Type", /json/)
            .expect(201)
        expect(users.length).toEqual(numUsers + 1)
    })
})

describe("GET /protected", () => {
    var app: Express.Application
    var numUsers = 0

    const url = "/basicauth/protected"

    beforeAll(() => {
        users.length = 0
        users.push(...mockBasicAuthUsers)
        app = createServer()
        numUsers = users.length
    })

    it("fails when input data is missing or empty", async () => {
        // Body empty
        await supertest(app).get(url).expect(400)
        await supertest(app).get(url).send({}).expect(400)
        await supertest(app)
            .get(url)
            .send({ email: "" })
            .expect(400)
        await supertest(app)
            .get(url)
            .send({ password: "" })
            .expect(400)
    })

    it("fails if the user isn't registered", async () => {
        await supertest(app)
            .get(url)
            .send({
                email: "asdf@test.com",
                password: "abcd",
            })
            .expect(400)
    })

    it("fails if the there's a email-password mismatch", async () => {
        await supertest(app)
            .get(url)
            .send({
                email: mockBasicAuthUsers[0].email,
                password: "not-password",
            })
            .expect(401)
    })

    it("succeeds when email-password are valid", async () => {
        await supertest(app)
            .get(url)
            .send({
                email: mockBasicAuthUsers[0].email,
                password: "abcd",
            })
            .expect(200)
    })
})