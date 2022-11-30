const graphql = require("graphql");
const _ = require("lodash");
const {
  getCollection,
  getById,
  deleteById,
  updateById,
  addToCollection,
} = require("../models/db.actions.js");
const {
  GraphQLList,
  GraphQLInt,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLNonNull,
} = graphql;

const Author = require("../models/Author.class.js");
const Book = require("../models/Book.class.js");
const { all } = require("express/lib/application");

/* 
// dummy data
var books = [
  { name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },
  { name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2" },
  { name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "3" },
  { name: "The Hero of Ages", genre: "Fantasy", id: "4", authorId: "2" },
  { name: "The Colour of Magic", genre: "Fantasy", id: "5", authorId: "3" },
  { name: "The Light Fantastic", genre: "Fantasy", id: "6", authorId: "3" },
];

var authors = [
  { name: "Patrick Rothfuss", age: 44, id: "1" },
  { name: "Brandon Sanderson", age: 42, id: "2" },
  { name: "Terry Pratchett", age: 66, id: "3" },
]; */

const BookType = new GraphQLObjectType({
  name: "Book",
  /**
   * las fields se envuelven en funciones,
   * porque dicho codigo solo se ejecutará hasta que todo
   * el codigo haya sido compilado, eso evita
   * En resumen, envolver los campos en una función
   * permite definir tipos con campos que dependen
   * de otros tipos que aún no han sido definidos.
   */
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      async resolve(parent, args) {
        //return _.find(authors, { id: parent.authorId });
        const author = await getById("/authors", parent.authorId);
        return author;
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        /* return _.filter(books, { authorId: parent.id }); */
        const allBooks = await getCollection("/books");
        console.log(allBooks, args.id);
        const authorBooks = allBooks.filter(
          (book) => book.authorId === parent.id
        );
        return authorBooks;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      async resolve(parent, args) {
        // code to get data from db / other source
        /**
         * in this code just gets an object
         */
        /* return _.find(books, { id: args.id }); */
        const book = await getById("/books", args.id);
        return book;
      },
    },
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      async resolve(parent, args) {
        // code to get data from db / other source
        /* return _.find(authors, { id: args.id }); */
        const author = await getById("/authors", args.id);
        return author;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        const books = await getCollection("/books");
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args) {
        const authors = await getCollection("/authors");
        return authors;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        const author = new Author({
          name: args.name,
          age: args.age,
          id: args.id,
        });
        const res = await addToCollection("/authors", author);
        return res;
      },
    },
    addBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        const book = new Book({
          id: args.id,
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        const res = addToCollection("/books", book);
        return res;
      },
    },
    deleteBook: {
      type: BookType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(parent, args) {
        await deleteById("/books", args.id);
      },
    },
    deleteAuthor: {
      type: AuthorType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(parent, args) {
        await deleteById("/authors", args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
