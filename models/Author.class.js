const { v4: uuidv4 } = require("uuid");

class Author {
  name = "";
  age = 0;
  id = "";

  constructor({ name, age, id }) {
    this.name = name;
    this.age = age;
    this.id = id || uuidv4(10);
    //console.log(this.id);
  }
}

module.exports = Author;
