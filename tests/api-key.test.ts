import supertest from "supertest"
import { createServer } from "../app"
import { apiKeyUsers as users } from "../shared/data"
import { mockApiKeyUsers } from "./mock-data"

describe("POST /register", () => {
    var app: Express.Application
    var numUsers = 0

    const url = "/apikey/register"

    beforeAll(() => {
        users.length = 0
        users.push(...mockApiKeyUsers)
        app = createServer()
        numUsers = users.length
    })

    test("homepage", async () => {
        await supertest(app).get("/apikey").expect(200)
    })

    it("fails when email field is missing or empty", async () => {
        // Email missing
        await supertest(app)
            .post(url)
            .send({})
            .expect("Content-Type", /json/)
            .expect(400)
        // Email empty
        await supertest(app)
            .post(url)
            .send({ email: "" })
            .expect("Content-Type", /json/)
            .expect(400)
    })

    it("fails if the email already exists", async () => {
        await supertest(app)
            .post(url)
            .send(mockApiKeyUsers[0])
            .expect("Content-Type", /json/)
            .expect(409)
        expect(users.length).toEqual(numUsers)
    })

    it("creates a new user when data is valid", async () => {
        await supertest(app)
            .post(url)
            .send({
                email: "asdf@test.com",
            })
            .expect("Content-Type", /json/)
            .expect(201)

        // Ensure the user is added to list
        expect(users.length).toEqual(numUsers + 1)
    })
})

describe("GET /protected", () => {
    var app: Express.Application
    var numUsers = 0

    const url = "/apikey/protected"

    beforeAll(() => {
        users.length = 0
        users.push(...mockApiKeyUsers)
        app = createServer()
        numUsers = users.length
    })

    it("fails when api-key is missing or empty", async () => {
        // Key not found
        await supertest(app).get(url).expect(400)
        await supertest(app).get(url).set({}).expect(400)
        // Value empty
        await supertest(app)
            .get(url)
            .set({
                "x-api-key": "",
            })
            .expect(400)
    })

    it("fails if the api-key is invalid", async () => {
        // Api key format bad
        await supertest(app)
            .get(url)
            .set({
                "x-api-key": "asdf",
                Host: mockApiKeyUsers[1].host,
            })
            .expect(401)
        // api-key - host mismatch
        await supertest(app)
            .get(url)
            .set({
                "x-api-key": mockApiKeyUsers[0].api_key,
                Host: mockApiKeyUsers[1].host,
            })
            .expect(401)
    })

    it("fails due to max requests exceeded", async () => {
        await supertest(app)
            .get(url)
            .set({
                "x-api-key": mockApiKeyUsers[1].api_key,
                Host: mockApiKeyUsers[1].host,
            })
            .expect(429)
    })

    it("succeeds when api-key and host are valid", async () => {
        await supertest(app)
            .get(url)
            .set({
                "x-api-key": mockApiKeyUsers[0].api_key,
                Host: mockApiKeyUsers[0].host,
            })
            .expect(200)
    })
})
