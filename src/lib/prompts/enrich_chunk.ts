import { CHUNK_SIZE } from '../constants';

interface EnrichChunkInput {
  documentSummary: string;
  chunk: string;
  precedingChunk: string | null;
  succeedingChunk: string | null;
  chunkSize?: number;
}

export function getEnrichChunkPrompt({
  documentSummary,
  chunk,
  precedingChunk,
  succeedingChunk,
  chunkSize = CHUNK_SIZE,
}: EnrichChunkInput): string {
  return `## Task:
Enrich and refine the given chunk of text while maintaining its independence and precision.

## Context:
Document Summary: ${documentSummary}
Preceding Chunk: ${precedingChunk ?? 'None'}
Succeeding Chunk: ${succeedingChunk ?? 'None'}

## Input Chunk:
${chunk}

## Semantic Organization Guidelines:
1. Group related information:
  - Combine logically connected data points
  - Maintain context within each grouping
  - Preserve relationships between entities

2. Structure hierarchy:
  - Organize from general to specific
  - Use clear categorical divisions
  - Maintain parent-child relationships

3. Information density:
  - Balance completeness with clarity
  - Ensure each chunk can stand alone
  - Preserve essential context

4. Pattern recognition:
  - Standardize similar information
  - Use consistent formatting for similar data types
  - It is appropriate to restructure tables or lists in ways that are more advantageous for sematic matching
  - Maintain searchable patterns

## Output Requirements:
1. Each chunk should be independently meaningful
2. Related information should stay together
3. Format should support efficient matching
4. Original data relationships must be preserved
5. Context should be clear without external references

Maximum length of the output chunk: ${chunkSize} characters

## Restructured Chunk:`;
}
