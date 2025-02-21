import fs from 'node:fs';
import OpenAI from 'openai';

const openai = new OpenAI();

const path = Bun.file('input.jsonl');

await Bun.write(
  path,
  `{"custom_id": "request-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-3.5-turbo-0125", "messages": [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Hello world!"}],"max_tokens": 1000}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-3.5-turbo-0125", "messages": [{"role": "system", "content": "You are an unhelpful assistant."},{"role": "user", "content": "Hello world!"}],"max_tokens": 1000}}`,
);

// FsReadStream

const file = await openai.files.create({
  file: fs.createReadStream('input.jsonl'),
  purpose: 'batch',
});

console.log(file);

const batch = await openai.batches.create({
  input_file_id: file.id,
  endpoint: '/v1/chat/completions',
  completion_window: '24h',
});

console.log(batch);

console.log(new Date().toISOString());
