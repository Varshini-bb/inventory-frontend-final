type Props = {
  quantity: number;
  lowStockThreshold: number;
  lastSoldAt?: string;
};

export default function StatusBadge({
  quantity,
  lowStockThreshold,
  lastSoldAt
}: Props) {
  let status = "OK";
  let className = "badge badge-ok";

  if (lastSoldAt) {
    const days =
      (Date.now() - new Date(lastSoldAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (days > 60) {
      status = "DEAD";
      className = "badge badge-dead";
    }
  }

  if (quantity < lowStockThreshold && status !== "DEAD") {
    status = "LOW";
    className = "badge badge-low";
  }

  return <span className={className}>{status}</span>;
}
