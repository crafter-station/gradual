import OpenAI from 'openai';

const openai = new OpenAI();

const batches = await openai.batches.list();

for await (const batch of batches) {
  console.log(batch);
  console.log(new Date().toISOString());
}
