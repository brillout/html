const assert = require('@brillout/reassert');

module.exports = html;

let htmlOptions;

function html({
  html,

  // head
  title,
  description,
  charset,
  viewport,
  inlineStyles,
  styles,
  head=[],

  // body
  scripts=[],
  body=[],

  // TODO - use this to generate meta tags upon async loaded data
  initialProps,
}) {
  htmlOptions = arguments[0];

  let html_all = get_html({html});

  const html_head = render_head({
    title,
    description,
    charset,
    viewport,
    inlineStyles,
    styles,
    head,
  });

  const html_body = render_body({
    scripts,
    body,
  });

  html_all = replace_token(html_all, '!HEAD', html_head);
  html_all = replace_token(html_all, '!BODY', html_body);

  return html_all;
}

function get_html({html}) {
    assert_usage(!html || html.constructor===String);

    if( html ) {
      return html;
    } else {
      return get_index_html_file_content();
    }
}

function render_head({
  title,
  description,
  charset,
  viewport,
  inlineStyles,
  styles,
  head,
}) {
    assert_usage(head.constructor === Array);

    const head_tags = [];
    if( title ) {
        head_tags.push(`<title>${title}</title>`);
    }
    if( description ) {
        head_tags.push(`<meta name="description" content="${description}">`);
    }
    if( viewport ) {
        head_tags.push(`<meta name="viewport" content="${viewport}">`);
    }
    if( charset ) {
        head_tags.push(`<meta charset="${charset}">`);
    }
    if( styles ) {
        assert_usage(styles.forEach, styles);
        styles.forEach(href => {
            assert_usage(
                isUrl(href),
                {href},
            );
            head_tags.push(`<link href="${href}" rel="stylesheet">`);
        });
    }
    if( inlineStyles ) {
        assert_usage(inlineStyles.forEach, inlineStyles);
        inlineStyles.forEach(styleSheet => {
            assert_usage(
                !isUrl(styleSheet),
                {styleSheet},
            );
            head_tags.push(`<style>${styleSheet}</style>`);
        });
    }

    head_tags.push(...head);

    const html_head = head_tags.join('\n');
    return html_head;
}

function render_body({
  scripts,
  body,
}) {
    assert_usage(body && body.constructor===Array);
    assert_usage(scripts && scripts.constructor===Array);

    const scriptHtmls = scripts.map(scriptSpec => generate_script_html(scriptSpec));

    const html_body = [...body, ...scriptHtmls].join('\n');
    return html_body;
}

function generate_script_html(scriptSpec) {
    assert_scriptSpec(scriptSpec);

    if( scriptSpec.constructor === String ) {
        scriptSpec = {src: scriptSpec};
    }

    const tagSpec = {...scriptSpec};

    tagSpec.type = tagSpec.type || 'text/javascript';

    let innerHTML;
    if( tagSpec.sourceCode ) {
        innerHTML = tagSpec.sourceCode;
        delete tagSpec.sourceCode;
    }

    return generate_tag_html('script', tagSpec, innerHTML);
}

function assert_scriptSpec(scriptSpec) {
    assert_usage(
        scriptSpec && [String, Object].includes(scriptSpec.constructor),
        scriptSpec
    );
    assert_usage(
        scriptSpec.constructor===String || !scriptSpec.src || isUrl(scriptSpec.src),
        scriptSpec,
        scriptSpec.src
    );
    assert_usage(scriptSpec.constructor===String || scriptSpec.src || scriptSpec.sourceCode);
}

function generate_tag_html(tagName, attrs, innerHTML) {
    assert.internal(attrs.constructor===Object);
    assert_tagName(tagName);
    const options_key = '_options';
    const options = attrs[options_key] || {};
    return (
        [
            '<'+tagName,
            (
                Object.entries(attrs)
                .filter(([key]) => {
                    if( key === options_key ) {
                        return false;
                    }
                    if( (options.skipAttributes||[]).includes(key) ) {
                        return false;
                    }
                    return true;
                })
                .map(([attr_name, attr_value]) => {
                    if( ! attr_value ) {
                        return '';
                    }
                    if( attr_value===true ) {
                        return ' '+attr_name;
                    }
                    assert_attr_name(attr_name);
                    assert_attr_value(attr_value);
                    return ' '+attr_name+'="'+attr_value+'"';
                })
                .join('')
            ),
            '>',
            innerHTML||'',
            '</'+tagName+'>',
        ].join('')
    )

    function assert_tagName(tagName) {
        assert.internal(tagName, {tagName});
        assert_usage(/^[a-zA-Z]+$/.test(tagName), {tagName});
    }
    function assert_attr_name(attr_name) {
        assert_usage(attr_name, {attr_name});
        assert_usage(/^[a-zA-Z-]+$/.test(attr_name), {attr_name});
    }
    function assert_attr_value(attr_value) {
        assert_usage(attr_value, {attr_value});
        assert_usage(!attr_value.includes('"'), {attr_value});
    }
}

function replace_token(html_all, token, token_content='') {
    assert.internal(token_content.constructor===String);
    assert_token(html_all, token, token_content);
    let lines = html_all.split('\n');

    lines = (
        lines
        .map(line => {
            if( ! line.includes(token) ) {
                return line;
            }

            const tab = line.match(/^\s*/)[0];
            token_content = token_content.split('\n').map(line => (line===''?'':tab)+line).join('\n');

            line = line.replace(new RegExp('^\\s*'+escapeRegExp(token)), token);
            line = line.replace(token, token_content);

            if( line==='' ) return null;

            return line;

        })
        .filter(line => line!==null)
    );

    html_all = lines.join('\n');

    return html_all;
}

function assert_token(html_all, token, token_content) {
    const count = html_all.split(token).length - 1;
    assert_usage(
        count>0 || token_content==='',
        "Provided `index.html`:",
        '',
        html_all,
        '',
        "Token `"+token+"` is missing in the provided `index.html`.",
        "Provided `index.html` is printed above."
    );
    assert_usage(
        count<=1,
        "Provided `index.html`:",
        '',
        html_all,
        '',
        "There are "+count+" `"+token+"` tokens in the provided `index.html` but there should be only one.",
        "Provided `index.html` is printed above."
    );
}

let indexHtml;
function get_index_html_file_content() {
    if( !indexHtml ){
      indexHtml = retrieve();
    }
    assert.internal(indexHtml);
    return indexHtml;

    function retrieve() {
      const ProjectFiles = require('@brillout/project-files');
      const path = require('path');
      const fs = require('fs');

      const projectFiles = new ProjectFiles();
      let indexHtmlPath = projectFiles.findFile('index.html');

      if( !indexHtmlPath ){
        indexHtmlPath = path.join(__dirname, './index.html');
        assert.internal(indexHtmlPath);
      }

      assert.internal(indexHtmlPath && path.isAbsolute(indexHtmlPath));

      return fs.readFileSync(indexHtmlPath, 'utf8');
    }
}

function isUrl(url) {
    return url && url.constructor===String && (url.startsWith('/') || url.startsWith('http'));
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function assert_usage(bool, ...args) {
  assert.usage(
    bool,
    {htmlOptions},
    ...args
  );
}
