const generateHtml = require('../..'); // npm install @brillout/index-html

console.log(generateHtml({
    styles: ['/static/style.css'],
    scripts: ['/static/bundle.js'],
    bodyHtmls: ['<h1>Welcome</h1>'],
}));
