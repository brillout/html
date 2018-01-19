const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

module.exports = {renderToDom, renderToHtml};

const HTML_TAB = '  ';

function renderToHtml(pageObject) {

    const {html} = pageObject;

    if( html ) {
        return html;
    }

    const html_body = render_body_to_html(pageObject);
    const html_head = render_head_to_html(pageObject);

    const html_html = wrap('html', [html_head, html_body]);

    return (
        '<!DOCTYPE html>\n'+
        html_html+
        '\n'
    );

}

function render_head_to_html(pageObject) {
    const {
        title,
        description,
        charset='utf-8',
        viewport='width=device-width, initial-scale=1, maximum-scale=1',
        styles,
        head,
        headHtml,
    } = pageObject;

    if( headHtml ) {
        return wrap('head', headHtml);
    }

    const head_tags = [];
    if( styles ) {
        assert_usage(styles.forEach, styles);
        styles.forEach(href => {
            assert_usage(
                href && href.constructor===String && href.startsWith('/'),
                pageObject,
                styles
            );
            head_tags.push(`<link href="${href}" rel="stylesheet">`);
        });
    }
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
    if( head ) {
        if( head.constructor === String ) {
            head_tags.push(head);
        } else if( head.constructor === Array ) {
            head_tags.push(...head);
        } else {
            assert_usage(false);
        }
    }

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
        body,
        bodyHtml,
    } = pageObject;

    if( bodyHtml ) {
        return wrap('body', bodyHtml);
    }

    assert_usage(!scripts || scripts.forEach);
    const body__addendum = (
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
                !spec.src || spec.src.startsWith('/') || spec.src.startsWith('http'),
                spec,
                spec.src
            );
            spec.type = spec.type || 'text/javascript';
            assert_usage(spec.src || spec.innerHTML);
            return generate_html_element('script', spec, innerHTML);
        })
        .join('\n')
    );

    const html_body = wrap('body', [body, body__addendum]);

    return html_body;

    function generate_html_element(tagName, attrs, innerHTML) {
        assert_internal(attrs.constructor===Object);
        assert_tagName(tagName);
        return (
            [
                '<'+tagName,
                (
                    Object.entries(attrs)
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

function renderToDom(pageObject) {
    const doc = document;
    assert(doc);
    assert(doc.documentElement);
    assert(doc.body);
    assert(doc.querySelector);
    assert(doc.createElement);

    assert_usage(!pageObject.body);

    {
        const {title} = pageObject;
        doc.title = title || '';
    }

    {
        const {description} = pageObject;
        const dom_el__meta_desc = (() => {
            const el = doc.querySelector('meta[name="description"]');
            if( el ) {
                return el;
            }
            const new_el = doc.createElement('meta');
            new_el.setAttribute('name', 'description');
            return new_el;
        })();
        dom_el__meta_desc.setAttribute('content', description || '');
    }
}
