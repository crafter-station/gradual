import { WebPageDocument } from '@/lib/document/web';

const webPageDocument = new WebPageDocument(
  'https://github.com/crafter-station/gradual',
);

await webPageDocument.init();
console.log(webPageDocument.markdown);
console.log(webPageDocument.tokens);
