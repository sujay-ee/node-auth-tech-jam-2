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
export const basicAuthUsers = []
export const jwtUsers = []
