import { Info, type LucideIcon } from 'lucide-react';

export type PageGuideStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function PageGuide({ steps }: { steps: PageGuideStep[] }) {
  return (
    <section aria-label="How this page works" className="mb-5 rounded-xl border bg-muted/30 p-3">
      <p className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        <Info className="size-3" />
        How this works
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-2.5 rounded-lg px-1.5 py-1">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border bg-card text-brand-1">
              <Icon className="size-3.5" />
            </span>
            <div>
              <p className="text-xs font-medium">{title}</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
