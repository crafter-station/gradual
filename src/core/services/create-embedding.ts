import { openai } from "@ai-sdk/openai";
import { type EmbedManyResult, type EmbedResult, embed, embedMany } from "ai";

export const createSingleEmbedding = async (
  value: string
): Promise<EmbedResult<string>> => {
  return await embed({
    model: openai.embedding("text-embedding-3-large", { dimensions: 1536 }),
    value: value,
  });
};

export const createMultipleEmbeddings = async (
  values: string[]
): Promise<EmbedManyResult<string>> => {
  return await embedMany({
    model: openai.embedding("text-embedding-3-large", { dimensions: 1536 }),
    values: values,
  });
};
