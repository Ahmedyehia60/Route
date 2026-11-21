"use client";

import {
  CircleCheck,
  Package,
  Warehouse,
  Truck,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, Statistic } from "antd";
import styles from "../shipments.module.css";

const summary: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    label: "Total shipments",
    value: "3,842",
    note: "+14.2% this month",
    icon: Package,
    color: "green",
  },
  {
    label: "In staging",
    value: "412",
    note: "At warehouse",
    icon: Warehouse,
    color: "sage",
  },
  {
    label: "In transit",
    value: "2,918",
    note: "Active deliveries",
    icon: Truck,
    color: "lime",
  },
  {
    label: "On hold",
    value: "48",
    note: "Need review",
    icon: TriangleAlert,
    color: "orange",
  },
  {
    label: "Delivered today",
    value: "464",
    note: "99.1% on time",
    icon: CircleCheck,
    color: "green",
  },
];

export default function ShipmentSummary() {
  return (
    <section className={styles.summaryGrid} aria-label="Shipment summary">
      {summary.map((item) => {
        const Icon = item.icon;

        return (
          <Card className={styles.summaryCard} key={item.label}>
            <div className={styles.summaryTop}>
              <span>{item.label}</span>
              <span className={`${styles.summaryIcon} ${styles[item.color]}`}>
                <Icon size={17} />
              </span>
            </div>
            <Statistic value={item.value} groupSeparator="," />
            <small>{item.note}</small>
          </Card>
        );
      })}
    </section>
  );
}
