"use client";

import { Download, Plus, Truck } from "lucide-react";
import { Button } from "antd";
import styles from "../shipments.module.css";

export default function ShipmentHeader() {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>LOGISTICS / SHIPMENTS</p>
        <h1>Shipment operations</h1>
        <p className={styles.subtitle}>
          Manage shipments, track delivery progress, and review exceptions.
        </p>
      </div>

      <div className={styles.headerActions}>
        <Button className={styles.secondaryButton} icon={<Download size={16} />}>
          Export manifest
        </Button>
        <Button className={styles.secondaryButton} icon={<Truck size={16} />}>
          Bulk dispatch
        </Button>
        <Button
          type="primary"
          className={styles.primaryButton}
          icon={<Plus size={16} />}
        >
          New shipment
        </Button>
      </div>
    </header>
  );
}
