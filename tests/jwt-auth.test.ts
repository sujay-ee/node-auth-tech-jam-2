import supertest from "supertest"
import { createServer } from "../app"
import { jwtUsers as users } from "../shared/data"
import { mockJwtUsers } from "./mock-data"

describe("POST /register", () => {
    var app: Express.Application
    var numUsers = 0

    const url = "/jwt/register"

    beforeAll(() => {
        users.length = 0
        users.push(...mockJwtUsers)
        app = createServer()
        numUsers = users.length
    })

    it("fails when email or password are empty or missing", async () => {
        await supertest(app)
            .post(url)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400)
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

    it("fails it the email already exists", async () => {
        await supertest(app)
            .post(url)
            .send({
                email: mockJwtUsers[0].email,
                password: "abcd",
            })
            .expect("Content-Type", /json/)
            .expect(409)
    })

    it("create a new user when the data is valid", async () => {
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

describe("POST /signin", () => {
    var app: Express.Application
    var numUsers = 0

    const url = "/jwt/signin"

    beforeAll(() => {
        users.length = 0
        users.push(...mockJwtUsers)
        app = createServer()
        numUsers = users.length
    })

    it("fails if email or password is empty of missing", async () => {
        await supertest(app)
            .post(url)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400)
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

    it("fails when the email of the user is not found", async () => {
        await supertest(app)
            .post(url)
            .send({
                email: "someuser@mail.com",
                password: "abcd",
            })
            .expect("Content-Type", /json/)
            .expect(400)
    })

    it("fails when email-password combination is wrong", async () => {
        await supertest(app)
            .post(url)
            .send({
                email: mockJwtUsers[0].email,
                password: "wrongpassword",
            })
            .expect("Content-Type", /json/)
            .expect(401)
    })

    it("sign-in successful when user data is valid", async () => {
        await supertest(app)
            .post(url)
            .send({
                email: mockJwtUsers[0].email,
                password: "abcd",
            })
            .expect("Content-Type", /json/)
            .expect(200)
    })
})

describe("GET /protected", () => {
    var app: Express.Application
    var numUsers = 0

    const url = "/jwt/protected"

    beforeAll(() => {
        users.length = 0
        users.push(...mockJwtUsers)
        app = createServer()
        numUsers = users.length
    })

    it("fails when the input token is missing or empty", async () => {
        await supertest(app)
            .get(url)
            .set({})
            .expect("Content-Type", /json/)
            .expect(400)
        await supertest(app)
            .get(url)
            .set({
                Authorization: "",
            })
            .expect("Content-Type", /json/)
            .expect(400)
    })

    it("fails when the jwt token is bad", async () => {
        await supertest(app)
            .get(url)
            .set({
                Authorization:
                    "Bearer eyJhbGciOiJ.IUzI1NiIsInR.5cCI6IkpXVCJ9",
            })
            .expect("Content-Type", /json/)
            .expect(401)
    })
})
