import type { CSSProperties } from 'react';

type PrismTheme = {
  [key: string]: CSSProperties;
};

export const flexokiVesper: PrismTheme = {
  'pre[class*="language-"]': {
    background: '#1c1b1a',
    color: '#FFFCF0',
  },
  'code[class*="language-"]': {
    background: '#1c1b1a',
    color: '#FFFCF0',
  },
  comment: {
    color: '#575653',
  },
  prolog: {
    color: '#575653',
  },
  doctype: {
    color: '#575653',
  },
  cdata: {
    color: '#575653',
  },
  punctuation: {
    color: '#FFFCF0',
  },
  property: {
    color: '#FFFCF0',
  },
  tag: {
    color: '#B7B5AC',
  },
  boolean: {
    color: '#FCC192',
  },
  number: {
    color: '#FCC192',
  },
  constant: {
    color: '#FFFCF0',
  },
  symbol: {
    color: '#87D3C3',
  },
  selector: {
    color: '#FCC192',
  },
  'attr-name': {
    color: '#FCC192',
  },
  string: {
    color: '#87D3C3',
  },
  char: {
    color: '#87D3C3',
  },
  builtin: {
    color: '#FFFCF0',
  },
  operator: {
    color: '#B7B5AC',
  },
  entity: {
    color: '#FCC192',
  },
  url: {
    color: '#87D3C3',
  },
  variable: {
    color: '#FFFCF0',
  },
  atrule: {
    color: '#FCC192',
  },
  'attr-value': {
    color: '#87D3C3',
  },
  function: {
    color: '#FCC192',
  },
  keyword: {
    color: '#B7B5AC',
  },
  regex: {
    color: '#87D3C3',
  },
  important: {
    color: '#B7B5AC',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  deleted: {
    color: '#B7B5AC',
  },
  inserted: {
    color: '#87D3C3',
  },
  namespace: {
    color: '#FCC192',
  },
};
