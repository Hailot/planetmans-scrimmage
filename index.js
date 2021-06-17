require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


const defaultRoutes = require("./routes")();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger_output.json');

app.use("/api", defaultRoutes);
app.get('/', (req, res) => res.send('Hello World!'));

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

app.listen(port, () => console.log(`Example app listening on port ${port}!`));