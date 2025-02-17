interface SummarizeChunkInput {
  chunk: string;
}

export function getSummarizeChunkPrompt({
  chunk,
}: SummarizeChunkInput): string {
  return `<task>
Summarize the following text concisely, capturing the essential information and key points. Aim for approximately 10% of the original length.
</task>

<guidelines>
- Focus on main ideas and critical details
- Use clear, direct language
- Maintain factual accuracy
- Preserve technical terms and proper nouns
- Skip meta-references to "chunks" or "documents"
- Avoid introductory phrases or meta-commentary
</guidelines>

<output_format>
Provide a concise summary that:
1. Starts directly with the content
2. Uses complete sentences
3. Maintains logical flow
4. Excludes meta-commentary
</output_format>

<example>
<input>
As it reached a much larger audience, Szpilman's memoir was widely praised. Britain's Independent described it as "a compelling, harrowing masterpiece"; it is "one of the most powerful accounts ever written" of the era declared another leading British daily. The book's description of the famed Warsaw teacher and writer Janusz Korczak has been described as "overwhelmingly powerful and poignant." Korczak declined to save himself from deportation to Treblinka; instead, he walked with the children of his orphanage to the deportation site and ultimately escorted them "into the next world," as Szpilman related: 
</input>

<output>
Szpilman's memoir was widely praised, particularly for its powerful account of Janusz Korczak, who chose to accompany his orphanage children to Treblinka rather than save himself.
</output>
</example>

<input>
${chunk}
</input>

<output>`;
}
