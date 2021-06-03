const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mogoose = require('mongoose');
const app = express();

const apiRoutes = require("./src/modules/routes/routes");

app.use(cors());

const url = 'mongodb+srv://EgorRestAPI:Nokiaversia228@cluster0.qnjrd.mongodb.net/consumptionDB?retryWrites=true&w=majority';
mogoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.json());
app.use("/", apiRoutes);

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});