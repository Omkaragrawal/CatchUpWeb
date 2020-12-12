'use strict';

const contentHn = document.getElementById('contentHn'),
    postBtn = document.getElementById('posts');
let rowData = '';

document.getElementById('nextBtn').addEventListener('click', () => {
    // event.preventDefault();
    let hash = window.location.hash.split('#');
    hash[2] = Number(hash[2]) + 1 || 1;
    console.log(hash.join('#'));
    window.location.hash = hash.join('#');

});

document.getElementById('prev').onclick = () => {
    let hash = window.location.hash.split('#');
    hash[2] = Number(hash[2]) - 1 || 0;
    if (hash[2] < 0) hash[2] = 0;
    console.log(hash.join('#'));
    window.location.hash = hash.join('#');
}
window.onload = () => {
    if (!window.location.hash) {
        loadData('hackernews');
        document.location.hash = '#hackernews';
    } else {
        loadData(window.location.hash.split('#')[1]);
    }
};
window.onhashchange = param => loadData(param.newURL.split('#')[1]);

// function subMenu(element) {
//     console.log(element);
// }



function loadData(channel) {
    document.getElementById('nextBtn').hidden = true;
    document.getElementById('prev').hidden = true;
    document.getElementById('loading').hidden = false;
    postBtn.hidden = true;
    contentHn.hidden = true;
    contentHn.innerHTML = "";
    switch (channel) {
        case 'hackernews':
            axios.get('https://corsenabled.herokuapp.com/get?to=https://hnrss.org/newest.jsonfeed', {
                    responseType: 'json'
                })
                .then(response => {
                    postBtn.hidden = true;
                    // console.log(response.data.items);
                    toHnTable(response.data.items);
                })
                .catch(err => {
                    document.getElementById('loading').hidden = true;
                    contentHn.hidden = false;
                    console.log(err);
                });
            break;
        case "hackernewsTop":
            postBtn.hidden = true;

            // console.log("hackernewsTOP");
            axios.get('https://hacker-news.firebaseio.com/v0/topstories.json', {
                    responseType: 'json'
                })
                .then(response => {
                    postBtn.hidden = true;
                    // console.log(response.data.items);
                    toHnlTable(response.data);
                })
                .catch(err => {
                    document.getElementById('loading').hidden = true;
                    contentHn.hidden = false;
                    console.log(err);
                });
            postBtn.hidden = false;
            break;
        case 'slashdot':
            if (!!!parser) {
                let elem = document.createElement('script');
                elem.src = "https://cdnjs.cloudflare.com/ajax/libs/fast-xml-parser/3.17.1/parser.min.js";
                elem.integrity = "sha256-rdj1KYq6fdIXKQYjbgUE1PNiqpFoSGJlrT7AlPBae/c=";
                elem.crossOrigin = "anonymous";
                document.body.appendChild(elem);

                // let elem1 = document.createElement('script');
                // elem1.src = "https://cdnjs.cloudflare.com/ajax/libs/Clamp.js/0.5.1/clamp.min.js";
                // elem1.integrity = "sha256-rdj1KYq6fdIXKQYjbgUE1PNiqpFoSGJlrT7AlPBae/c=";
                // elem1.crossOrigin = "anonymous";
                // document.body.appendChild(elem1);
            }
            axios.get('https://corsenabled.herokuapp.com/get?to=http://rss.slashdot.org/Slashdot/slashdotMain')
                .then(feed => parser.parse(feed.data)["rdf:RDF"].item)
                .then(items => {
                    toSlashdotTable(items);
                })
                .catch(err => {
                    alert(err);
                });
            break;
        case 'hackerearth':
            if (!!!parser) {
                let elem = document.createElement('script');
                elem.src = "https://cdnjs.cloudflare.com/ajax/libs/fast-xml-parser/3.17.1/parser.min.js";
                elem.integrity = "sha256-rdj1KYq6fdIXKQYjbgUE1PNiqpFoSGJlrT7AlPBae/c=";
                elem.crossOrigin = "anonymous";
                document.body.appendChild(elem);

                // let elem1 = document.createElement('script');
                // elem1.src = "https://cdnjs.cloudflare.com/ajax/libs/Clamp.js/0.5.1/clamp.min.js";
                // elem1.integrity = "sha256-rdj1KYq6fdIXKQYjbgUE1PNiqpFoSGJlrT7AlPBae/c=";
                // elem1.crossOrigin = "anonymous";
                // document.body.appendChild(elem1);
            }
            axios.get('https://engineering.hackerearth.com/atom.xml')
                .then(feed => parser.parse(feed.data).feed.entry)
                .then(items => {
                    toHackerearthTable(items);
                })
                .catch(err => {
                    alert(err);
                });
            break;
        default:
            console.log("default:  " + channel);
            window.location.hash = '#hackernews';
    }
}

