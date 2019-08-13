const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// Reading templates
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

// Reading data from our data.json file
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map(element => slugify(element.productName, {lower:true}));
console.log(slugs);

// Create server
const server = http.createServer((request, response) => {
    const { query, pathname } = url.parse(request.url, true);

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        response.writeHeader(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObject.map(element => replaceTemplate(templateCard, element)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        response.end(output);

    } else if (pathname === '/product') {    // Product page
        response.writeHeader(200, { 'Content-type': 'text/html' });
        
        const product = dataObject[query.id];
        const output =  replaceTemplate(templateProduct, product);

        response.end(output);

    } else if (pathname === '/api') {    // API
        response.writeHead(200, { 'Content-type': 'application/json' });
        response.end(data); 

    } else {    // Not found
        response.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Nothing to see here'
        }); 
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Server is listening to requests on port 8000');
});