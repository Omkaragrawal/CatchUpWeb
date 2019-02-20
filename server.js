"use strict";

const express = require('express');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

//------------------------------------------------------------------------------------------------------
//                    To frequent use constants
//------------------------------------------------------------------------------------------------------

const app = express();
const port = process.env.PORT || 8080;

//------------------------------------------------------------------------------------------------------
//                    For adding functionalities to express
//------------------------------------------------------------------------------------------------------

app.use(morgan('combined'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.text({type: "text/xml"}));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(compression('BROTLI_MODE_TEXT'));
app.listen(port, () => {console.log(`Our site is hosted on ${port}! If you donot know to open just go to browser and type (localhost:${port})`);
});

//------------------------------------------------------------------------------------------------------
//                    For routes
//------------------------------------------------------------------------------------------------------
//--------------------For GET Requests------------------------------------------------------------------

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets','catchup.png'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.min.html'));
});

app.get('/hackernews', (req, res) => {
    axios.get("https://hnrss.org/newest.jsonfeed", {responseType: 'json'})
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/hackernewsTop', (req, res) => {
    axios.get("https://hacker-news.firebaseio.com/v0/topstories.json", {responseType: 'json'})
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/hackerearth', (req, res) => {
    axios.get("http://engineering.hackerearth.com/atom.xml", {responseType: 'document'})
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});
