class HeroUser {
  _user;

  static _users = {
    Batman: { name: 'Batman', avatar: 'batman' },
    BlackWidow: { name: 'Black Widow', avatar: 'black-widow' },
    CaptainAmerika: { name: 'Captain Amerika', avatar: 'captain-amerika' },
    Hawkeye: { name: 'Hawkeye', avatar: 'hawkeye' },
    Hulk: { name: 'Hulk', avatar: 'hulk' },
    IronMan: { name: 'Iron Man', avatar: 'iron-man' },
    Spiderman: { name: 'Spiderman', avatar: 'spiderman' },
    Superman: { name: 'Superman', avatar: 'superman' },
    Thor: { name: 'Thor', avatar: 'thor' }
  };

  constructor(id) {
    this._user = HeroUser._users[id];
  }

  get name() {
    return this._user.name;
  }

  get avatar() {
    return this._user.avatar;
  }

  get avatarSrc() {
    return `https://github.com/Ne4istb/smartians-html-css/raw/master/assets/users/${
      this.avatar
    }.jpg`;
  }

  static getRandomUserId() {
    const ids = Object.keys(this._users);
    const randomIndex = Math.floor(Math.random() * ids.length);
    return ids[randomIndex];
  }
}
