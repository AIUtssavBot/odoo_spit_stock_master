import { listOperations } from "@/lib/data/provider";
import { Badge } from "@/components/ui/badge";
import ValidateOperationButton from "@/components/ValidateOperationButton";

type OperationRow = {
  id: string;
  reference: string | null;
  type: "INCOMING" | "OUTGOING" | "INTERNAL";
  partner: string;
  schedule_date: string;
  source_location: string;
  destination_location: string;
  status: "DRAFT" | "WAITING" | "READY" | "DONE";
};

export const dynamic = "force-dynamic";

export default async function OperationsPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const type = typeof searchParams?.type === "string" ? searchParams?.type : undefined;
  const status = typeof searchParams?.status === "string" ? searchParams?.status : undefined;

  let ops: OperationRow[] = [];
  try {
    ops = await listOperations(type, status);
  } catch (err: any) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Operations</h1>
        <p className="mt-4 text-red-600">Failed to load operations: {err?.message || String(err)}</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Operations</h1>
      <p className="mt-1 text-gray-600">List of Receipts, Deliveries, Internal transfers</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <FilterLink label="All Types" href="/operations" active={!type} />
        <FilterLink label="Receipts" href="/operations?type=INCOMING" active={type === "INCOMING"} />
        <FilterLink label="Deliveries" href="/operations?type=OUTGOING" active={type === "OUTGOING"} />
        <FilterLink label="Internal" href="/operations?type=INTERNAL" active={type === "INTERNAL"} />

        <span className="mx-2 text-gray-400">|</span>
        <FilterLink label="All Status" href={`/operations${type ? `?type=${type}` : ""}`} active={!status} />
        <FilterLink label="Draft" href={`/operations?${type ? `type=${type}&` : ""}status=DRAFT`} active={status === "DRAFT"} />
        <FilterLink label="Waiting" href={`/operations?${type ? `type=${type}&` : ""}status=WAITING`} active={status === "WAITING"} />
        <FilterLink label="Ready" href={`/operations?${type ? `type=${type}&` : ""}status=READY`} active={status === "READY"} />
        <FilterLink label="Done" href={`/operations?${type ? `type=${type}&` : ""}status=DONE`} active={status === "DONE"} />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Reference</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Partner</th>
              <th className="px-3 py-2 text-left">Schedule Date</th>
              <th className="px-3 py-2 text-left">Source</th>
              <th className="px-3 py-2 text-left">Destination</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ops.map((op) => (
              <tr key={op.id} className="border-t odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 font-mono">{op.reference ?? "(auto)"}</td>
                <td className="px-3 py-2">{op.type}</td>
                <td className="px-3 py-2">{op.partner}</td>
                <td className="px-3 py-2">{new Date(op.schedule_date).toLocaleString()}</td>
                <td className="px-3 py-2">{op.source_location}</td>
                <td className="px-3 py-2">{op.destination_location}</td>
                <td className="px-3 py-2">
                  <Badge
                    variant={
                      op.status === "DRAFT"
                        ? "secondary"
                        : op.status === "WAITING"
                        ? "warning"
                        : op.status === "DONE"
                        ? "default"
                        : "default"
                    }
                  >
                    {op.status}
                  </Badge>
                </td>
                <td className="px-3 py-2">
                  <ValidateOperationButton id={op.id} disabled={op.status !== "READY"} />
                </td>
              </tr>
            ))}
            {ops.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={8}>
                  No operations yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={`rounded px-2 py-1 text-sm ${active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
    >
      {label}
    </a>
  );
}