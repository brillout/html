const html = require('..'); // npm install @brillout/html

console.log(html({
    description: 'Some Description.',
    favicon: '/static/some-logo.png',
    scripts: [
        '/static/bundle.js',
        {
            src: 'https://example.org/neat-script.js',
            async: true,
            type: 'application/javascript',
        },
        {
            src: '/static/es6-module.mjs',
            defer: true,
            'data-some-custom-attribute': 'with some custom value',
            type: 'module'
        },
        {
            sourceCode: "console.log('hello from `@brillout/html`')",
        },
    ],
    styles: [
        '/static/style.css',
    ],
    inlineStyles: [
        'body { margin: 0 }'
    ],
    charset: 'utf-8',
    viewport: 'width=device-width',
    body: ['<div>Hello World</div>'],
    head: ['<custom-element attr-1 attr-2="1337"/>'],
    html: (
`<html>
    <head>
        <title>Title set over the \`html\` option</title>
        !HEAD
    </head>
    <body>
        !BODY
    </body>
</html>
`
    ),
}));
