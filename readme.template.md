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
 - 
 - 

Example:

~~~js
!INLINE ./examples/example1.js
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
!INLINE ./index.html
~~~

But you can as well define a custom `index.html`:

~~~js
!INLINE ./examples/example2/index.js
~~~

~~~html
!INLINE ./examples/example2/index.html
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
!INLINE ./examples/example3.js
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


