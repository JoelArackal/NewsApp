
console.log('working');

const navigateTo = url => {
    history.pushState(null,null,url)
    router();
};

var news_urls = {
    'business':[['https://www.moneycontrol.com/news/business/',0],],
    'stocks':[['https://www.moneycontrol.com/news/business/stocks/',0], ['https://economictimes.indiatimes.com/markets/stocks/news',1],],
    'recos': [['https://economictimes.indiatimes.com/markets/stocks/recos',1],],
    'general':[['https://www.moneycontrol.com/news/news-all/',0], ['https://economictimes.indiatimes.com/news/india',1],]
}

console.log(news_urls['business'][0][0])

async function fetch_from_MC(url)
{
    // var url = 'https://www.moneycontrol.com/news/business/stocks/'
    fetch(url).then((resp) =>
                {
    return resp.text();
}).then((html) => {
    var parser = new DOMParser();

        // Parse the text
        var doc = parser.parseFromString(html, "text/html");

        // You can now even select part of that html as you would in the regular DOM
        // Example:
        // var docArticle = doc.querySelector('article').innerHTML;
        var wrap = doc.getElementById('cagetory')
        var news = wrap.getElementsByClassName('clearfix')
        // console.log(news[0])
        for(item of news)
        {
        var head = item.querySelector('h2').querySelector('a')
        var img_url = item.querySelector('div a img').getAttribute('data-src');
        var heading = head.innerHTML;
        var link =  head.href;
        var desc = item.querySelector('p').innerHTML;
        // var desc = desc.slice(0,20);
        var date = item.querySelector('div span').innerHTML
        // console.log(head.innerHTML);
        // console.log(head.href)
        // console.log(img_url)
        document.getElementById('app').innerHTML+= `<div class="news-item">
                    <div class="image-wrap">
                <img class="news-img" src="${img_url}" alt="" srcset="">
            </div>
            <div class="news-wrap">
                <span class="date">${date}</span>
                <a href="${link}" class="link" target="_blank"> <h3>${heading}</h3> </a> 
                <p>${desc} <br>   
                </p>
            </div>
            </div>
            <br>
            <div class="line"></div>`
    }
    });
}

async function fetch_from_ET(url)
{
    fetch(url, { 
        mode:'no-cors',
        credentials: 'same-origin',
    headers: {
        'access-control-allow-credentials': true,
        'access-control-allow-origin' : 'https://economictimes.indiatimes.com',
        'user-agent' : 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko)' 
        } }).then((resp) =>
                {
    return resp.text();
}).then((html) => {
    var parser = new DOMParser();

        // Parse the text
        var doc = parser.parseFromString(html, "text/html");

        // You can now even select part of that html as you would in the regular DOM
        // Example:
        // var docArticle = doc.querySelector('article').innerHTML;
        // var wrap = doc.getElementById('cagetory')
        var news = doc.querySelectorAll('div.eachStory')
        console.log(html)
        for(item of news)
        {
        var head = item.querySelector('h3').querySelector('a')
        var img_url = 'https://economictimes.indiatimes.com' + item.querySelector('a span img').getAttribute('data-original');
        var heading = head.innerHTML;
        var link =  head.href;
        var desc = item.querySelector('p').innerHTML;
        // var desc = desc.slice(0,20);
        var date = item.querySelector('time').innerHTML
        // console.log(head.innerHTML);
        // console.log(head.href)
        // console.log(img_url)
        document.getElementById('app').innerHTML+= `<div class="news-item">
                    <div class="image-wrap">
                <img class="news-img" src="${img_url}" alt="" srcset="">
            </div>
            <div class="news-wrap">
                <span class="date">${date}</span>
                <a href="${link}" class="link" target="_blank"> <h3>${heading}</h3> </a> 
                <p>${desc} <br>   
                </p>
            </div>
            </div>
            <br>
            <div class="line"></div>`
    }
    });
}


const router = async () => {
    const routes = [
        {path: '/', view: ['business','Business News']},
        {path: '/stocks', view: ['stocks','Stocks News']},
        {path: '/recos', view: ['recos','Recommendations']},
        {path: '/general', view: ['general','General News']},
    ];

    const potentilaMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        };
    })

    let match = potentilaMatches.find(potentilaMatche => potentilaMatche.isMatch);

    if(!match)
    {
        match = {
            route: routes[0],
            isMatch:true
        };
    };

    const key =  match.route.view;
    console.log(news_urls[key[0]]);
    var urls = news_urls[key[0]]

    document.getElementById('head').innerHTML = key[1];
    document.getElementById('app').innerHTML = '';
    
    for(url of urls)
    {
        if(url[1]==0)
        {
         fetch_from_MC(url[0]);
        }

    }
    
    // var content = await getHtml(key)
    // document.querySelector('#app').innerHTML = content;


    // console.log(match.route.view());
};







// fetch_from_MC();

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', e => {
        
        if(e.target.matches("[data-link]")){
            e.preventDefault();
            // console.log('clicked')
            navigateTo(e.target.href);
            
        }
    })
    router();
})