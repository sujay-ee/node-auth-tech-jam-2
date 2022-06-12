import { UserType, DataStore } from "./datastore"

export class JwtStore extends DataStore {
    constructor() {
        super(UserType.JWT)
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
