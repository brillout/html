const render_html_head = require('./');

console.log(render_html_head.renderToHtml({
    title: 'Example Page',
    scripts: [
        '/static/bundle.js',
    ],
    styles: [
        '/static/style.css',
    ],
    body: '<div>Hello World</div>',
}));
