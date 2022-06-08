import * as DateUtils from "../shared/date-utils"
import * as Configs from "../shared/configs"

export const mockApiKeyUsers = [
    {
        id: "l3g7tq51",
        api_key: "c0bd2ba0-5f40-4f95-9dbf-3f8b58177927",
        email: "user1@email.com",
        host: "http://127.0.0.1:5500",
        usages: [
            { date: DateUtils.getDateToday(), count: 0 },
        ],
    },
    {
        id: "l3gdtqw4",
        api_key: "d0bd2ba0-5f40-4f95-9dbf-3f8b58187928",
        email: "user2@email.com",
        host: "http://127.0.0.1:5501",
        usages: [
            {
                date: DateUtils.getDateToday(),
                count: Configs.MAX_REQUESTS_PER_DAY,
            },
        ],
    },
]
export const mockBasicAuthUsers = [
    {
        id: "l3g7tq51",
        email: "user1@email.com",
        password:
            "$2b$10$ZZKXH3s1j305Df1kuJgZC.tCpwCVDRTGH0pRmQMb2Vs0NdHWsyFZG",
    },
    {
        id: "l3l7tq54",
        email: "user2@email.com",
        password:
            "$2b$10$ZZKXH3s1j305Df1kuJgZC.tCpwCVDRTGH0pRmQMb2Vs0NdHWsyFZG",
    },
]
export const jwtUsers = []
