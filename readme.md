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
# `@brillout/index-html`

A vanilla JavaScript library to generate the outer part of HTML:
`<!DOCTYPE html>`,
`<body>`,
`<head>`,
`<style>`,
`<script>`,
etc.

`@brillout/index-html` is entirely flexible: Everything is customizable.

#### Contents

 - [Usage](#usage)
 - [API](#api)

<br/>
<br/>




### Usage

There are two ways to configure the generated HTML:
 - By using the options of `generateHtml()`
 - By creating an `index.html` file

Example:

~~~js
// /examples/example1.js

const generateHtml = require('@brillout/index-html'); // npm install @brillout/index-html

console.log(generateHtml({
    title: 'Example Page',
    description: 'Some Description.',
    scripts: ['/static/bundle.js'],
    styles: ['/static/style.css'],
    bodyHtmls: ['<h1>Welcome</h1>'],
}));
~~~

Result:

~~~html
<!DOCTYPE html>
<html>
  <head>
      <title>Example Page</title>
      <meta name="description" content="Some Description.">
      <link href="/static/style.css" rel="stylesheet">
  </head>
  <body>
      <h1>Welcome</h1>
      <script src="/static/bundle.js" type="text/javascript"></script>
  </body>
</html>
~~~

The default `index.html` is:

~~~js
// /index.html

<!DOCTYPE html>
<html>
  <head>
      !HEAD
  </head>
  <body>
      !BODY
  </body>
</html>
~~~

But you can as well define a custom `index.html`:

~~~js
// /examples/example2/index.js

const generateHtml = require('@brillout/index-html'); // npm install @brillout/index-html

console.log(generateHtml({
    styles: ['/static/style.css'],
    scripts: ['/static/bundle.js'],
    bodyHtmls: ['<h1>Welcome</h1>'],
}));
~~~

~~~html
// /examples/example2/index.html

<!DOCTYPE html>
<html>
    <head>
        <title>Title set over index.html file</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        !HEAD
    </head>
    <body>
        !BODY
    </body>
</html>
~~~

Which results in:

~~~html
<!DOCTYPE html>
<html>
    <head>
        <title>Title set over index.html file</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body>
        <h1>Welcome</h1>
        <script src="/static/bundle.js" type="text/javascript"></script>
    </body>
</html>
~~~

Also note that you can use the `indexHtml` option instead of creating a file.
See the next section "API" for an example.

<br/>
<br/>




### API

The following example exhibits all options:

~~~js
// /examples/example3.js

const generateHtml = require('@brillout/index-html'); // npm install @brillout/index-html

console.log(generateHtml({
    description: 'Some Description.',
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
~~~

Result:

~~~html
<html>
    <head>
        <title>Title set over indexHtml option</title>
        <meta name="description" content="Some Description.">
        <meta name="viewport" content="width=device-width">
        <meta charset="utf-8">
        <link href="/static/style.css" rel="stylesheet">
        <style>body { margin: 0 }</style>
        <custom-element attr-1 attr-2="1337"/>
    </head>
    <body>
        <div>Hello World</div>
        <script src="/static/bundle.js" type="text/javascript"></script>
        <script src="https://example.org/neat-script.js" async type="application/javascript"></script>
        <script src="/static/es6-module.mjs" defer data-some-custom-attribute="with some custom value" type="module"></script>
        <script type="text/javascript">console.log('hello from `@brillout/index-html`')</script>
    </body>
</html>
~~~

<br/>
<br/>



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
