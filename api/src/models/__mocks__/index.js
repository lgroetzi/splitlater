// @flow

class Knex {
  fakeUser: ?Object;

  constructor() {
    this.fakeUser = null;
  }

  async insert(u: Object): Promise<void> {
    this.setMockUser(u);
  }

  async where(): Promise<Array<Object>> {
    return new Promise((r) => r(this.fakeUser ? [this.fakeUser] : []));
  }

  setMockUser(u: Object) {
    this.fakeUser = u;
  }
}

const knex = new Knex();

export default () => knex;