function toHnTable(data) {
    // console.log("\n\n" + typeof (data) + data + "\n\n")
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        // console.log(data[i] + "\n")
        contentHn.innerHTML += '<tr><td colspan="2"><p>' + data[i].content_html.replace(' URL', "").replace(/">.*\s<.*\s.*\s.*/g, `" target="_blank" rel="noreferrer noopener" > ${data[i].title}`) + '</a></div><div>Author: ' + data[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPublished on: ' + new Date(data[i].date_published).toLocaleString('en-GB', {
            timeZoneName: 'short',
            hc: 'h24',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) + '</div></p></tdcolspan></tr>';
    }
    postBtn.hidden = false;
    contentHn.hidden = false;
    document.getElementById('loading').hidden = true;
}

function toHnlTable(data) {
    // postBtn.hidden = true;
    // contentHn.hidden = true;
    console.log(data.length + "\n" + data);
    let start = 0 + (Number(window.location.hash.split('#')[2]) || 0);
    if (start >= 1) start *= 10;
    // let end = 10 + (Number(window.location.hash.split('#')[2]) || 1);
    let end = 10 + start;

    console.log("start ", start, " end ", end);
    let data1 = data.slice(start, end);
    let getData = async () => {
        let postData = data1.map(id => {
            return `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
        }).map(url => axios.get(url, {
            responseType: 'json'
        }));
        try {
            return Promise.resolve((await Promise.all(postData)).map(res => res.data));
        } catch (err) {
            console.error(err);
            return Promise.reject(new Error(rowData));
        }
    };
    getData().then(res => {
            rowData = res.map(row => {
                return (`<tr>
        <td colspan="2">
        <p><a href ="${row.url}" target="_blank" rel="noreferrer noopener"> ${row.title}</a>
        </div>
        <div>Author:  ${row.by} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
        Published on: ${new Date(row.time*1000).toLocaleString('en-GB',{
            timeZoneName : 'short',
            hc     : 'h24',
            day    : 'numeric',
            month  : 'long',
            year   : 'numeric',
            hour   : '2-digit',
            minute : '2-digit',
            second : '2-digit'
        })} 
        </div></p>
        </td>
        </tr>`);
            });
        }).catch(err => console.log(".catch => ERR:\t" + err))
        .finally(() => {
            console.log(rowData.length);
            postBtn.hidden = true;
            document.getElementById('nextBtn').hidden = false;
            document.getElementById('prev').hidden = false;
            for (let element of rowData) {
                contentHn.innerHTML += element;
            }
            postBtn.hidden = false;
            contentHn.hidden = false;
            document.getElementById('loading').hidden = true;
        });
    // for (let i = 0; i < 10; i++) {
    //     postBtn.hidden = true;
    //     contentHn.innerHTML = '';
    //     axios.get('https://hacker-news.firebaseio.com/v0/item/' + data[i] + '.json', {
    //             responseType: 'json'
    //         })
    //         .then(response => {
    //             console.log(response.data);
    //             postData.push(response.data);
    // contentHn.hidden = true;
    //             contentHn.innerHTML += `<tr>
    //                                     <td colspan="2">
    //                                     <p><a href ="${response.data.url}"trget="_blank" rel="noopener"> ${response.data.title}</a>
    //                                     </div>
    //                                     <div>Author:  ${response.data.by} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
    //                                     Published on: ${new Date(response.data.time).toLocaleString('en-GB',{
    //                                                                                                         timeZoneName : 'short',
    //                                                                                                         hc     : 'h24',
    //                                                                                                         day    : 'numeric',
    //                                                                                                         month  : 'long',
    //                                                                                                         year   : 'numeric',
    //                                                                                                         hour   : '2-digit',
    //                                                                                                         minute : '2-digit',
    //                                                                                                         second : '2-digit'
    //                                                                                                      })} 
    //                                         </div></p>
    //                                         </td>
    //                                         </tr>`;
    // contentHn.hidden = false;
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }
    //console.log(postData);
    // let urlArray = data.map(i => axios.get('https://hacker-news.firebaseio.com/v0/item/' + i + '.json',{ responseType: 'json' }));
    // console.log(urlArray);
}

