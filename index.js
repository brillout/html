const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const getUserDir = require('@brillout/get-user-dir');

module.exports = HtmlCrust;

let indexHtml;

function HtmlCrust(pageObject) {
    const {html} = pageObject;

    if( html ) {
        return html;
    }

    if( ! indexHtml ) {
        indexHtml = getIndexHtml();
    }

    const html_head = render_head_to_html(pageObject);
    const html_body = render_body_to_html(pageObject);

    if( html_head ) {
        const HEAD_TOKEN = '!HEAD';
        assert_token(indexHtml, HEAD_TOKEN);
        replace_token(indexHtml, HEAD_TOKEN, html_head);
    }

    if( html_body ) {
        const BODY_TOKEN = '!BODY';
        assert_token(indexHtml, BODY_TOKEN);
        replace_token(indexHtml, BODY_TOKEN, html_body);
    }

    const html_html = wrap('html', [html_head, html_body]);

    return (
        '<!DOCTYPE html>\n'+
        html_html+
        '\n'
    );

}

function assert_token(indexHtml, token) {
    const count = indexHtml.split(HEAD_TOKEN).length;
    assert_usage(
        count>0,
        "Provided `index.html`:",
        '',
        indexHtml,
        '',
        "Token `"+token+"` is missing in the provided `index.html`.",
        "Provided `index.html` is printed above."
    );
    assert_usage(
        count>1,
        "Provided `index.html`:",
        '',
        indexHtml,
        '',
        "There are "+count+" `"+token+"` tokens in the provided `index.html` but there should be only one.",
        "Provided `index.html` is printed above."
    );
}

function replace_token(indexHtml, token, token_content) {
    const lines = indexHtml.split('\n');
    const token_line = lines.find(line => line.includes(token));
    const tab = token_line.match(/^\s*/)[0];
    const token_content_with_tab = token_content.split('\n').map(line => tab+line).join('\n');
    indexHtml.replace(token, token_content_with_tab);
}

function render_head_to_html(pageObject) {
    const {
        title,
        description,
        charset='utf-8',
        viewport,
        inlineStyles,
        styles,
        headHtmls=[],
        headEntireHtml,
    } = pageObject;
    assert_usage(headHtmls.constructor === Array);

    if( headEntireHtml ) {
        return wrap('head', headEntireHtml);
    }

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

    const html_head = (
        head_tags.length === 0 ? (
            ''
        ) : (
            wrap('head', head_tags)
        )
    );

    return html_head;
}

function render_body_to_html(pageObject) {
    const {
        scripts,
        bodyHtmls=[],
        bodyEntireHtml,
    } = pageObject;
    assert_usage(bodyHtmls && bodyHtmls.constructor===Array);

    if( bodyEntireHtml ) {
        return wrap('body', bodyEntireHtml);
    }

    assert_usage(!scripts || scripts.forEach);
    const bodyHtml__addendum = (
        (scripts||[])
        .map(spec => {
            assert_usage(
                spec
            );
            if( spec.constructor === String ) {
                spec = {src: spec};
            }
            assert_usage(spec.constructor===Object, spec);
            let innerHTML;
            if( spec.code ) {
                innerHTML = spec.code;
                delete spec.code;
            }
            assert_usage(
                !spec.src || isUrl(spec.src),
                spec,
                spec.src
            );
            spec.type = spec.type || 'text/javascript';
            assert_usage(spec.src || spec.innerHTML);
            return generate_html_element('script', spec, innerHTML);
        })
        .join('\n')
    );

    const html_body = wrap('body', [...bodyHtmls, bodyHtml__addendum]);

    return html_body;

    function generate_html_element(tagName, attrs, innerHTML) {
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
    }

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

function wrap(tag, content) {
    const HTML_TAB = '  ';

    assert_internal([String, Array].includes(content.constructor));
    const content_array = content.constructor===Array ? content : [content];
    return (
        [
            '<'+tag+'>',
            ...(
                content_array
                .filter(Boolean)
                .join('\n')
                .split('\n')
                .filter(Boolean)
                .map(line => HTML_TAB+line)
            ),
            '</'+tag+'>',
        ]
        .filter(Boolean)
        .join('\n')
    );
}

function isUrl(url) {
    return url && url.constructor===String && (url.startsWith('/') || url.startsWith('http'));
}

function getIndexHtml() {
    const userDir = getUserDir();
    const path = require('path');
    const fs = require('fs');

    let indexHtmlPath = find_up.sync('index.html', {cwd: userDir});

    if( ! indexHtmlPath ) {
        indexHtmlPath = path.join(__dirname, './index.html');
    }

    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

    return indexHtml;
}
