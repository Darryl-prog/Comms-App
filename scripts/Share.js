class Share {
  constructor() {

    this.bindElements();
    this.bindEvents()
    this.init();
  }

  init() {
    this.isLoggedIn();
    this.loadData();
    this.render();
  }

  bindElements() {
    this.fileLabel = document.getElementById('file-label');
    this.selectInput = document.getElementById('select-users');
    this.table = document.getElementById('share-table');
    this.shareForm = document.getElementById('share-form');
    this.delModal = document.getElementById('modal-delete')
    this.closeBtn = document.getElementById('modal-close-btn');
    this.cancelBtn = document.getElementById('modal-cancel-btn');
    this.okBtn = document.getElementById('modal-ok-btn');
  }

  bindEvents() {
    this.shareForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.closeBtn.addEventListener('click', () => this.hideDeleteModal());
    this.cancelBtn.addEventListener('click', () => this.hideDeleteModal());
    this.okBtn.addEventListener('click', () => {
      this.hideDeleteModal();
      this.removeSharedFile();
    });
  }

  loadData() {
    this.urlParams = new URLSearchParams(window.location.search);
    this.id = this.urlParams.get('id');
    this.users = JSON.parse(localStorage.getItem('users'));
    this.currentUser = JSON.parse(localStorage.getItem('loggedIn'));
    this.uploads = JSON.parse(localStorage.getItem('uploads'));
  }

  isLoggedIn() {
    if (!localStorage.getItem('loggedIn')) {
      location.href = './login.html';
    }
  }

  render() {
    this.renderLabel();
    this.renderUsers();
    this.renderSharedUsers();
  }

  renderUsers() {
    const users = this.users.filter((user) => {
      return user.id !== this.currentUser.id;
    });

    this.selectInput.innerHTML = users
      .map((user) => {
        return `<option value="${user.id}">${user.name}</option>`;
      })
      .join('');
  }

  renderLabel() {
    const file = this.uploads.find((file) => {
      return file.id === +this.id;
    });
    this.fileLabel.innerHTML = file.label;
  }

  renderSharedUsers() {
    const tbody = this.table.getElementsByTagName('tbody')[0];
    const tr = tbody.getElementsByTagName('tr');
    const sharedUsers = this.uploads.find((file) => {
      return file.id === +this.id;
    }).sharedUsers;

    if (sharedUsers.length > 0) {
      for (let i = 0; i <= sharedUsers.length - 1; i++) {
        this.table.insertRow();
        tbody.children[i + 1].innerHTML = `
        <td>${this.users.find((user) => {
          return user.id === sharedUsers[i].userId;
        }).name
          }</td>
        <td>
          <button id="remove-btn">Remove</button>
        </td>
        `;

        //Add event listener to remove button
        tr[i + 1].children[1].addEventListener('click', () => {
          this.removeUserId = sharedUsers[i].userId;
          this.showDeleteModal();
        });
      }
    } else {
      tbody.innerHTML = `
        <tr style="text-align:center">
        <td colspan="3">No shared users</td>
        </tr>
        `;
    }
  }

  showDeleteModal() {
    this.delModal.style.opacity = '1';
    this.delModal.style.visibility = 'visible';
    this.delModal.style.zIndex = '20';
  }

  hideDeleteModal() {
    this.delModal.style.opacity = '0';
    this.delModal.style.visibility = 'hidden';
  }

  removeSharedFile() {
    const file = this.uploads.find((file) => {
      return file.id === +this.id;
    });
    const updatedSharedUsers = file.sharedUsers.filter((sharedUser) => {
      return sharedUser.userId !== this.removeUserId;
    });
    const updatedUploads = this.uploads.map((file) => {
      return file.id === +this.id
        ? { ...file, sharedUsers: updatedSharedUsers }
        : file;
    });
    localStorage.setItem('uploads', JSON.stringify(updatedUploads));
    return window.location.reload();
  }

  handleSubmit(e) {
    e.preventDefault();
    const selectedUserId =
      this.selectInput.options[this.selectInput.selectedIndex].value;
    const file = this.uploads.find((file) => file.id === +this.id);

    if (!file.sharedUsers.find((user) => user.userId === +selectedUserId)) {
      const updatedFile = {
        ...file,
        sharedUsers: [...file.sharedUsers, { userId: +selectedUserId }],
      };
      const updatedUploads = this.uploads.map((file) =>
        file.id === updatedFile.id ? updatedFile : file,
      );
      localStorage.setItem('uploads', JSON.stringify(updatedUploads));
      return window.location.reload();
    } else {
      alert('File is already shared with this user');
    }
  }
}
