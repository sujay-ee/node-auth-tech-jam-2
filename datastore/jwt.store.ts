import { UserType, DataStore } from './datastore'

enum UserRole {
    ADMIN,
    STANDARD,
    MAINTENANCE
}

export class JwtStore extends DataStore {

    constructor() {
        super(UserType.JWT)
    }

    createNewUser(email: String, password: String, role: UserRole) {
        return {
            id: this.getRandomUserId(),
            email: email,
            password: password,
            role: UserRole[role]
        }
    }

    addUser(email: String, password: String, role: UserRole) {
        const user = this.createNewUser(email, password, role)
        return super.addUserToDb(user)
    }
}