function toSlashdotTable(blogList) {
    blogList.forEach(data => {
        let contents = `<tr>
        <td colspan="2">
        <p><a href ="${data.link}" target="_blank" rel="noreferrer noopener"> ${data.title}</a>
        </div>
        <div>Author:  ${data["dc:creator"]} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
        Published on: ${new Date(data["dc:date"]).toLocaleString('en-GB',{
            timeZoneName : 'short',
            hc     : 'h24',
            day    : 'numeric',
            month  : 'long',
            year   : 'numeric',
            hour   : '2-digit',
            minute : '2-digit',
            second : '2-digit'
        })} 
        </div></p>
        </td>
        </tr>`;
        contentHn.innerHTML += contents;
    });
    contentHn.hidden = false;
    document.getElementById('loading').hidden = true;
    console.log(blogList);
}

function toHackerearthTable(data) {
    // postBtn.hidden = true;
    // contentHn.hidden = true;
    console.log(data.length + "\n" + data);
    let start = 0 + (Number(window.location.hash.split('#')[2]) || 1);
    // let end = 10 + (Number(window.location.hash.split('#')[2]) || 1);
    let end = 10 + start;
    console.log("start ", start, " end ", end);
    let data1 = data.slice(start, end);
    let getData = async () => {
        let postData = data1.map(id => {
            return `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
        }).map(url => axios.get(url, {
            responseType: 'json'
        }));
        try {
            return Promise.resolve((await Promise.all(postData)).map(res => res.data));
        } catch (err) {
            console.error(err);
            return Promise.reject(new Error(rowData));
        }
    };
    getData().then(res => {
            rowData = res.map(row => {
                return (`<tr>
        <td colspan="2">
        <p><a href ="${row.url}" target="_blank" rel="noreferrer noopener"> ${row.title}</a>
        </div>
        <div>Author:  ${row.by} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
        Published on: ${new Date(row.time*1000).toLocaleString('en-GB',{
            timeZoneName : 'short',
            hc     : 'h24',
            day    : 'numeric',
            month  : 'long',
            year   : 'numeric',
            hour   : '2-digit',
            minute : '2-digit',
            second : '2-digit'
        })} 
        </div></p>
        </td>
        </tr>`);
            });
        }).catch(err => console.log(".catch => ERR:\t" + err))
        .finally(() => {
            console.log(rowData.length);
            postBtn.hidden = true;
            document.getElementById('nextBtn').hidden = false;
            document.getElementById('prev').hidden = false;
            for (let element of rowData) {
                contentHn.innerHTML += element;
            }
            postBtn.hidden = false;
            contentHn.hidden = false;
            document.getElementById('loading').hidden = true;
        });
}

document.getElementById('btnReload').onclick = () => loadData(window.location.hash.replace('#', ''));
let countClick = 1;
postBtn.onclick = (event) => {
    countClick++;
    if (countClick % 2 == 0) {
        window.location.hash = "hackernewsTop";
        event.srcElement.innerHTML = "Show LATEST";
    } else {
        window.location.hash = "hackernews";
        event.srcElement.innerHTML = "Show TOP";
    }
};