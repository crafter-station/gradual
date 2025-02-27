import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import type { Schema, ZodType } from 'zod';

export type AllowedModels = 'gpt-4o-mini' | 'o3-mini';

export interface AIGenerator {
  generateText(config: {
    model: AllowedModels;
    prompt: string;
    experimental_telemetry?: { isEnabled?: boolean; functionId?: string };
  }): Promise<string>;

  generateObject<T>(config: {
    model: AllowedModels;
    prompt: string;
    schema: ZodType<T> | Schema<T>;
    experimental_telemetry?: { isEnabled?: boolean; functionId?: string };
  }): Promise<T>;
}

export class OpenAIGenerator implements AIGenerator {
  async generateText(config: {
    model: AllowedModels;
    prompt: string;
    experimental_telemetry?: { isEnabled?: boolean; functionId?: string };
  }): Promise<string> {
    const resp = await generateText({
      model: openai(config.model),
      prompt: config.prompt,
      experimental_telemetry: config.experimental_telemetry,
    });

    return resp.text;
  }

  async generateObject<T>(config: {
    model: AllowedModels;
    prompt: string;
    schema: ZodType<T> | Schema<T>;
    experimental_telemetry?: { isEnabled?: boolean; functionId?: string };
  }): Promise<T> {
    const resp = await generateObject({
      model: openai(config.model),
      prompt: config.prompt,
      schema: config.schema,
      experimental_telemetry: config.experimental_telemetry,
    });

    return resp.object;
  }
}
