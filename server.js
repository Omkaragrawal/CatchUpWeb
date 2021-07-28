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
if (process.env.NODE_ENV == "production") {
    app.set('trust proxy', 1);
}
app.use(morgan('combined'));
app.use(helmet({
    contentSecurityPolicy: false,
}));

app.use(bodyParser.json());
app.use(bodyParser.text({
    type: "text/xml"
}));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(compression('BROTLI_MODE_TEXT'));
app.listen(port, () => {
    console.log(`Our site is hosted on ${port}! If you donot know to open just go to browser and type (localhost:${port})`);
});

//------------------------------------------------------------------------------------------------------
//                    For routes
//------------------------------------------------------------------------------------------------------
//--------------------For GET Requests------------------------------------------------------------------

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'catchup.png'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(['/hackernews', 'hackernews/', 'hackernews/new'], (req, res) => {
    if (req.params.q) {
        axios.get(`https://hnrss.org/newest.jsonfeed?q=${req.params.q}&count=50`, {
                params: {
                    q: req.params.q
                },
                responseType: 'json'
            })
            .then(resp => {
                res.send(resp.data);
            })
            .catch(err => {
                console.log(`\n\n ${err} \n\n`);
                res.status(500).send(err);
            });
        return;
    }
    axios.get("https://hnrss.org/newest.jsonfeed", {
            responseType: 'json'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/hackernews/top', (req, res) => {
    axios.get("https://hacker-news.firebaseio.com/v0/topstories.json", {
            responseType: 'json'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/hackernews/best', (req, res) => {
    axios.get("https://hacker-news.firebaseio.com/v0/beststories.json", {
            responseType: 'json'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/hackernews/jobs', (req, res) => {
    if (req.params.q) {
        axios.get(`https://hnrss.org/jobs.jsonfeed??q=${req.params.q}&count=50`, {
                params: {
                    q: req.params.q
                },
                responseType: 'json'
            })
            .then(resp => {
                res.send(resp.data);
            })
            .catch(err => {
                console.log(`\n\n ${err} \n\n`);
                res.status(500).send(err);
            });
        return;
    }
    axios.get("https://hacker-news.firebaseio.com/v0/jobstories.json", {
            responseType: 'json'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/hackernews/launches', (req, res) => {
    axios.get("https://hnrss.org/launches.jsonfeed", {
            responseType: 'json'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/hackerearth', (req, res) => {
    axios.get("http://engineering.hackerearth.com/atom.xml", {
            responseType: 'document'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get(['/slashdot', 'slashdot/main'], (req, res) => {
    axios.get("http://rss.slashdot.org/Slashdot/slashdotMain", {
            responseType: 'document'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/slashdot/games', (req, res) => {
    axios.get("http://rss.slashdot.org/Slashdot/slashdotGames", {
            responseType: 'document'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/slashdot/politics', (req, res) => {
    axios.get("http://rss.slashdot.org/Slashdot/slashdotPolitics", {
            responseType: 'document'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/slashdot/linux', (req, res) => {
    axios.get("http://rss.slashdot.org/Slashdot/slashdotLinux", {
            responseType: 'document'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/slashdot/developers', (req, res) => {
    axios.get("http://rss.slashdot.org/Slashdot/slashdotDevelopers", {
            responseType: 'document'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get(['/devTo', '/devTo/latest'], (req, res) => {
    if (req.query) {
        let queries = '?state=fresh&';
        if (req.query.page) {
            queries += `q=${req.query.page}&`;
        }
        if (req.query.per_page) {
            queries += `per_page=${req.query.per_page}&`;
        } else {
            queries += `per_page=50&`;
        }
        if (req.query.tags) {
            queries += `tags=${req.query.tags}`;
        }
        if (queries.endsWith('?')) {
            queries = queries.substring(0, queries.length - 1);
        }
        axios.get("https://dev.to/api/articles" + queries, {
                responseType: 'json'
            })
            .then(resp => {
                res.send(resp.data);
            })
            .catch(err => {
                console.log(`\n\n ${err} \n\n`);
                res.status(500).send(err);
            });
        return;
    }
    axios.get("https://dev.to/api/articles?state=fresh&per_page=50", {
            responseType: 'json'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get('/devTo/trending', (req, res) => {
    if (req.query) {
        let queries = '?state=rising&';
        if (req.query.page) {
            queries += `q=${req.query.page}&`;
        }
        if (req.query.per_page) {
            queries += `per_page=${req.query.per_page}&`;
        } else {
            queries += `per_page=50&`;
        }
        if (req.query.tags) {
            queries += `tags=${req.query.tags}`;
        }
        if (queries.endsWith('?')) {
            queries = queries.substring(0, queries.length - 1);
        }
        axios.get("https://dev.to/api/articles" + queries, {
                responseType: 'json'
            })
            .then(resp => {
                res.send(resp.data);
            })
            .catch(err => {
                console.log(`\n\n ${err} \n\n`);
                res.status(500).send(err);
            });
        return;
    }
    axios.get("https://dev.to/api/articles?state=rising&per_page=50", {
            responseType: 'json'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});

app.get(['/devTo/top', '/devTo/top/:days'], (req, res) => {
    if (req.query) {
        let queries = '?';
        if (req.query.page) {
            queries += `page=${req.query.page}&`;
        }
        if (req.query.per_page) {
            queries += `per_page=${req.query.per_page}&`;
        } else {
            queries += `per_page=50&`;
        }
        if (req.query.tags) {
            queries += `tags=${req.query.tags}&`;
        }
        if (req.params.days) {
            queries += `top=${req.params.days}`;
        } else {
            queries += `top=7`;
        }

        if (queries.endsWith('?')) {
            queries = queries.substring(0, queries.length - 1);
        }
        console.log(req.query ,queries);
        axios.get("https://dev.to/api/articles" + queries, {
                responseType: 'json'
            })
            .then(resp => {
                res.send(resp.data);
            })
            .catch(err => {
                console.log(`\n\n ${err} \n\n`);
                res.status(500).send(err);
            });
        return;
    }
    if (req.params.days) {
        axios.get("https://dev.to/api/articles?per_page=50&top=" + req.params.days, {
                responseType: 'json'
            })
            .then(resp => {
                res.send(resp.data);
            })
            .catch(err => {
                console.log(`\n\n ${err} \n\n`);
                res.status(500).send(err);
            });
        return;
    }
    axios.get("https://dev.to/api/articles?per_page=50&top=7", {
            responseType: 'json'
        })
        .then(resp => {
            res.send(resp.data);
        })
        .catch(err => {
            console.log(`\n\n ${err} \n\n`);
            res.status(500).send(err);
        });
});