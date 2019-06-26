const html = require('../..'); // npm install @brillout/html

console.log(html({
    title: 'Example Page',
    description: 'Some Description.',
    favicon: '/static/logo.png',
    scripts: ['/static/bundle.js'],
    styles: ['/static/style.css'],
    head: ['<link rel="manifest" href="/manifest.webmanifest">'],
    body: ['<h1>Welcome</h1>'],
}));

