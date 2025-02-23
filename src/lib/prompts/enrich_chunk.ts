import { CHUNK_SIZE } from '../constants';

interface EnrichChunkInput {
  sourceSummary: string;
  chunk: string;
  precedingChunkContent: string | null;
  succeedingChunkContent: string | null;
  chunkSize?: number;
}

export function getEnrichChunkPrompt({
  sourceSummary,
  chunk,
  precedingChunkContent,
  succeedingChunkContent,
  chunkSize = CHUNK_SIZE,
}: EnrichChunkInput): string {
  return `<task>
Enrich and refine the given chunk of text while maintaining its independence and precision.
</task>

<context>
<source_summary>${sourceSummary}</source_summary>
<preceding_chunk>${precedingChunkContent ?? 'None'}</preceding_chunk>
<succeeding_chunk>${succeedingChunkContent ?? 'None'}</succeeding_chunk>
</context>

<input_chunk>
${chunk}
</input_chunk>

<semantic_guidelines>
<grouping>
- Combine logically connected data points
- Maintain context within each grouping
- Preserve relationships between entities
</grouping>

<hierarchy>
- Organize from general to specific
- Use clear categorical divisions
- Maintain parent-child relationships
</hierarchy>

<density>
- Balance completeness with clarity
- Ensure each chunk can stand alone
- Preserve essential context
</density>

<patterns>
- Standardize similar information
- Use consistent formatting for similar data types
- It is appropriate to restructure tables or lists in ways that are more advantageous for sematic matching
- Maintain searchable patterns
</patterns>
</semantic_guidelines>

<output_requirements>
1. Each chunk should be independently meaningful
2. Related information should stay together
3. Format should support efficient matching
4. Original data relationships must be preserved
5. Context should be clear without external references
</output_requirements>

<max_length>${chunkSize}</max_length>

<response>
`;
}
