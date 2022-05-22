import * as datastore from './datastore'
export { 
    getAllUsers, 
    getNumUsers, 
    findUserByEmail, 
    removeOldestUser 
} from './datastore'

// Init user data type
datastore.setUserType(datastore.UserType.BASIC_AUTH)

function getRandomUserId() {
    return Date.now().toString(36)
}

function createNewUser(email: String, password: String) {
    return {
        id: getRandomUserId(),
        email: email,
        password: password
    }
}

export function addUser(email: String, password: String) {
    const user = createNewUser(email, password)
    return datastore.addUser(user)
}
