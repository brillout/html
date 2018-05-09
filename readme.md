<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.






-->
# `@brillout/html-crust`

A vanilla JavaScript library to generate the outer part of `<html>`.
<br/>
(Including `<head>`, `<style>`, `<script>`, `<!DOCTYPE html>`, etc.)


With "outer part" we denote the `<head>` tag, the `<!DOCTYPE html>` tag, `<script>` tags, etc.

Everything is customizable.
You can set any arbritary head and body, and the whole HTML can be arbitrarily set as well.

The following example exhibits all options.

~~~js
// /example.js

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
        inlineStyles: [
            'body { margin: 0 }'
        ],
        bodyHtml: '<div>Hello World</div>',
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
        headHtml: '<custom-element attr-1 attr-2="1337"/>',
    };
    const html = HtmlCrust(pageObject);
    console.log(html);
    console.log();
}

console.log(HtmlCrust({headEntireHtml: '<new-html8-head-tag>Customized head</new-html8-head-tag>'}));
console.log();

console.log(HtmlCrust({bodyEntireHtml: 'Customized body'}));
console.log();

console.log(HtmlCrust({html: '<HTML>Even the entire html is customizable</HTML>'}));
console.log();
~~~

Running the example prints

~~~html
<!DOCTYPE html>
<html>
  <head>
    <title>Example Page</title>
    <meta name="description" content="HTML created with `@brillout/html-crust`">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta charset="utf-8">
    <link href="/static/style.css" rel="stylesheet">
    <style>body { margin: 0 }</style>
  </head>
  <body>
    <div>Hello World</div>
    <script src="/static/bundle.js" type="text/javascript"></script>
    <script src="https://example.org/neat-script.js" async type="application/javascript"></script>
    <script src="/static/es6-module.mjs" defer data-some-custom-attribute="with some custom value" type="module"></script>
  </body>
</html>


<!DOCTYPE html>
<html>
  <head>
    <title>HTML without charset nor viewport.</title>
    <custom-element attr-1 attr-2="1337"/>
  </head>
  <body>
  </body>
</html>


<!DOCTYPE html>
<html>
  <head>
    <new-html8-head-tag>Customized head</new-html8-head-tag>
  </head>
  <body>
  </body>
</html>


<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta charset="utf-8">
  </head>
  <body>
    Customized body
  </body>
</html>


<HTML>Even the entire html is customizable</HTML>
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/readme.template.md` instead.






-->
