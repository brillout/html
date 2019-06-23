const html = require('../..'); // npm install @brillout/html

console.log(html({
    styles: ['/static/style.css'],
    scripts: ['/static/bundle.js'],
    body: ['<h1>Welcome</h1>'],
}));
