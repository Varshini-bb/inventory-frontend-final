import { fetchProducts } from "@/lib/api";
import Link from "next/link";
import styles from "./Products.module.css";

export default async function Products() {
  const products = await fetchProducts();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Products Inventory</h1>
            <p className={styles.subtitle}>
              {products.length} total products in your inventory
            </p>
          </div>
          <Link href="/products/new" className={styles.addButton}>
            <svg
              className={styles.icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Product
          </Link>
        </div>

        {/* Products Table */}
        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h2 className={styles.emptyTitle}>No products found</h2>
            <p className={styles.emptyText}>
              Start by adding your first product to the inventory
            </p>
            <Link href="/products/new" className={styles.emptyButton}>
              Add Product
            </Link>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => {
                  const quantity = Number(p.quantity ?? 0);
                  const threshold = Number(p.lowStockThreshold ?? 0);

                  let statusText = "In Stock";
                  let statusClass = styles.statusOk;

                  if (quantity === 0) {
                    statusText = "Out of Stock";
                    statusClass = styles.statusDead;
                  } else if (quantity < threshold) {
                    statusText = "Low Stock";
                    statusClass = styles.statusLow;
                  }

                  return (
                    <tr key={p._id}>
                      <td>
                        <div className={styles.productCell}>
                          <div className={styles.productIcon}>
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                          <span className={styles.productName}>{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.quantityBadge}>
                          {quantity}
                        </span>
                      </td>
                      <td>
                        <span className={styles.thresholdText}>
                          {threshold}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${statusClass}`}>
                          {statusText}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/stock/${p._id}`}
                          className={styles.manageLink}
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}