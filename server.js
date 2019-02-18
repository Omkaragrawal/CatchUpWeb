'use strict'
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const path = require('path');
const axios = require('axios')
const bodyParser = require('body-parser');

//------------------------------------------------------------------------------------------------------
//                    To frequent use constants
//------------------------------------------------------------------------------------------------------

const app = express();
const port = process.env.PORT || 8080;

//------------------------------------------------------------------------------------------------------
//                    For adding functionalities to express
//------------------------------------------------------------------------------------------------------

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.text({type: "text/xml"}));
app.use(express.static(path.join(__dirname, 'assets')));
// app.use(compression());
app.listen(port, () => { console.log(`Our site is hosted on ${port}! If you donot know to open just go to browser and type (localhost:${port})`) });

//------------------------------------------------------------------------------------------------------
//                    For routes
//------------------------------------------------------------------------------------------------------
//--------------------For GET Requests------------------------------------------------------------------

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'catchup.png'))
})

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.js'))
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/hackernews', (req, res) => {
    axios.get("https://hnrss.org/newest.jsonfeed", {responseType: 'json'})
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`)
            res.status(500).send(err)
        })
})

app.get('/hackerearth', (req, res) => {
    axios.get("http://engineering.hackerearth.com/atom.xml", {responseType: 'document'})
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`)
            res.status(500).send(err)
        })
})
