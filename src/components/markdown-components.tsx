import { flexokiVesper } from '@/components/theme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import 'katex/dist/katex.min.css';

interface CodeNodePosition {
  start: { line: number; column: number; offset: number };
  end: { line: number; column: number; offset: number };
}

interface CodeNode {
  type: string;
  tagName: string;
  properties: Record<string, unknown>;
  position: CodeNodePosition;
}

export const MarkdownComponents: Record<
  string,
  React.ComponentType<{ children: React.ReactNode }>
> = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="mt-8 mb-4 scroll-m-20 border-b pb-2 font-bold text-2xl tracking-tight lg:text-3xl">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-8 mb-4 scroll-m-20 border-b pb-2 font-semibold text-xl tracking-tight lg:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="mt-8 mb-4 scroll-m-20 font-semibold text-lg tracking-tight lg:text-xl">
      {children}
    </h3>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="mt-2 list-disc pl-2">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="mt-6 border-flexoki-blue border-l-2 pl-6 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  code: ({
    className,
    children,
    ...props
  }: { className?: string; children: React.ReactNode; node?: CodeNode }) => {
    const match = /language-(\w+)/.exec(className || '');

    const node = props.node as CodeNode;
    const isCodeBlock =
      node?.position?.start?.line !== node?.position?.end?.line ||
      className?.includes('language-');

    return !isCodeBlock ? (
      <code className={className} {...props}>
        {children}
      </code>
    ) : (
      <SyntaxHighlighter
        style={flexokiVesper}
        language={match?.[1] || 'cpp'}
        className="p-4"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  },
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="border-b bg-muted/50">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      {children}
    </tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
      {children}
    </td>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="leading-[1.538rem] [&:not(:first-child)]:mt-4">{children}</p>
  ),
};
