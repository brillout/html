const HtmlCrust = require('@brillout/html-crust'); // npm install @brillout/html-crust


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
        body: '<div>Hello World</div>',
    };
    const html = HtmlCrust.renderToHtml(pageObject);
    print(html);
}

{
    const pageObject = {
        title: 'HTML without charset nor viewport.',
        charset: null,
        viewport: null,
        head: [
            '<custom-element attr-1 attr-2="1337"/>',
        ],
    };
    const html = HtmlCrust.renderToHtml(pageObject);
    print(html);
}

print(HtmlCrust.renderToHtml({headHtml: '<new-html8-head-tag>Customized head</new-html8-head-tag>'}));

print(HtmlCrust.renderToHtml({bodyHtml: 'Customized body'}));

print(HtmlCrust.renderToHtml({html: '<HTML>Even the entire html is customizable</HTML>'}));


function print(str) {
    console.log(str);
    console.log('');
}
