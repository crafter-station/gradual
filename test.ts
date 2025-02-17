import { WebPageDocument } from '@/lib/document/web';

const webPageDocument = new WebPageDocument(
  'https://arxiv.org/html/1706.03762v7',
);

await webPageDocument.init();

const chunks = webPageDocument.generateChunks();
console.log(chunks);

const summarizedChunks = await webPageDocument.summarizeChunks();
console.log(summarizedChunks);

const documentSummary = await webPageDocument.generateDocumentSummary();
console.log(documentSummary);

const enrichedChunks = await webPageDocument.enrichChunks();
console.log(enrichedChunks);

const enrichedDocumentSummary = await webPageDocument.enrichDocumentSummary();
console.log(enrichedDocumentSummary);
