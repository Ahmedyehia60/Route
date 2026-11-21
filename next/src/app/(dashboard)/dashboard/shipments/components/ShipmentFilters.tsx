"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button, Input, Segmented, Select } from "antd";
import styles from "../shipments.module.css";

const statuses = [
  ["All shipments", "3,842", true],
  ["Pending intake", "18", false],
  ["Staged", "412", false],
  ["In transit", "2,918", false],
  ["On hold", "48", false],
] as const;

export default function ShipmentFilters() {
  return (
    <section className={styles.filters}>
      <div className={styles.filterControls}>
        <Input
          className={styles.searchBox}
          prefix={<Search size={17} />}
          placeholder="Search by tracking number, customer, or city"
          aria-label="Search shipments"
        />
        <Select
          className={styles.filterSelect}
          aria-label="Filter by service tier"
          defaultValue="all"
          options={[
            { value: "all", label: "All service tiers" },
            { value: "priority", label: "Priority" },
            { value: "standard", label: "Standard" },
          ]}
        />
        <Select
          className={styles.filterSelect}
          aria-label="Filter by corridor"
          defaultValue="all"
          options={[
            { value: "all", label: "All corridors" },
            { value: "east-bay", label: "East Bay" },
            { value: "downtown", label: "Downtown" },
          ]}
        />
        <Button
          className={styles.filterButton}
          icon={<SlidersHorizontal size={17} />}
          aria-label="More filters"
        />
      </div>

      <Segmented
        className={styles.statusTabs}
        defaultValue="All shipments"
        options={statuses.map(([label, count]) => ({
          label: (
            <span className={styles.statusOption}>
              {label}<b>{count}</b>
            </span>
          ),
          value: label,
        }))}
      />
    </section>
  );
}
