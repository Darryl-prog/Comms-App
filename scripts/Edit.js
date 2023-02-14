class Edit extends Validator {
  constructor() {
    super();
    this.bindElements();
    this.bindEvents();
    this.init();
  }

  init() {
    this.isLoggedIn();
    this.loadData();
    this.renderValues();
  }

  bindElements() {
    this.editForm = document.getElementById('edit-user-form');
  }

  bindEvents() {
    this.editForm.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  loadData() {
    this.urlParams = new URLSearchParams(window.location.search);
    this.id = this.urlParams.get('id');
    this.users = JSON.parse(localStorage.getItem('users'));
    this.user = this.users.filter((user) => user.id === +this.id);
    this.currentUser = JSON.parse(localStorage.getItem('loggedIn'));
    console.log(this.currentUser)
  }

  // Redirect back to login page, if there's no logged in user.
  isLoggedIn() {
    if (!localStorage.getItem('loggedIn')) {
      // Hide the content of the page while the user is being redirected
      document.body.style.display = 'none';
      location.href = './login.html';
    }
  }

  renderValues() {
    this.fullName.value = this.user[0].name;
    this.email.value = this.user[0].email;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!super.isValidFullName() || !super.isValidEmail()) return;
    if (
      this.email.value === this.user[0].email || //Opt the user to not edit his/her email address.
      !this.users.find((user) => user.email === this.email.value) // Check if the email already exist
    ) {
      //Map over each user in the users localstorage then check if the id of the current user is equal to the extracted id on the url, if it returns true returns the edited user obj, if not return the user without modification.
      const updatedUsers = this.users.map((user) => {
        return user.id === +this.id
          ? { ...user, name: this.fullName.value, email: this.email.value }
          : user;
      });
      //If the current user modifies its own credentials, update it in the loggedin localstorage.
      if (this.currentUser.id === +this.id) {
        localStorage.setItem(
          'loggedIn',
          JSON.stringify({
            id: +this.id,
            name: this.fullName.value,
            email: this.email.value,
          }),
        );
      }
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return (location.href = './users-list.html');
    } else {
      alert('User with this email already exists');
    }
  }
}
