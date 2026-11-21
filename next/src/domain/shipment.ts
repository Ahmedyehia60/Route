export type Shipment = {
  tracking: string;
  bol: string;
  shipper: string;
  origin: string;
  consignee: string;
  destination: string;
  cargo: string;
  details: string;
  stage: string;
  location: string;
  carrier: string;
  sla: string;
  status: string;
  tone: "transit" | "staged" | "hold" | "delivered";
};