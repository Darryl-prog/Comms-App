class Chat {
  constructor() {
    this.bindElements();
    this.bindEvents();
    this.init();
  }

  init() {
    this.isLoggedIn();
    this.loadData();
    this.render();
  }

  bindElements() {
    this.chatbox = document.getElementById('chat-box-main');
    this.chatInput = document.getElementById('chat-input');
    this.chatForm = document.getElementById('chat-box-form');
    this.refreshBtn = document.getElementById('refresh-button');
  }

  bindEvents() {
    this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.refreshBtn.addEventListener('click', () => window.location.reload());
  }

  loadData() {
    this.chats = localStorage.getItem('chats')
      ? JSON.parse(localStorage.getItem('chats'))
      : [];
    this.users = JSON.parse(localStorage.getItem('users'));
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
  }

  // Redirect back to login page, if there's no logged in user.
  isLoggedIn() {
    if (!localStorage.getItem('loggedIn')) {
      // Hide the content of the page while the user is being redirected
      document.body.style.display = 'none';
      location.href = './login.html';
    }
  }

  render() {
    this.renderChats();
    this.renderUser();
  }

  renderChats() {
    this.chatbox.innerHTML = this.chats
      .map((chat) => {
        //Find the owner(user) of chat
        const user = this.users.find((user) => user.id === chat.userId);
        return `
        <div class="chat-box__message">
            <p>[${chat.date}] ${user.name}: ${chat.message}</p>
        </div>`;
      }).join('');
  }

  renderUser() {
    document.getElementById('chat-user').innerHTML = this.loggedInUser.name;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.chatInput.value || !this.chatInput.value.trim()) {
      alert('Please say something!');
      return;
    }
    const newChat = {
      id: Date.now(),
      userId: this.loggedInUser.id,
      date:
        `${new Date().getFullYear()}-` +
        `${(new Date().getMonth() + 1).toString().padStart(2, '0')}-` +
        `${new Date().getDate().toString().padStart(2, '0')} ` +
        `${new Date().getHours().toString().padStart(2, '0')}:` +
        `${new Date().getMinutes().toString().padStart(2, '0')}:` +
        `${new Date().getSeconds().toString().padStart(2, '0')}`,
      message: this.chatInput.value,
    };
    this.chats.push(newChat);
    localStorage.setItem('chats', JSON.stringify(this.chats));
    return window.location.reload();
  }
}
