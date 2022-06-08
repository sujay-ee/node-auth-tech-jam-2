import {
    apiKeyUsers,
    basicAuthUsers,
    jwtUsers,
} from "../shared/data"

const MAX_NUM_REGISTERED_USERS = 10

export enum UserType {
    API_KEY,
    BASIC_AUTH,
    JWT,
}

export class DataStore {
    users: Array<any>

    constructor(userType: UserType) {
        switch (+userType) {
            case UserType.API_KEY:
                this.users = apiKeyUsers
                break
            case UserType.BASIC_AUTH:
                this.users = basicAuthUsers
                break
            case UserType.JWT:
                this.users = jwtUsers
                break
        }
    }

    getRandomUserId() {
        return Date.now().toString(36)
    }

    getAllUsers() {
        return this.users
    }

    getNumUsers() {
        return this.users.length
    }

    findUserByEmail(email: String) {
        return this.users.find((u) => u.email === email)
    }

    addUserToDb(user: Object) {
        this.users.push(user)
        return user
    }

    removeOldestUser() {
        // .shift() removes the leftmost item
        this.users.shift()
    }

    isUserListFull() {
        return (
            this.getNumUsers() >= MAX_NUM_REGISTERED_USERS
        )
    }
}
