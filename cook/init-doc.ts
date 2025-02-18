import { WebPageDoc } from '@/lib/doc';

const webPageDocument = new WebPageDoc('https://arxiv.org/html/1706.03762v7');

await webPageDocument.init();

console.log(webPageDocument.sourceId);
