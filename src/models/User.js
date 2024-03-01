/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.password = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.birthday = null; //Add birthday
    this.creation_date = null; //Add creation date
    Object.assign(this, data);
  }
}

export default User;
