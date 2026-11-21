"use client";

import { Button, Table, Tag, type TableColumnsType } from "antd";
import { Eye, MapPin, MoreHorizontal } from "lucide-react";
import styles from "../shipments.module.css";
import { Shipment } from "@/domain/shipment";

const shipments: Shipment[] = [
  {
    tracking: "RF-94201-B",
    bol: "BOL #BL-88401",
    shipper: "BioMed Labs Inc.",
    origin: "Boston Bio-Hub Core 4",
    consignee: "St. Jude Central Clinical",
    destination: "West End Medical Campus",
    cargo: "Cold chain · 2–8°C",
    details: "140 kg · 4 specimen totes",
    stage: "In transit",
    location: "I-90 West · Bound Mile 42",
    carrier: "Van-204 · Marcus Vance",
    sla: "Today, 14:15",
    status: "On track",
    tone: "transit",
  },
  {
    tracking: "RF-93910-E",
    bol: "BOL #BL-88290",
    shipper: "Apex Silicon Foundry",
    origin: "Austin Gate B",
    consignee: "Nexa Robotics Core 3",
    destination: "Cambridge Tech District",
    cargo: "Fragile · Shock sensor",
    details: "420 kg · 2 reinforced crates",
    stage: "Staged",
    location: "Bay 04 · Ready for dispatch",
    carrier: "Unassigned",
    sla: "Today, 16:30",
    status: "Ready",
    tone: "staged",
  },
  {
    tracking: "RF-93882-C",
    bol: "BOL #BL-88114",
    shipper: "Tartan Industrial Heavy",
    origin: "Detroit Heavy Rail Yard",
    consignee: "Port Terminal Gantry 8",
    destination: "Harborview Intermodal Dock",
    cargo: "Hazmat · Class 3",
    details: "3,450 kg · Steel pallets",
    stage: "On hold",
    location: "Customs verification",
    carrier: "Intermodal Rail Car 609",
    sla: "Tomorrow, 09:00",
    status: "Review needed",
    tone: "hold",
  },
  {
    tracking: "RF-93704-D",
    bol: "BOL #BL-87902",
    shipper: "OmniCorp Logistics",
    origin: "Secured Storage Vault B",
    consignee: "Financial Tower Suite 400",
    destination: "Downtown Financial Core",
    cargo: "Secured · High value",
    details: "45 kg · 3 armored satchels",
    stage: "Out for delivery",
    location: "Downtown · 4th & Market",
    carrier: "TRK-108 · Sarah Jenkins",
    sla: "Today, 13:45",
    status: "On time",
    tone: "transit",
  },
  {
    tracking: "RF-93650-M",
    bol: "BOL #BL-87740",
    shipper: "Solstice Healthcare",
    origin: "North Regional Distribution",
    consignee: "Green Valley Senior Living",
    destination: "West Ridge Medical Wing",
    cargo: "Ambient pharma",
    details: "65 kg · 8 insulated cartons",
    stage: "Delivered",
    location: "Delivered · 11:20 EST",
    carrier: "Sprinter Unit #12",
    sla: "Completed",
    status: "On time",
    tone: "delivered",
  },
];

function TwoLineCell({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className={styles.tableCell}>
      <strong>{primary}</strong>
      <span>{secondary}</span>
    </div>
  );
}

const columns: TableColumnsType<Shipment> = [
  {
    title: "Tracking ID",
    dataIndex: "tracking",
    width: 145,
    render: (_value, row) => <TwoLineCell primary={row.tracking} secondary={row.bol} />,
  },
  {
    title: "Shipper & origin",
    dataIndex: "shipper",
    width: 185,
    render: (_value, row) => <TwoLineCell primary={row.shipper} secondary={row.origin} />,
  },
  {
    title: "Consignee & destination",
    dataIndex: "consignee",
    width: 205,
    render: (_value, row) => <TwoLineCell primary={row.consignee} secondary={row.destination} />,
  },
  {
    title: "Cargo",
    dataIndex: "cargo",
    width: 175,
    render: (_value, row) => (
      <div className={styles.tableCell}>
        <Tag className={styles.cargoTag}>{row.cargo}</Tag>
        <span>{row.details}</span>
      </div>
    ),
  },
  {
    title: "Current stage",
    dataIndex: "stage",
    width: 195,
    render: (_value, row) => (
      <div className={styles.tableCell}>
        <Tag className={`${styles.stageTag} ${styles[row.tone]}`}>{row.stage}</Tag>
        <span><MapPin size={13} /> {row.location}</span>
      </div>
    ),
  },
  {
    title: "Assigned carrier",
    dataIndex: "carrier",
    width: 175,
  },
  {
    title: "SLA due",
    dataIndex: "sla",
    width: 135,
    render: (_value, row) => <TwoLineCell primary={row.sla} secondary={row.status} />,
  },
  {
    title: "Actions",
    key: "actions",
    width: 95,
    render: (_value, row) => (
      <div className={styles.rowActions}>
        <Button type="text" aria-label={`View ${row.tracking}`} icon={<Eye size={17} />} />
        <Button type="text" aria-label={`More actions for ${row.tracking}`} icon={<MoreHorizontal size={17} />} />
      </div>
    ),
  },
];

export default function ShipmentTable() {
  return (
    <section className={styles.tableCard}>
      <div className={styles.tableHeading}>
        <div>
          <h2>Shipment manifest</h2>
          <p>Showing sample shipment records</p>
        </div>
        <span className={styles.tableHint}>Static preview</span>
      </div>

      <Table<Shipment>
        className={styles.shipmentTable}
        columns={columns}
        dataSource={shipments}
        rowKey="tracking"
        size="middle"
        scroll={{ x: 1255 }}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total} sample shipments`,
        }}
      />
    </section>
  );
}
