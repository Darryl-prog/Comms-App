class Users {
  constructor() {
    this.bindElements();
    this.bindEvents();
    this.init();
  }

  init() {
    this.isLoggedIn();
    this.loadData();
    this.renderUsers();
  }

  bindElements() {
    this.table = document.getElementById('users-list-table');
    this.deleteModal = document.getElementById('modal-delete');
    this.closeBtn = document.getElementById('modal-close-button');
    this.cancelBtn = document.getElementById('modal-cancel-button');
    this.okBtn = document.getElementById('modal-ok-button');
  }

  bindEvents() {
    this.closeBtn.addEventListener('click', () => this.hideDeleteModal());
    this.cancelBtn.addEventListener('click', () => this.hideDeleteModal());
    this.okBtn.addEventListener('click', () => {
      this.hideDeleteModal();
      this.deleteUser();
      return;
    });
  }

  loadData() {
    this.users = JSON.parse(localStorage.getItem('users'));
    this.currentUser = JSON.parse(localStorage.getItem('loggedIn'));
    this.chats = JSON.parse(localStorage.getItem('chats'));
    this.uploads = JSON.parse(localStorage.getItem('uploads'));
  }

  // Redirect back to login page, if there's no logged in user.
  isLoggedIn() {
    if (!localStorage.getItem('loggedIn')) {
      location.href = './login.html';
    }
  }

  renderUsers() {
    const tbody = this.table.getElementsByTagName('tbody')[0];
    const tr = tbody.getElementsByTagName('tr');
    for (let i = 0; i <= this.users.length - 1; i++) {
      this.table.insertRow();
      tbody.children[i + 1].innerHTML = `
          <td>${this.users[i].name}</td>
          <td>${this.users[i].email}</td>
          ${this.currentUser.email === this.users[i].email
          ? `<td>
                    <button>Edit</button>
                </td>`
          : `<td>
                    <button>Edit</button>
                    <span>|</span>
                    <button>Delete</button>
                </td>`
        }
        `;
      //Add event listener to each edit button to redirect to edit-user.html
      tr[i + 1].children[2].children[0].addEventListener('click', () => {
        return (location.href = `./edit-user.html?id=${this.users[i].id}`);
      });
      //Add event listener to each delete button to show delete modal
      tr[i + 1].children[2].children[2]
        ? tr[i + 1].children[2].children[2].addEventListener('click', () => {
          this.delUserId = this.users[i].id;
          this.showDeleteModal();
        })
        : '';
    }
  }

  showDeleteModal() {
    this.deleteModal.style.opacity = '1';
    this.deleteModal.style.visibility = 'visible';
  }

  hideDeleteModal() {
    this.deleteModal.style.opacity = '0';
    this.deleteModal.style.visibility = 'hidden';
  }

  deleteUser() {
    //Remove the deleted user from users localstorage
    const updatedUsers = this.users.filter((user) => {
      return user.id !== this.delUserId;
    });
    //Delete chats of the deleted user
    const updatedChats = this.chats.filter((chat) => {
      return chat.userId !== this.delUserId;
    });
    //Delete the uploaded file of the deleted user
    const updatedUploads = this.uploads.filter((file) => {
      return file.userId !== this.delUserId;
    });
    //Remove the deleted user from shared user of files.
    const uploadsFinal = updatedUploads.map((file) => {
      let updatedSharedUsers = file.sharedUsers.filter((sharedUser) => {
        return sharedUser.userId !== this.delUserId;
      });
      return { ...file, sharedUsers: updatedSharedUsers };
    });
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    localStorage.setItem('uploads', JSON.stringify(uploadsFinal));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return window.location.reload();
  }
}
