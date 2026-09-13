export default function Header() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6">

      {/* Logo */}
      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg">
          🏠
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            BrokerHub
          </h1>

          <p className="text-xs text-slate-500">
            Real Estate CRM
          </p>
        </div>

      </div>

      {/* User */}
      <div className="flex items-center gap-3">

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">
            Owner
          </p>

          <p className="text-xs text-slate-500">
            Administrator
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800">
          👤
        </div>

      </div>

    </header>
  );
}