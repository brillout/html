const HtmlCrust = require('.'); // npm install @brillout/html-crust

{
    const pageObject = {
        title: 'Example Page',
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
        ],
        styles: [
            '/static/style.css',
        ],
        inlineStyles: [
            'body { margin: 0 }'
        ],
        bodyHtmls: ['<div>Hello World</div>'],
    };
    const html = HtmlCrust(pageObject);
    console.log(html);
    console.log();
}

{
    const pageObject = {
        title: 'HTML without charset nor viewport.',
        charset: null,
        viewport: null,
        headHtmls: ['<custom-element attr-1 attr-2="1337"/>'],
    };
    const html = HtmlCrust(pageObject);
    console.log(html);
    console.log();
}

/*
console.log(HtmlCrust({headEntireHtml: '<new-html8-head-tag>Customized head</new-html8-head-tag>'}));
console.log();

console.log(HtmlCrust({bodyEntireHtml: 'Customized body'}));
console.log();
*/

console.log(HtmlCrust({html: '<HTML>Even the entire html is customizable</HTML>'}));
console.log();
