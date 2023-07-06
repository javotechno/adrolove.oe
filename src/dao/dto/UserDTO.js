export default class UserDTO {
    constructor(user) {
        this.id = user.passport.user
        this.email = user.email
        this.role = user.role
    }
}