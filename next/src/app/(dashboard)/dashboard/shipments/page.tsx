import ShipmentHeader from "./components/ShipmentHeader";
import ShipmentSummary from "./components/ShipmentSummary";
import ShipmentFilters from "./components/ShipmentFilters";
import ShipmentTable from "./components/ShipmentTable";
import styles from "./shipments.module.css";

export default function ShipmentsPage() {
  return (
    <div className={styles.page}>
      <ShipmentHeader />
      <ShipmentSummary />
      <ShipmentFilters />
      <ShipmentTable />
    </div>
  );
}