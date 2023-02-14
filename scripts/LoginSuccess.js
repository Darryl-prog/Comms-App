class LoginSuccess {
  constructor() {
    this.bindElement();
    this.init();
  }

  init() {
    this.isLoggedIn();
    this.loadData();
    this.renderMessage();
  }

  bindElement() {
    this.loginMessage = document.getElementById('welcome-text');
  }

  loadData() {
    this.currentUser = JSON.parse(localStorage.getItem('loggedIn'));
  }

  isLoggedIn() {
    if (!localStorage.getItem('loggedIn')) {
      // Hide the content of the page while the user is being redirected
      document.body.style.display = 'none';
      location.href = './login.html';
    }
  }

  renderMessage() {
    this.loginMessage.innerHTML = `
    \n      <b>Welcome</b> <b>!</b> ${this.currentUser.email}\n    
    `;
  }
}
