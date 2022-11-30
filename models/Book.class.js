const { v4: uuidv4 } = require("uuid");

class Book {
  name = "";
  genre = "";
  id = "";
  authorId = "";
  constructor({ name, genre, id, authorId }) {
    this.name = name;
    this.genre = genre;
    this.id = id || uuidv4(10);
    this.authorId = authorId;
  }
}

module.exports = Book;
