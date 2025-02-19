import { WebPageDoc } from '@/lib/doc/web';

const webPageDocument = new WebPageDoc('https://en.wikipedia.org/wiki/SQL');

await webPageDocument.init();

console.log(webPageDocument.sourceId);
