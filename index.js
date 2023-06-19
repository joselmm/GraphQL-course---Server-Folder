const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 65247;
const cors = require("cors");

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: false,
  })
);

app.listen(PORT, () => {
  console.log("Now listening on port " + PORT);
});
