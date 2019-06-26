const html = require('../..'); // npm install @brillout/html

// `@brillout/html` automatically finds your `index.html` file.

console.log(html({
    styles: ['/static/style.css'],
    scripts: ['/static/bundle.js'],
    body: ['<h1>Welcome</h1>'],
}));
