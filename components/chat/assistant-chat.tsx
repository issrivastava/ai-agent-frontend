'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  Bot,
  MessageSquare,
  MessageSquarePlus,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useLocalStore } from '@/hooks/use-local-store';
import { cn } from '@/lib/utils';

type Role = 'user' | 'assistant';

type Message = {
  id: string;
  role: Role;
  text: string;
  links?: { label: string; href: string }[];
  at: number;
};

type Reply = { text: string; links?: { label: string; href: string }[] };

const STORE_KEY = 'agent-platform:chat-history';
const EMPTY_MESSAGES: Message[] = [];
const THINKING_MS = 750;
const MAX_MESSAGES = 50;

const starters = [
  'How do approvals work?',
  'How do I filter tickets?',
  'Where do I see failed runs?',
  'What can each role do?',
];

function answer(input: string): Reply {
  const q = input.toLowerCase();
  const has = (...words: string[]) => words.some((word) => q.includes(word));

  if (has('approve', 'approval', 'reject', 'waiting', 'gate')) {
    return {
      text: 'Any step that can change money or customer data pauses the run. You review the exact tool and payload, then approve or reject — the decision is written to the run history.',
      links: [{ label: 'Review runs', href: '/runs' }],
    };
  }
  if (has('filter', 'search', 'find', 'sort', 'date')) {
    return {
      text: 'The tickets page has status, priority, agent, and date filters, plus a search box. Active filters show up as chips you can remove one by one, and the whole filter state lives in the URL so you can share or bookmark it.',
      links: [{ label: 'Open tickets', href: '/tickets' }],
    };
  }
  if (has('fail', 'error', 'broken')) {
    return {
      text: 'Failed runs appear in the run list with a failed badge, and the notification bell flags them too. Open a run to see which step failed, the tool output, and the timing.',
      links: [{ label: 'Run history', href: '/runs' }],
    };
  }
  if (has('ticket', 'queue', 'support', 'customer', 'reassign')) {
    return {
      text: 'The support queue is where agents triage incoming requests. Open a row for the full context — status timeline, customer, priority, and current owner — and reassign it if it is with the wrong agent.',
      links: [{ label: 'Open the queue', href: '/tickets' }],
    };
  }
  if (has('workflow', 'playbook', 'prompt', 'compose', 'build')) {
    return {
      text: 'Workflows are ordered playbooks: each agent gets a role, a prompt, and only the tools it needs. Admins create and edit them; agents run the active ones.',
      links: [
        { label: 'Workflows', href: '/workflows' },
        { label: 'New workflow', href: '/workflows/new' },
      ],
    };
  }
  if (has('extract', 'pdf', 'document', 'ocr', 'upload', 'invoice', 'csv')) {
    return {
      text: 'Upload a PDF, image, or CSV and agents pull out structured fields with confidence scores. Low-confidence values are flagged for review before you export to CSV or JSON.',
      links: [{ label: 'Data extraction', href: '/extractions' }],
    };
  }
  if (has('role', 'permission', 'admin', 'viewer', 'agent access', 'access')) {
    return {
      text: 'Admins manage people, roles, and workflows. Agents run workflows, approve steps, reassign tickets, and upload documents. Viewers are read-only across everything.',
      links: [{ label: 'Roles in settings', href: '/settings' }],
    };
  }
  if (has('dark', 'light', 'theme', 'mode')) {
    return {
      text: 'Use the sun/moon button in the top bar, or open the command palette and search for "theme". The platform follows your system theme until you pick one.',
    };
  }
  if (has('keyboard', 'command', 'shortcut', 'palette', '⌘')) {
    return {
      text: 'Press Ctrl or Cmd + K anywhere in the workspace to open the command palette — jump to pages, create workflows, upload documents, or switch theme.',
    };
  }
  if (has('run', 'history', 'audit', 'trace')) {
    return {
      text: 'Every run records which agent acted, which tool it used, how long it took, and who approved each step. That is your audit trail.',
      links: [{ label: 'Agent runs', href: '/runs' }],
    };
  }
  if (has('hello', 'hi ', 'hey', 'who are you')) {
    return {
      text: 'I am the platform assistant. I can explain how tickets, workflows, runs, approvals, and extraction fit together — and link you straight to the right page.',
    };
  }
  return {
    text: 'I can explain tickets, workflows, runs, approvals, extraction, roles, and keyboard shortcuts. Ask me about any of those — or pick one of the suggestions below.',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Tickets', href: '/tickets' },
    ],
  };
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </span>
  );
}

