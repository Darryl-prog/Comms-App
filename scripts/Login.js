class Login extends Validator {
  //Initializes the instance by calling these methods below.
  constructor() {
    super();
    this.bindElements();
    this.bindEvents();
    this.init();
  }

  init() {
    this.isLoggedIn();
    this.loadData();
  }

  bindElements() {
    this.password = document.getElementById('password');
    this.loginForm = document.getElementById('login-form');
  }

  bindEvents() {
    this.loginForm.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  loadData() {
    this.users = JSON.parse(localStorage.getItem('users'));
  }

  isLoggedIn() {
    if (JSON.parse(localStorage.getItem('loggedIn'))) {
      return (location.href = './login-success.html');
    }
  }

  isValidPassword() {
    return this.password.value.length >= 8;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (super.isValidEmail()) {
      if (this.isValidPassword()) {
        //Find if the user exists on the users localstorage
        const user = this.users.find(
          (user) =>
            user.email === this.email.value &&
            user.password === this.password.value,
        );
        //If it exist, create a loggedIn localstorage with the users credential, then redirect to login-success page.
        if (user) {
          localStorage.setItem(
            'loggedIn',
            JSON.stringify({ id: user.id, name: user.name, email: user.email }),
          );
          return (location.href = './login-success.html');
        }
        alert('Invalid email or password');
      } else return alert('Invalid email or password');
    }
  }
}
