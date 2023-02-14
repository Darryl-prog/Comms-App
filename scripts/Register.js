class Register extends Validator {
  constructor() {
    super();
    this.bindElements();
    this.bindEvents();
    this.init();
  }

  init() {
    this.loadData();
  }

  bindElements() {
    this.password = document.getElementById('password');
    this.confirmPassword = document.getElementById('confirm-password');
    this.registerForm = document.getElementById('register-form');
  }

  bindEvents() {
    this.registerForm.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  loadData() {
    this.users = localStorage.getItem('users')
      ? JSON.parse(localStorage.getItem('users'))
      : [];
  }

  isValidPassword() {
    if (this.password.value.length < 8) {
      alert('Password length must be at least 8 characters');
      return false;
    } else return true;
  }

  handleSubmit(e) {
    e.preventDefault(); //Cancels the default behavior of an event
    if (
      super.isValidFullName() &&
      super.isValidEmail() &&
      this.isValidPassword()
    ) {
      if (this.password.value !== this.confirmPassword.value) {
        return alert('Password do not match');
      } else {
        const newUser = {
          id: Date.now(),
          name: this.fullName.value,
          email: this.email.value,
          password: this.password.value,
        };
        if (this.users.find((user) => user.email === this.email.value)) {
          //find() returns the value of the first element in an array that satisfies a given condition, it returns undefined if no elements are found
          return alert('User already exist');
        }
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return (location.href = './register-success.html');
      }
    }
  }
}
