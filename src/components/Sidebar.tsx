"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Package, ArrowLeftRight, LayoutDashboard, Settings, History, User, Edit } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/operations", label: "Operations", icon: ArrowLeftRight },
  { href: "/moves", label: "Move History", icon: History },
  { href: "/adjustments", label: "Adjustments", icon: Edit },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Boxes className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-semibold">StockMaster</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon as any;
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-blue-50 ${active ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Link href="/profile" className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-50 text-gray-700">
          <User className="h-4 w-4" />
          My Profile
        </Link>
        <Link href="/auth/login" className="mt-2 block rounded px-3 py-2 text-sm text-blue-700 hover:bg-blue-50">
          Logout
        </Link>
      </div>
    </aside>
  );
}