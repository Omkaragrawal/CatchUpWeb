'use strict'
const contentHn = document.getElementById('contentHn');
const postBtn = document.getElementById('posts');
let count = 1;
window.onload = param => {
    if(!window.location.hash){
    loadData('hackernews');
    document.location.hash = '#hackernews';
    } else {
        loadData(window.location.hash.split('#')[1]);
    }
}
window.onhashchange = param => loadData(param.newURL.split('#')[1]);

function subMenu(element) {
    console.log(element);
}


function loadData(channel) {
    switch (channel) {
        case 'hackernews':
            axios.get('/hackernews', { responseType: 'json' })
                .then(response => {
                    postBtn.hidden = true;
                    // console.log(response.data.items);
                    toHnTable(response.data.items);
                })
                .catch(err => {
                    console.log(err)
                })
            break;
        case "hackernewsTop":
                postBtn.hidden=true;
            console.log("hackernewsTOP");
            postBtn.hidden= false;
            break;
        case 'hackerearth':
            axios.get('/hackerearth', { responseType: 'document' })
                .then(response => {
                    console.log(response.data);
                })
                .catch(err => {
                    console.log(err);
                })
            break;
        default:
            console.log("default:  " + channel);
    }
}

function toHnTable(data) {
    // console.log("\n\n" + typeof (data) + data + "\n\n")
    contentHn.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        // console.log(data[i] + "\n")
        contentHn.innerHTML += '<tr><td colspan="2"><p>' + data[i].content_html.replace(' URL', "").replace(/">.*\s<.*\s.*\s.*/g, `" target="_blank"> ${data[i].title}`) + '</a></div><div>Author: ' + data[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPublished on: ' + data[i].date_published + '</div></p></tdcolspan></tr>';
    }
    postBtn.hidden=false;
}

document.getElementById('btnReload').onclick = () => loadData(window.location.hash.replace('#', ''));
postBtn.onclick = (event) => {
    count++;
    if (count % 2 == 0) { loadData("hackernewsTop"); event.srcElement.innerHTML = "Show LATEST"; }
    else { loadData("hackernews"); event.srcElement.innerHTML = "Show TOP"; }
}