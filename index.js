const assert = require('assert');
const assert_usage = assert;
const format_space = require('@brillout/format-space');

module.exports = {renderToDom, renderToHtml};

function renderToHtml(page_info) {
    const {
        title,
        description,
        charset='utf-8',
        viewport='width=device-width, initial-scale=1, maximum-scale=1',
        head,
        styles,
        scripts,
        body,
    } = page_info;

    const head_tags = [];
    if( styles ) {
        assert_usage(styles.forEach, styles);
        styles.forEach(href => {
            assert_usage(href.startsWith('/'));
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

    const head_html = (
        head_tags
        .join('\n')
    );

    assert_usage(!scripts || scripts.forEach);
    const body__addendum = (
        (scripts||[])
        .map(src => {
            assert_usage(src.startsWith('/'));
            return `<script type="text/javascript" src="${src}"></script>`
        })
        .join('\n')
    );

    return (
        format_space`
            <!DOCTYPE html>
            <html>
                <head>
                    ${head_html}
                </head>
                <body>
                    ${body}
                    ${body__addendum}
                </body>
            </html>
        `
    );
}

function renderToDom(page_info) {
    const doc = document;
    assert(doc);
    assert(doc.documentElement);
    assert(doc.body);
    assert(doc.querySelector);
    assert(doc.createElement);

    assert_usage(!page_info.body);

    {
        const {title} = page_info;
        doc.title = title || '';
    }

    {
        const {description} = page_info;
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
