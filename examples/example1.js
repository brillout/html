const generateHtml = require('..'); // npm install @brillout/index-html

console.log(generateHtml({
    title: 'Example Page',
    description: 'HTML created with `@brillout/html-crust`',
    scripts: ['/static/bundle.js'],
    styles: ['/static/style.css'],
    bodyHtmls: ['<h1>Welcome</h1>'],
}));

