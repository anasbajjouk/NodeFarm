const fs = require('fs');
const http = require('http');
const url = require('url');

// Replace Tempalte fucntion
const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}

// Reading templates
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

// Reading data from our data.json file
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

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