import * as datastore from './datastore'
export { 
    getAllUsers, 
    getNumUsers, 
    findUserByEmail, 
    removeOldestUser 
} from './datastore'

// Init user data type
datastore.setUserType(datastore.UserType.API_KEY)

function getDateToday() {
    return new Date().toISOString().split('T')[0]
}

function createNewUser(apiKey: String, email: String, host: String) {
    return {
        id: datastore.getRandomUserId(),
        api_key: apiKey,
        email: email,
        host: host,
        usages: [{ date: getDateToday(), count: 0 }]
    }
}

export function findUser(apiKey: String, host: String) {
    return datastore.getAllUsers()
        .find((u) => u.api_key === apiKey && u.host === host)
}

export function addUser(apiKey: String, email: String, host: String) {
    const user = createNewUser(apiKey, email, host)
    return datastore.addUser(user)
}

export function getNumUsagesToday(apiKey: String, host: String) {
    const usages = findUser(apiKey, host).usages
    return usages.find((u) => u.date === getDateToday()).count
}

export function incrementNumUsagesToday(apiKey: String, host: String) {
    const dateToday = getDateToday()
    const user = findUser(apiKey, host)

    // User not found
    if (!user)
        return

    // First entry of the day
    const usageIndex = user.usages.findIndex((u) => u.date === dateToday)
    if (usageIndex == -1) {
        user.usages.push({ date: dateToday, count: 1 })
        return
    }

    // Update the existing usage entry
    return ++ user.usages[usageIndex].count
}
