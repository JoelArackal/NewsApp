
console.log('working');


async function Fetch_News()
{
    var url = 'https://www.moneycontrol.com/news/business/stocks/'
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
        console.log(news[0])
        for(item of news)
        {
        var head = item.querySelector('h2').querySelector('a')
        var img_url = item.querySelector('div a img');
        console.log(head.innerHTML);
        console.log(head.href)
        console.log(img_url)
        document.getElementById('app').innerHTML+= ` <img src=${img_url.getAttribute('data-src')}>
            `
    }
    });
}

Fetch_News();