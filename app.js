const express = require("express");
const cors = require("cors");
const mogoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const apiRoutes = require("./src/modules/routes/routes");

app.use(cors());

const uri = process.env.URI;
mogoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(express.json());
app.use("/", apiRoutes);

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