function StarterChip({ label, onSelect }: { label: string; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="rounded-full border bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-brand-1/40 hover:bg-brand-soft hover:text-brand-1"
    >
      {label}
    </button>
  );
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed',
          isUser ? 'bg-brand-gradient text-white' : 'bg-muted text-foreground ring-1 ring-border',
        )}
      >
        {!isUser && (
          <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-brand-1">
            <Sparkles className="size-3" />
            Assistant
          </span>
        )}
        <p>{message.text}</p>
        {message.links && (
          <span className="mt-2 flex flex-wrap gap-1.5">
            {message.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md border bg-background px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
              >
                {link.label} →
              </a>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

export function AssistantChat() {
  const [messages, setMessages] = useLocalStore<Message[]>(STORE_KEY, EMPTY_MESSAGES);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [pending, setPending] = useState<Reply | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!typing || !pending) return;
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev.slice(-(MAX_MESSAGES - 1)),
        {
          id: newId(),
          role: 'assistant',
          text: pending.text,
          links: pending.links,
          at: Date.now(),
        },
      ]);
      setTyping(false);
      setPending(null);
    }, THINKING_MS);
    return () => clearTimeout(timer);
  }, [typing, pending, setMessages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length, typing, open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((prev) => [
      ...prev.slice(-(MAX_MESSAGES - 1)),
      { id: newId(), role: 'user', text: trimmed, at: Date.now() },
    ]);
    setPending(answer(trimmed));
    setTyping(true);
    setDraft('');
  };

  const clear = () => setMessages(EMPTY_MESSAGES);

  return (
    <>
      {open ? (
        <section
          aria-label="Platform assistant"
          className="fixed right-4 bottom-20 z-50 flex h-[26rem] w-[calc(100vw-2rem)] max-w-96 flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl sm:right-6"
        >
          <header className="flex items-center gap-2.5 border-b bg-linear-to-r from-brand-soft to-card px-3 py-2.5">
            <span className="bg-brand-gradient shadow-brand flex size-8 shrink-0 items-center justify-center rounded-lg text-white">
              <Bot className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Platform assistant</p>
              <p className="text-[11px] text-muted-foreground">
                Answers about tickets, runs, and guardrails
              </p>
            </div>
            <button
              type="button"
              aria-label="Clear conversation"
              onClick={clear}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Trash2 className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </header>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 space-y-3 overflow-y-auto p-3"
          >
            {messages.length === 0 && !typing && (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-1">
                  <MessageSquarePlus className="size-5" />
                </span>
                <p className="text-sm font-medium">Ask me anything about the platform</p>
                <p className="text-xs text-muted-foreground">
                  I explain how the workspace fits together and link you to the right page.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}
            {typing && (
              <div className="flex justify-start">
                <span className="rounded-2xl bg-muted px-3 py-2 ring-1 ring-border">
                  <TypingDots />
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 px-3 pt-1 pb-2">
            {starters.map((label) => (
              <StarterChip key={label} label={label} onSelect={() => send(label)} />
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
            className="flex items-center gap-2 border-t p-2"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about tickets, runs, approvals…"
              aria-label="Message the assistant"
              className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!draft.trim() || typing}
              className="bg-brand-gradient shadow-brand flex size-9 shrink-0 items-center justify-center rounded-lg text-white transition-[filter,opacity] hover:brightness-105 disabled:opacity-50"
            >
              {typing ? <Send className="size-4" /> : <ArrowUp className="size-4" />}
            </button>
          </form>
        </section>
      ) : (
        <button
          type="button"
          aria-label="Open platform assistant"
          aria-expanded={false}
          onClick={() => setOpen(true)}
          className="bg-brand-gradient shadow-brand fixed right-4 bottom-4 z-50 flex size-12 items-center justify-center rounded-full text-white transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-105 sm:right-6"
        >
          <MessageSquare className="size-5" />
        </button>
      )}
    </>
  );
}
