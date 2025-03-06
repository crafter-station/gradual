'use client';

import { MarkdownComponents } from '@/components/markdown-components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useI18n } from '@/locales/client';
import {
  BookmarkIcon,
  ExpandIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
} from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

interface Note {
  id: string;
  content: string;
  tags: string[];
  source: 'ai' | 'user';
  lessonId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function NotesTab() {
  const t = useI18n();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Example notes - would come from your DB
  const notes: Note[] = [
    {
      id: '1',
      content: `# Chain Rule in Calculus

The chain rule is a fundamental principle for differentiating composite functions. It's essential for handling complex derivatives and forms the basis for many advanced calculus concepts.

## Core Principle

For functions $f(g(x))$, where $y = f(u)$ and $u = g(x)$, the chain rule states:

$$\\large\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$$

In Leibniz notation:

$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$

## Key Properties
1. Applies to any number of nested functions
2. Preserves the order of composition
3. Essential for implicit differentiation
4. Works with any differentiable functions

## Advanced Applications

For multiple nested functions:

$$y = (f \\circ g \\circ h)(x): \\frac{dy}{dx} = f'(g(h(x))) \\cdot g'(h(x)) \\cdot h'(x)$$

## Common Examples

1. **Trigonometric Composition**
   - If $y = \\sin(x^2)$, then $\\frac{dy}{dx} = \\cos(x^2) \\cdot 2x$
   - For $y = e^{\\sin(x)}$, $\\frac{dy}{dx} = e^{\\sin(x)} \\cdot \\cos(x)$

2. **Power Functions**
   - For $y = (2x + 1)^3$: $\\frac{dy}{dx} = 3(2x + 1)^2 \\cdot 2$
   - If $y = \\sqrt{x^2 + 1}$: $\\frac{dy}{dx} = \\frac{x}{\\sqrt{x^2 + 1}}$

## Applications in Physics
- Velocity and acceleration calculations
- Rate of change in thermodynamic systems
- Wave propagation analysis

## Common Pitfalls
1. Forgetting to apply to all nested functions
2. Incorrect order in multiple chains
3. Missing the multiplication of derivatives

## Practice Problems
1. Find $\\frac{d}{dx}[\\ln(\\cos(x^2))]$
2. Calculate $\\frac{d}{dx}[(x^3 + 1)^4]$
3. Determine $\\frac{d}{dx}[e^{x^2}\\sin(x)]$`,
      tags: ['math', 'calculus', 'chain-rule', 'derivatives'],
      source: 'ai',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      content: `# Quantum Harmonic Oscillator

The quantum harmonic oscillator is a fundamental model in quantum mechanics, describing particles in a parabolic potential well.

## Wave Function

The normalized wave function for the nth energy state is:

$$\\Psi_n(x) = \\frac{1}{\\sqrt{2^n n!}} \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4} H_n\\left(\\sqrt{\\frac{m\\omega}{\\hbar}}x\\right) e^{-\\frac{m\\omega x^2}{2\\hbar}}$$

where $H_n$ are the Hermite polynomials.

## Energy Levels

The energy eigenvalues are quantized:

$$E_n = \\hbar\\omega\\left(n + \\frac{1}{2}\\right)$$

## Key Properties
1. Zero-point energy: $E_0 = \\frac{1}{2}\\hbar\\omega$
2. Equal spacing: $\\Delta E = E_{n+1} - E_n = \\hbar\\omega$
3. Probability density: $|\\Psi_n(x)|^2$

## Applications
- Molecular vibrations
- Phonons in solids
- Electromagnetic field modes
- Ion traps

## Important Relations
- Uncertainty principle: $\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}$
- Creation operator: $a^\\dagger |n\\rangle = \\sqrt{n+1} |n+1\\rangle$
- Annihilation operator: $a|n\\rangle = \\sqrt{n} |n-1\\rangle$`,
      tags: ['physics', 'quantum-mechanics', 'oscillator'],
      source: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      content: `# Chemical Equilibrium & Le Châtelier's Principle

For a general reaction:
$$aA + bB \\rightleftharpoons cC + dD$$

The equilibrium constant $K_c$ is given by:

$$K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$$

## Temperature Dependence
The van 't Hoff equation describes how $K$ varies with temperature:

$$\\ln\\left(\\frac{K_2}{K_1}\\right) = -\\frac{\\Delta H^°}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$

## Free Energy Relationship
The standard Gibbs free energy change is related to $K$:

$$\\Delta G^° = -RT\\ln(K)$$

## Le Châtelier's Principle
System responses to disturbances:

1. **Concentration Changes**
   - Adding reactant → Reaction shifts right
   - Adding product → Reaction shifts left

2. **Temperature Effects**
   - Exothermic: $\\Delta H < 0$
   - Endothermic: $\\Delta H > 0$

3. **Pressure Effects** (gases)
   - Increase: Shifts toward fewer moles
   - Decrease: Shifts toward more moles

## Common Examples
1. Haber Process: $N_2 + 3H_2 \\rightleftharpoons 2NH_3$ $(\\Delta H = -92\\text{ kJ/mol})$
2. Water Auto-ionization: $H_2O \\rightleftharpoons H^+ + OH^-$

## Industrial Applications
- Optimizing reaction conditions
- Maximizing product yield
- Minimizing waste production`,
      tags: ['chemistry', 'equilibrium', 'thermodynamics'],
      source: 'ai',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Custom components for ReactMarkdown

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="space-y-6">
        {/* Header with Search and Create Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('course.notes.search')}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'ai-generated', 'my-notes'].map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
            >
              {t(`course.notes.filters.${filter}` as keyof typeof t)}
            </Badge>
          ))}
        </div>

        {/* Notes Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="group relative overflow-hidden border-border/50 bg-gradient-to-b from-background to-background/30 transition-all duration-300 hover:border-border/80 hover:shadow-lg"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {note.source === 'ai' ? (
                      <SparklesIcon className="h-4 w-4 text-flexoki-blue" />
                    ) : (
                      <BookmarkIcon className="h-4 w-4 text-flexoki-green" />
                    )}
                    <time className="text-muted-foreground text-xs">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => setSelectedNote(note)}
                  >
                    <ExpandIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Preview Content */}
                <div className="prose prose-sm dark:prose-invert relative prose-headings:mb-2 max-h-[200px] overflow-hidden prose-p:leading-relaxed">
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={MarkdownComponents}
                  >
                    {note.content}
                  </ReactMarkdown>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* View Note Modal */}
      <Dialog
        open={selectedNote !== null}
        onOpenChange={(open) => !open && setSelectedNote(null)}
      >
        <DialogContent className="h-[80vh] max-w-3xl">
          <DialogTitle className="sr-only">Note Details</DialogTitle>
          <ScrollArea className="h-full pr-4">
            {selectedNote && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={MarkdownComponents}
                >
                  {selectedNote.content}
                </ReactMarkdown>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Create Note Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="h-[80vh] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Create New Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            {/* Add your note creation form here */}
            <p className="text-muted-foreground">
              Note creation form coming soon...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
