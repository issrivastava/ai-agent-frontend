import { Activity, Bot, ShieldCheck, Workflow } from 'lucide-react';

const highlights = [
  { icon: Workflow, text: 'Build multi-agent workflows for support dispatch and data extraction' },
  { icon: ShieldCheck, text: 'Keep a human in the loop for risky actions like refunds' },
  { icon: Activity, text: 'Watch every agent step as it happens' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Bot className="size-6" />
          AI Agent Platform
        </div>
        <div className="space-y-8">
          <h2 className="max-w-md text-3xl font-semibold leading-tight">
            Customer support and data extraction, run by AI agents you control.
          </h2>
          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm opacity-90">
                <Icon className="mt-0.5 size-4 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm opacity-70">Enterprise customer operations</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 bg-muted/40 p-4 lg:bg-background">
        <div className="flex items-center gap-2 text-lg font-semibold lg:hidden">
          <Bot className="size-6" />
          AI Agent Platform
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}