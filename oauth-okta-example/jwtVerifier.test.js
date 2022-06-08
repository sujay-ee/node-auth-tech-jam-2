const mockVerifyFn = jest.fn()
jest.mock("@okta/jwt-verifier", () => {
    return jest.fn().mockImplementation(() => {
        return {
            verifyAccessToken: mockVerifyFn
        }
    });
});

const jwtVerifier = require("./jwtVerifier");

const mockRequest = {
    headers: {
        authorization: "Bearer some-token"
    }
}

const mockStatusSend = jest.fn().mockReturnValue({ send: jest.fn()})
const mockResponse = {
    status: mockStatusSend
}
const mockNext = jest.fn()
const now = new Date()
const nowTime = now.getTime()

describe("#jwtVerifier", () => {
    const env = process.env

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(now)
        jest.resetModules();
        process.env = { ...env }
    })

    afterEach(() => {
        jest.useRealTimers();
        process.env = env
    })

    describe("unauthorized", () => {
        test(`should return unauthorized if the token does not have the right scope`, async () => {
            mockVerifyFn.mockReturnValue({
                claims: {
                    scp: ['other-scope']
                }
            })

            await jwtVerifier(mockRequest, mockResponse, mockNext)

            expect(mockStatusSend).toHaveBeenCalledWith(401)
        });

        test(`should return unauthorized if the token has expired`, async () => {
            const oneSecondBefore = new Date(nowTime - 1).getTime()
            mockVerifyFn.mockReturnValue({
                claims: {
                    scp: ['api']
                },
                exp: oneSecondBefore
            })

            await jwtVerifier(mockRequest, mockResponse, mockNext)

            expect(mockStatusSend).toHaveBeenCalledWith(401)
        });

        test(`should return unauthorized if the client id does not match`, async () => {
            process.env.OKTA_CLIENT_ID = "wrong-client-id"
            mockVerifyFn.mockReturnValue({
                claims: {
                    scp: ['api']
                },
                cid: "other-client-id"
            })

            await jwtVerifier(mockRequest, mockResponse, mockNext)

            expect(mockStatusSend).toHaveBeenCalledWith(401)
        });
    })

    describe("authorized", () => {
        test(`should NOT return unauthorized if the token has "api" scope`, async () => {
            mockVerifyFn.mockReturnValue({
                claims: {
                    scp: ['api']
                }
            })

            await jwtVerifier(mockRequest, mockResponse, mockNext)

            expect(mockStatusSend).not.toHaveBeenCalledWith(401)
        });

        test(`should NOT return unauthorized if the token has "v1" scope`, async () => {
            mockVerifyFn.mockReturnValue({
                claims: {
                    scp: ['v1']
                }
            })

            await jwtVerifier(mockRequest, mockResponse, mockNext)

            expect(mockStatusSend).not.toHaveBeenCalledWith(401)
        });
    })

});