import { UserType, DataStore } from "./datastore"

export class BasicAuthStore extends DataStore {
    constructor() {
        super(UserType.BASIC_AUTH)
    }

    getRandomUserId() {
        return Date.now().toString(36)
    }

    createNewUser(email: String, password: String) {
        return {
            id: this.getRandomUserId(),
            email: email,
            password: password,
        }
    }

    addUser(email: String, password: String) {
        const user = this.createNewUser(email, password)
        return super.addUserToDb(user)
    }
}
