class Logout {
    constructor() {
        this.logout()
    }

    logout() {
        localStorage.removeItem('loggedIn');
    }
}