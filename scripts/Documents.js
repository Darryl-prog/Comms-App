class Documents {
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
    this.table = document.getElementById('documents-list-table');
    this.sharedUploadsTable = document.getElementById('shared-uploads-table');
    this.delModal = document.getElementById('modal-delete');
    this.editModal = document.getElementById('documents-list-modal-edit');
    this.uploadModal = document.getElementById('documents-list-modal-upload');
    this.delModalCloseBtn = document.getElementById('delete-modal-closeBtn');
    this.delModalCancelBtn = document.getElementById('delete-modal-cancelBtn');
    this.delModalOkBtn = document.getElementById('delete-modal-OkBtn');
    this.editInput = document.getElementById('modal-edit-label');
    this.editModalCloseBtn = document.getElementById('edit-modal-closeBtn');
    this.editModalCancelBtn = document.getElementById('modal-edit-cancelBtn');
    this.editModalSaveBtn = document.getElementById('modal-edit-saveBtn');
    this.uploadBtn = document.getElementById('documents-list-uploadBtn');
    this.uploadModalCloseBtn = document.getElementById('upload-modal-closeBtn');
    this.uploadModalCancelBtn = document.getElementById(
      'modal-upload-cancelBtn',
    );
    this.uploadModalOkBtn = document.getElementById('modal-upload-okBtn');
  }

  bindEvents() {
    this.delModalCloseBtn.addEventListener('click', () =>
      this.hideModal('delete'),
    );
    this.delModalCancelBtn.addEventListener('click', () =>
      this.hideModal('delete'),
    );
    this.delModalOkBtn.addEventListener('click', () => {
      this.hideModal('delete');
      this.deleteFile();
    });
    this.editModalCloseBtn.addEventListener('click', () =>
      this.hideModal('edit'),
    );
    this.editModalCancelBtn.addEventListener('click', () =>
      this.hideModal('edit'),
    );
    this.editModalSaveBtn.addEventListener('click', () => {
      this.hideModal('edit');
      this.editLabel();
    });
    this.uploadBtn.addEventListener('click', () => this.showModal('upload'));
    this.uploadModalCloseBtn.addEventListener('click', () =>
      this.hideModal('upload'),
    );
    this.uploadModalCancelBtn.addEventListener('click', () =>
      this.hideModal('upload'),
    );
    this.uploadModalOkBtn.addEventListener('click', () => {
      this.hideModal('upload');
      this.uploadFile();
    });
  }

  loadData() {
    this.uploads = localStorage.getItem('uploads')
      ? JSON.parse(localStorage.getItem('uploads'))
      : [];
    this.users = JSON.parse(localStorage.getItem('users'));
    this.currentUser = JSON.parse(localStorage.getItem('loggedIn'));
  }

  isLoggedIn() {
    if (!localStorage.getItem('loggedIn')) {
      location.href = './login.html';
    }
  }

  render() {
    this.renderUploads();
    this.renderSharedFiles();
  }

  renderUploads() {
    const tbody = this.table.getElementsByTagName('tbody')[0];
    const tr = tbody.getElementsByTagName('tr');
    const currentUser = JSON.parse(localStorage.getItem('loggedIn'));
    const myUploads = this.uploads.filter((file) => {
      return file.userId === currentUser.id;
    });

    if (myUploads.length > 0) {
      for (let i = 0; i <= myUploads.length - 1; i++) {
        this.table.insertRow();
        tbody.children[i + 1].innerHTML = `
           <td>${myUploads[i].label}</td>
           <td>${myUploads[i].fileName}</td>
           <td>
              <button>Edit</button>
              <span>|</span>
              <button>Delete</button>
              <span>|</span>
              <button>Share</button>
           </td>
         `;

        //Add event listener to edit modal
        tr[i + 1].children[2].children[0].addEventListener('click', () => {
          this.editFileId = myUploads[i].id;
          this.showModal('edit');
        });

        //Add event listener to delete modal
        tr[i + 1].children[2].children[2].addEventListener('click', () => {
          this.delFileId = myUploads[i].id;
          this.showModal('delete');
        });

        //Add event listener to share button
        tr[i + 1].children[2].children[4].addEventListener('click', () => {
          return (location.href = `./share.html?id=${myUploads[i].id}`);
        });
      }
    } else {
      tbody.innerHTML = `
        <tr style="text-align:center">
        <td colspan="3">No file uploaded</td>
        </tr>
        `;
    }
  }

  renderSharedFiles() {
    const tbody = this.sharedUploadsTable.getElementsByTagName('tbody')[0];
    const sharedFiles = this.uploads.filter((file) =>
      file.sharedUsers.some( // checks if any array elements pass a test 
        (sharedUser) => sharedUser.userId === this.currentUser.id,
      ),
    );

    if (sharedFiles.length > 0) {
      for (let i = 0; i <= sharedFiles.length - 1; i++) {
        this.sharedUploadsTable.insertRow();
        tbody.children[i + 1].innerHTML = `
        <td>${sharedFiles[i].label}</td>
        <td>${sharedFiles[i].fileName}</td>
        <td>${this.users.find((user) => {
          return user.id === sharedFiles[i].userId;
        }).email
          }</td>
      `;
      }
      tbody.innerHTML += `
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    `;
    } else {
      tbody.innerHTML = `
      <tr style="text-align:center">
      <td colspan="3">No shared file from other users</td>
      </tr>
      <tr style="text-align:center">
      <td colspan="3">&nbsp;</td>
      </tr>
    `;
    }
  }

  hideModal(type) {
    if (type === 'delete') {
      this.delModal.style.opacity = '0';
      this.delModal.style.visibility = 'hidden';
    } else if (type === 'edit') {
      this.editModal.style.opacity = 0;
      this.editModal.style.visibility = 'hidden';
    } else {
      this.uploadModal.style.opacity = 0;
      this.uploadModal.style.visibility = 'hidden';
    }
  }

  showModal(type) {
    if (type === 'delete') {
      this.delModal.style.opacity = '1';
      this.delModal.style.visibility = 'visible';
    } else if (type === 'edit') {
      const file = this.uploads.find((file) => {
        return file.id === this.editFileId;
      });
      this.editInput.value = file.label;
      this.editModal.style.opacity = 1;
      this.editModal.style.visibility = 'visible';
    } else {
      this.uploadModal.style.opacity = '1';
      this.uploadModal.style.visibility = 'visible';
    }
  }

  deleteFile() {
    const updatedUploads = this.uploads.filter((file) => {
      return file.id !== this.delFileId;
    });
    localStorage.setItem('uploads', JSON.stringify(updatedUploads));
    return window.location.reload();
  }

  editLabel() {
    if (!this.editInput.value || !this.editInput.value.trim()) {
      alert('Uploaded file must have label');
      this.showModal('edit');
      return;
    }
    const updatedUploads = this.uploads.map((file) => {
      return file.id === this.editFileId
        ? { ...file, label: this.editInput.value }
        : file;
    });
    localStorage.setItem('uploads', JSON.stringify(updatedUploads));
    return window.location.reload();
  }

  uploadFile() {
    const inputFile = document.getElementById('file');
    const inputLabel = document.getElementById('modal-upload-label');
    const label = inputLabel.value;
    const fileName = inputFile.value.slice(
      inputFile.value.lastIndexOf('\\') + 1,
    );

    const newFile = {
      id: Date.now(),
      userId: this.currentUser.id,
      label,
      fileName,
      sharedUsers: [],
    };

    if (!label || !label.trim() || !fileName) {
      alert('Input fields are required');
      this.showModal('upload');
      return;
    } else {
      this.uploads.push(newFile);
      localStorage.setItem('uploads', JSON.stringify(this.uploads));
      return window.location.reload();
    }
  }
}
