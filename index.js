const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

module.exports = generateIndexHtml;

let indexHtml__default;

function generateIndexHtml(pageObject) {
    let indexHtml = get_index_html(pageObject);

    const headHtml = render_head(pageObject);
    const bodyHtml = render_body(pageObject);

    indexHtml = replace_token(indexHtml, '!HEAD', headHtml);
    indexHtml = replace_token(indexHtml, '!BODY', bodyHtml);

    return indexHtml;
}

function get_index_html(pageObject) {
    assert_usage(!pageObject.indexHtml || pageObject.indexHtml.constructor===String);

    if( pageObject.indexHtml ) {
        return pageObject.indexHtml;
    }

    if( ! indexHtml__default ) {
        indexHtml__default = get_default_index_html();
    }

    return indexHtml__default;
}

function render_head(pageObject) {
    const {
        title,
        description,
        charset='utf-8',
        viewport,
        inlineStyles,
        styles,
        headHtmls=[],
    } = pageObject;
    assert_usage(headHtmls.constructor === Array);

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
                pageObject,
                href
            );
            head_tags.push(`<link href="${href}" rel="stylesheet">`);
        });
    }
    if( inlineStyles ) {
        assert_usage(inlineStyles.forEach, inlineStyles);
        inlineStyles.forEach(styleSheet => {
            assert_usage(
                !isUrl(styleSheet),
                pageObject,
                styleSheet
            );
            head_tags.push(`<style>${styleSheet}</style>`);
        });
    }

    head_tags.push(...headHtmls);

    const headHtml = head_tags.join('\n');
    return headHtml;
}

function render_body(pageObject) {
    const {
        scripts=[],
        bodyHtmls=[],
    } = pageObject;
    assert_usage(bodyHtmls && bodyHtmls.constructor===Array);
    assert_usage(scripts && scripts.constructor===Array);

    const scriptHtmls = scripts.map(scriptSpec => generate_script_html(scriptSpec, pageObject));

    const bodyHtml = [...bodyHtmls, ...scriptHtmls].join('\n');
    return bodyHtml;
}

function generate_script_html(scriptSpec, pageObject) {
    assert_scriptSpec(scriptSpec, pageObject);

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

    return generate_tag_html('script', scriptSpec, innerHTML, pageObject);
}

function assert_scriptSpec(scriptSpec, pageObject) {
    assert_usage(
        scriptSpec && [String, Object].includes(scriptSpec.constructor),
        pageObject,
        scriptSpec
    );
    assert_usage(
        scriptSpec.constructor===String || !scriptSpec.src || isUrl(scriptSpec.src),
        pageObject,
        scriptSpec,
        scriptSpec.src
    );
    assert_usage(scriptSpec.constructor===String || scriptSpec.src || scriptSpec.sourceCode);
}

function generate_tag_html(tagName, attrs, innerHTML, pageObject) {
    assert_internal(attrs.constructor===Object);
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
        assert_internal(tagName, pageObject, tagName);
        assert_usage(/^[a-zA-Z]+$/.test(tagName), pageObject, tagName);
    }
    function assert_attr_name(attr_name) {
        assert_usage(attr_name, pageObject, attr_name);
        assert_usage(/^[a-zA-Z-]+$/.test(attr_name), pageObject, attr_name);
    }
    function assert_attr_value(attr_value) {
        assert_usage(attr_value, pageObject, attr_value);
        assert_usage(!attr_value.includes('"'), pageObject, attr_value);
    }
}

function replace_token(indexHtml, token, token_content='') {
    assert_internal(token_content.constructor===String);
    assert_token(indexHtml, token, token_content);
    let lines = indexHtml.split('\n');

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

    indexHtml = lines.join('\n');

    return indexHtml;
}

function assert_token(indexHtml, token, token_content) {
    const count = indexHtml.split(token).length - 1;
    assert_usage(
        count>0 || token_content==='',
        "Provided `index.html`:",
        '',
        indexHtml,
        '',
        "Token `"+token+"` is missing in the provided `index.html`.",
        "Provided `index.html` is printed above."
    );
    assert_usage(
        count===1,
        "Provided `index.html`:",
        '',
        indexHtml,
        '',
        "There are "+count+" `"+token+"` tokens in the provided `index.html` but there should be only one.",
        "Provided `index.html` is printed above."
    );
}

function get_default_index_html() {
    const getUserDir = require('@brillout/get-user-dir');
    const find_up = require('find-up');
    const path = require('path');
    const fs = require('fs');

    const userDir = getUserDir();

    let indexHtmlPath = find_up.sync('index.html', {cwd: userDir});

    if( ! indexHtmlPath ) {
        indexHtmlPath = path.join(__dirname, './index.html');
    }

    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

    return indexHtml;
}

function isUrl(url) {
    return url && url.constructor===String && (url.startsWith('/') || url.startsWith('http'));
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
