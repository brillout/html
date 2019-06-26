const html = require('../..'); // npm install @brillout/html

const htmlOptions = {
  title: ({productName}) => 'Example - '+productName,
  description: ({productName}) => 'Product page of '+productName+'.',

  // All options can be generated with a function.
  // E.g. `html`:
  head: ({productName}) => [
    // Facebook's Open Graph
    '<meta property="og:title" itemprop="name" content="'+productName+'">',
  ],
};

const initialProps = {
  productName: 'Super vacuum cleaner',
};

console.log(html({
  ...htmlOptions,
  initialProps,
}));

