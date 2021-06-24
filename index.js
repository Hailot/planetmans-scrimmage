require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;
const connectToMongoDB = require("./database/mongo");

// Connect to MongoDB
//connectToMongoDB();


// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger_output.json');

//app.use("/api/auth", require("./routes/api/auth"));
const defaultRoutes = require("./routes")();

app.use("/api", defaultRoutes);
app.get('/', (req, res) => res.send('Hello World!'));

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

app.listen(port, () => console.log(`Example app listening on port ${port}!`));