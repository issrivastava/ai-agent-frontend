const accounts = [
  { role: 'Admin', email: 'admin@example.com', password: 'Admin123' },
  { role: 'Agent', email: 'agent@example.com', password: 'Agent123' },
  { role: 'Viewer', email: 'viewer@example.com', password: 'Viewer123' },
];

export function DemoAccounts() {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') return null;
  return (
    <div className="mt-4 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
      <p className="mb-1 font-medium text-foreground">Demo accounts (mock mode)</p>
      {accounts.map((a) => (
        <p key={a.role}>
          {a.role}: {a.email} / {a.password}
        </p>
      ))}
    </div>
  );
}