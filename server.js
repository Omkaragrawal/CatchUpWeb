'use strict'
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const path = require('path');
const Pool = require('pg').Pool;
const bodyparser = require('body-parser');

//------------------------------------------------------------------------------------------------------
//                    To frequent use constants
//------------------------------------------------------------------------------------------------------

const app = express();
const port = process.env.PORT || 8080;

//------------------------------------------------------------------------------------------------------
//                    For adding functionalities to express
//------------------------------------------------------------------------------------------------------

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(compression());
app.listen(port, () => { console.log(`Our site is hosted on ${port}! If you donot know to open just go to browser and type (localhost:${port})`) });

//------------------------------------------------------------------------------------------------------
//                    For routes
//------------------------------------------------------------------------------------------------------
//--------------------For GET Requests------------------------------------------------------------------

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
