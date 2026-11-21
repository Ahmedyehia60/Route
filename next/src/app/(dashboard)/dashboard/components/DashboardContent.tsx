"use client";

import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  ChevronDown,
  LogOut,
  PackageCheck,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { Button, Card, Input, Progress, Statistic, Tag } from "antd";
import styles from "../dashboard.module.css";

type Props = {
  onLogout: () => void;
  isLoggingOut: boolean;
};

const trips = [
  {
    id: "TR-8842",
    name: "East Bay Express",
    driver: "Elena Rostova",
    route: "Oakland → Fremont",
    progress: 82,
    status: "On time",
    statusStyle: "green",
  },
  {
    id: "TR-8849",
    name: "Downtown Priority",
    driver: "Marcus Vance",
    route: "Central Hub → Pier 14",
    progress: 45,
    status: "At risk",
    statusStyle: "orange",
  },
  {
    id: "TR-8851",
    name: "Metro Courier Express",
    driver: "David Kim",
    route: "Airport → Midtown",
    progress: 95,
    status: "Final leg",
    statusStyle: "green",
  },
];

export default function DashboardContent({ onLogout, isLoggingOut }: Props) {
  return (
    <>
      <header className={styles.topbar}>
        <Input
          className={styles.search}
          prefix={<Search size={17} />}
          placeholder="Search shipments, trips, or drivers"
          aria-label="Search shipments, trips, or drivers"
        />

        <div className={styles.topbarActions}>
          <Button
            type="primary"
            className={styles.primaryButton}
            icon={<Plus size={16} />}
          >
            New shipment
          </Button>

          <Button
            type="text"
            className={styles.iconButton}
            icon={<Bell size={18} />}
            aria-label="Notifications"
          />

          <div className={styles.profile}>
            <span className={styles.avatar}>A</span>
            <span className={styles.profileText}>
              <strong>Administrator</strong>
              <small>Operations</small>
            </span>
            <ChevronDown size={15} />
          </div>

          <Button
            type="text"
            className={styles.logoutButton}
            icon={<LogOut size={17} />}
            onClick={onLogout}
            loading={isLoggingOut}
            aria-label="Log out"
          />
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.pageHeading}>
          <div>
            <p className={styles.eyebrow}>LIVE OPERATIONS</p>
            <h1>Operations dashboard</h1>
            <p className={styles.subheading}>
              A clear view of today’s deliveries, fleet, and exceptions.
            </p>
          </div>
          <Button className={styles.secondaryButton}>
            Today <ChevronDown size={15} />
          </Button>
        </div>

        <section className={styles.metrics} aria-label="Operations summary">
          <Metric
            title="Shipments in transit"
            value="1,428"
            note="This week"
            icon={<Truck size={19} />}
          />
          <Metric
            title="On-time delivery"
            value="98.2%"
            note="Above target"
            icon={<PackageCheck size={19} />}
          />
          <Metric
            title="Active fleet"
            value="84 / 92"
            note="8 vehicles available"
            icon={<Truck size={19} />}
          />
          <Metric
            title="Open exceptions"
            value="6"
            note="3 need attention"
            icon={<AlertCircle size={19} />}
          />
        </section>

        <div className={styles.panels}>
          <Card className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Active trips</h2>
                <p>Live progress across your fleet</p>
              </div>
              <Tag className={styles.panelBadge}>3 active</Tag>
            </div>

            {trips.map((trip) => (
              <article className={styles.trip} key={trip.id}>
                <div className={styles.tripHeading}>
                  <div>
                    <strong>{trip.id}</strong> <span>{trip.name}</span>
                    <p>
                      {trip.driver} · {trip.route}
                    </p>
                  </div>
                  <Tag
                    className={`${styles.status} ${styles[trip.statusStyle]}`}
                  >
                    {trip.status}
                  </Tag>
                </div>
                <div className={styles.progressLine}>
                  <Progress
                    className={styles.tripProgress}
                    percent={trip.progress}
                    showInfo={false}
                    size={7}
                    strokeColor="#8bae54"
                    railColor="#edf0e9"
                  />
                  <span>{trip.progress}%</span>
                </div>
              </article>
            ))}
          </Card>

          <Card className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Priority exceptions</h2>
                <p>Items that may need a response</p>
              </div>
              <Tag className={`${styles.panelBadge} ${styles.warningBadge}`}>
                6 open
              </Tag>
            </div>

            <Exception
              type="DELAY · 8 MIN AGO"
              title="Downtown Cluster"
              detail="TR-8849 · 12 min behind schedule"
              color="orange"
            />
            <Exception
              type="VEHICLE · 22 MIN AGO"
              title="Inspection required"
              detail="V-208 · East Bay Express"
              color="red"
            />
            <Exception
              type="DELIVERY · 41 MIN AGO"
              title="Recipient unavailable"
              detail="SH-99202 · Address needs review"
              color="gold"
            />
          </Card>

          <Card className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Hub capacity</h2>
                <p>Metropolitan Hub #04</p>
              </div>
              <Statistic
                className={styles.capacityStatistic}
                value={78}
                suffix="%"
              />
            </div>
            <Progress
              percent={78}
              showInfo={false}
              strokeColor="#c6f36b"
              railColor="#edf0e9"
            />
            <div className={styles.capacityLabels}>
              <span>3,240 packages staged</span>
              <span>Capacity: 4,150</span>
            </div>
          </Card>

          <Card className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <h2>Delivery performance</h2>
                <p>Weekly on-time deliveries</p>
              </div>
              <Statistic
                className={styles.capacityStatistic}
                value={98.2}
                precision={1}
                suffix="%"
              />
            </div>
            <Tag color="green" className={styles.performanceNote}>
              <ArrowUpRight size={15} /> Improving this week
            </Tag>
          </Card>
        </div>
      </div>
    </>
  );
}

function Metric({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: ReactNode;
}) {
  return (
    <Card className={styles.metric}>
      <div className={styles.metricTop}>
        <span>{title}</span>
        <i>{icon}</i>
      </div>
      <Statistic value={value} />
      <small>{note}</small>
    </Card>
  );
}

function Exception({
  type,
  title,
  detail,
  color,
}: {
  type: string;
  title: string;
  detail: string;
  color: string;
}) {
  return (
    <article className={styles.exception}>
      <Tag color={color}>{type}</Tag>
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
    </article>
  );
}
