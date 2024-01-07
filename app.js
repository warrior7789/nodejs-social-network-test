require('express-group-routes');
const express     = require('express');
global.app = express();
global.secretkeypassword = "thisissecretekeyforaplication";
const mongoose    = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi   = require('swagger-ui-express');

const cors = require('cors');
const fileUpload  = require('express-fileupload');
const bodyParser  = require('body-parser');   
var path        = require('path');
require("dotenv").config();
const apiRoutes = require('./routes/api'); // Import the route file

//app.use(cors()); 
app.use(fileUpload()); 

// Middleware to parse JSON requests
app.use(express.json());

app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(__dirname +'/public'));  

const PORT = process.env.PORT || 80;
global.siteTitle = "Test";
global.SiteName = "Test";


mongoose.connect('mongodb://localhost:27017/social_media_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'Social Networking ',
      version: '1.0.0',
      description: 'API documentation',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Change it to your actual token format
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Add an empty array to indicate Bearer token
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    //console.log(req);
    let isAjaxRequest = req.xhr;
    console.log(isAjaxRequest)
    if(isAjaxRequest)
        res.json({"message": "Welcome to "+SiteName});

    res.json({"message": "Welcome to "+SiteName});
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
