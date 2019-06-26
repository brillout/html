const html = require('../..'); // npm install @brillout/html

console.log(html({
    title: 'Example Page',
    description: 'Some Description.',
    scripts: ['/static/bundle.js'],
    styles: ['/static/style.css'],
    body: ['<h1>Welcome</h1>'],
}));

