'use strict'
const contentHn = document.getElementById('contentHn');
window.onload = param => {
    // document.location.hash = '#hackernews';
    loadData('hackernews');
}
window.onhashchange = param => loadData(param.newURL.split('#')[1]);

function loadData(channel) {
    switch (channel) {
        case 'hackernews':
            axios.get('/hackernews', { responseType: 'json' })
                .then(response => {
                    console.log(response.data.items);
                    toHnTable(response.data.items)
                })
                .catch(err => {
                    console.log(err)
                })
            break;
        case 'hackerearth':
            axios.get('/hackerearth', { responseType: 'document' })
                .then(response => {
                    console.log(response.data);
                })
                .catch(err => {
                    console.log(err)
                })
            break;
        default:
            console.log("default:  " + channel)
    }
}

function toHnTable(data) {
    console.log("\n\n" + typeof (data) + data + "\n\n")
    for (let i = 0; i < data.length; i++) {
        console.log(data[i] + "\n")
        contentHn.innerHTML += '<tr><td colspan="2"><p>' + data[i].content_html.replace(' URL', "").replace(/">.*\s<.*\s.*\s.*/g, `" target="_blank"> ${data[i].title}`) + '</a></div><div>Author: ' + data[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPublished on: ' + data[i].date_published + '</div></p></tdcolspan></tr>';
    }
}

document.getElementById('btnReload').onclick = () => loadData(window.location.hash.replace('#', ''));