"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  MapPinned,
  Package,
  Route,
  Settings,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import styles from "../dashboard.module.css";
import { NavItem } from "@/domain/dashboard";

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "OPERATIONS",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Dispatch Board", icon: Route },
      { label: "Trip Planning", icon: MapPinned },
      { label: "Live Tracking", icon: Truck },
      { label: "Exceptions Center", icon: AlertTriangle, count: "6" },
    ],
  },
  {
    title: "LOGISTICS",
    items: [
      { label: "Shipments", icon: Package, href: "/dashboard/shipments" },
      { label: "Warehouses", icon: Warehouse },
      { label: "Fleet & Drivers", icon: Truck },
      { label: "Customers", icon: Users },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Analytics", icon: BarChart3 },
      { label: "Settings", icon: Settings },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/dashboard" className={styles.brand}>
        <span className={styles.brandMark}>R</span>
        <span>
          <strong>RouteFlow</strong>
          <small>LOGISTICS PLATFORM</small>
        </span>
      </Link>

      <nav className={styles.navigation} aria-label="Main navigation">
        {sections.map((section) => (
          <section className={styles.navSection} key={section.title}>
            <h2 className={styles.navHeading}>{section.title}</h2>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === pathname;
              const className = isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem;

              const contents = (
                <>
                  <Icon size={17} />
                  <span>{item.label}</span>
                  {item.count && (
                    <small className={styles.navCount}>{item.count}</small>
                  )}
                </>
              );

              return item.href ? (
                <Link
                  href={item.href}
                  className={className}
                  aria-current={isActive ? "page" : undefined}
                  key={item.label}
                >
                  {contents}
                </Link>
              ) : (
                <div className={className} key={item.label}>
                  {contents}
                </div>
              );
            })}
          </section>
        ))}
      </nav>
    </aside>
  );
}