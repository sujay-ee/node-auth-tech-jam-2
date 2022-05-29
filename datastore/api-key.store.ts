import { StatusCodes } from 'shared/statuscodes'
import { UserType, DataStore } from './datastore'

export class ApiKeyStore extends DataStore {

    constructor() {
        super(UserType.API_KEY)
    }

    getDateToday() {
        return new Date().toISOString().split('T')[0]
    }

    createNewUser(apiKey: String, email: String, host: String) {
        return {
            id: super.getRandomUserId(),
            api_key: apiKey,
            email: email,
            host: host,
            usages: [{ date: this.getDateToday(), count: 0 }]
        }
    }

    findUser(apiKey: String, host: String) {
        return super.getAllUsers()
            .find((u) => u.api_key === apiKey && u.host === host)
    }

    addUser(apiKey: String, email: String, host: String) {
        const user = this.createNewUser(apiKey, email, host)
        return super.addUserToDb(user)
    }

    getNumUsagesToday(apiKey: String, host: String) {
        const usages = this.findUser(apiKey, host).usages
        return usages.find((u) => u.date === this.getDateToday()).count
    }

    incrementNumUsagesToday(apiKey: String, host: String) {
        const dateToday = this.getDateToday()
        const user = this.findUser(apiKey, host)

        // User not found
        if (!user)
            return StatusCodes.USER_NOT_REGISTERED

        // First entry of the day
        const usageIndex = user.usages.findIndex((u) => u.date === dateToday)
        if (usageIndex == -1) {
            user.usages.push({ date: dateToday, count: 1 })
            return StatusCodes.SUCCESS
        }

        // Update the existing usage entry, then return it
        user.usages[usageIndex].count ++
        return StatusCodes.SUCCESS
    }

}

