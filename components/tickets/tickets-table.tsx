'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable } from '@/components/shared/data-table';
import { FilterBar, type FilterChip } from '@/components/shared/filter-bar';
import { FilterSelect } from '@/components/shared/filter-select';
import { SuggestionChips } from '@/components/shared/suggestion-chips';
import { useTickets } from '@/hooks/useTickets';
import { Eraser, Plus } from 'lucide-react';
import {
  agents,
  rangeCutoff,
  rangeLabels,
  ticketPriorities,
  ticketRanges,
  ticketStatuses,
  type TicketPriority,
  type TicketRange,
  type TicketStatus,
} from '@/types/ticket';
import { ticketColumns } from './ticket-columns';
import { TicketDrawer } from './ticket-drawer';

const EMPTY: never[] = [];
const SEARCH_DEBOUNCE_MS = 300;

export function TicketsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filters live in the URL so a filtered view can be shared and restored.
  const status = (searchParams.get('status') as TicketStatus | null) ?? 'all';
  const priority = (searchParams.get('priority') as TicketPriority | null) ?? 'all';
  const agent = searchParams.get('agent') ?? 'all';
  const range = (searchParams.get('range') as TicketRange | null) ?? 'all';
  const search = searchParams.get('q') ?? '';

  const setParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === 'all') params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // Debounced search: keep keystrokes local, push to the URL when typing pauses.
  // Refs are only touched inside effects so no prop ever closes over them.
  const [searchDraft, setSearchDraft] = useState(search);
  const committedSearch = useRef(search);

  useEffect(() => {
    if (search === committedSearch.current) return;
    committedSearch.current = search;
    setSearchDraft(search);
  }, [search]);

  useEffect(() => {
    if (searchDraft === committedSearch.current) return;
    const timer = setTimeout(() => {
      committedSearch.current = searchDraft;
      setParams({ q: searchDraft });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft, search]);

  const onSearchChange = (value: string) => setSearchDraft(value);

  const clearSearch = () => {
    setSearchDraft('');
    setParams({ q: '' });
  };

  const cutoff = useMemo(() => rangeCutoff(range), [range]);
  const filters = useMemo(
    () => ({
      status: status === 'all' ? undefined : status,
      priority: priority === 'all' ? undefined : priority,
      assignedAgent: agent === 'all' ? undefined : agent,
      createdAfter: cutoff ? cutoff.toISOString() : undefined,
    }),
    [status, priority, agent, cutoff],
  );

  const { data, isLoading, isError, refetch } = useTickets(filters);
  const rows = data ?? EMPTY;

  const chips: FilterChip[] = [];
  if (status !== 'all')
    chips.push({
      id: 'status',
      label: `Status: ${status}`,
      onRemove: () => setParams({ status: 'all' }),
    });
  if (priority !== 'all')
    chips.push({
      id: 'priority',
      label: `Priority: ${priority}`,
      onRemove: () => setParams({ priority: 'all' }),
    });
  if (agent !== 'all')
    chips.push({
      id: 'agent',
      label: `Agent: ${agent}`,
      onRemove: () => setParams({ agent: 'all' }),
    });
  if (range !== 'all')
    chips.push({
      id: 'range',
      label: rangeLabels[range],
      onRemove: () => setParams({ range: 'all' }),
    });
  if (search) chips.push({ id: 'q', label: `“${search}”`, onRemove: clearSearch });

  return (
    <>
      <DataTable
        columns={ticketColumns}
        data={rows}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        searchPlaceholder="Search tickets…"
        search={searchDraft}
        onSearchChange={onSearchChange}
        emptyTitle="No tickets found"
        emptyDescription="Nothing matches right now. Clear your search or filters, or check back as new requests arrive."
        emptyAction={
          <SuggestionChips
            suggestions={[
              ...(chips.length > 0 || searchDraft
                ? [
                    {
                      label: 'Clear search & filters',
                      icon: Eraser,
                      onClick: () => {
                        setSearchDraft('');
                        router.replace(pathname, { scroll: false });
                      },
                    },
                  ]
                : []),
              { label: 'New workflow', icon: Plus, href: '/workflows/new' },
            ]}
          />
        }
        onRowClick={(ticket) => setSelectedId(ticket.id)}
        toolbar={
          <FilterBar
            chips={chips}
            onClearAll={() => {
              setSearchDraft('');
              router.replace(pathname, { scroll: false });
            }}
          >
            <FilterSelect
              label="Statuses"
              value={status}
              onChange={(v) => setParams({ status: v })}
              options={ticketStatuses}
            />
            <FilterSelect
              label="Priorities"
              value={priority}
              onChange={(v) => setParams({ priority: v })}
              options={ticketPriorities}
            />
            <FilterSelect
              label="Agents"
              value={agent}
              onChange={(v) => setParams({ agent: v })}
              options={agents}
            />
            <FilterSelect
              label="Dates"
              value={range}
              onChange={(v) => setParams({ range: v })}
              options={ticketRanges.filter((r) => r !== 'all')}
              allLabel={rangeLabels.all}
            />
          </FilterBar>
        }
      />
      <TicketDrawer ticketId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
