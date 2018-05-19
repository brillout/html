const generateHtml = require('..'); // npm install @brillout/index-html

console.log(generateHtml({
    description: 'HTML created with `@brillout/html-crust`',
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
            sourceCode: "console.log('hello from `@brillout/index-html`')",
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
    bodyHtmls: ['<div>Hello World</div>'],
    headHtmls: ['<custom-element attr-1 attr-2="1337"/>'],
    indexHtml: (
`<html>
    <head>
        <title>Title set over indexHtml option</title>
        !HEAD
    </head>
    <body>
        !BODY
    </body>
</html>
`
    ),
}));
