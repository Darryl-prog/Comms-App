class Nav {
  constructor() {
    this.navList = [
      {
        name: 'Group Chat',
        href: './chat.html',
        class: 'nav__item nav__item--group-chat',
        active: window.location.href.search('chat.html') !== -1 ? true : false,
      },
      {
        name: 'Manage Users',
        href: './users-list.html',
        class: 'nav__item nav__item--manage-users',
        active:
          window.location.href.search('users-list.html') !== -1 ||
          window.location.href.search('edit-user.html') !== -1
            ? true
            : false,
      },
      {
        name: 'Manage Documents',
        href: './documents-list.html',
        class: 'nav__item nav__item--manage-documents',
        active:
          window.location.href.search('documents-list.html') !== -1 ||
          window.location.href.search('share.html') !== -1
            ? true
            : false,
      },
      {
        name: 'Logout',
        href: './logout.html',
        class: 'nav__item nav__item--logout',
        active: false,
      },
    ];
    this.init();
  }

  init() {
    this.render();
  }

  createNav() {
    const nav = `
    <nav class="nav">
        <ul class="nav__nav-list">
        ${this.navList
          .map((item) => {
            return `<li class="nav__item ${item.class} ${
              item.active ? 'nav__item--active' : ''
            }">
                    <a href="${item.href}" class="nav__link">${item.name}</a>
                  </li>`;
          })
          .join('')}
        </ul>
        </nav>
    `;
    return nav;
  }

  render() {
    document.body.innerHTML = `
    ${this.createNav()} ${document.body.innerHTML}
    `;
  }
}
