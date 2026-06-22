"use client";

import { useEffect, useState } from "react";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Table from "../components/Table";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function DashboardPage() {
  const [state, setState] = useState({ products: [], orders: [], payments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [products, orders, payments] = await Promise.all([
        productService.getAll(),
        orderService.getAll(),
        paymentService.getAll()
      ]);
      setState({ products, orders, payments });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const recentOrders = [...state.orders].slice(-5).reverse();
  const recentPayments = [...state.payments].slice(-5).reverse();

  if (loading) return <Loader label="Loading dashboard" />;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-ink">Dashboard</h2>
        <p className="mt-1 text-sm text-muted">Live summary from the API Gateway.</p>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Total Products" value={state.products.length} />
        <Card title="Total Orders" value={state.orders.length} />
        <Card title="Total Payments" value={state.payments.length} />
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-ink">Recent Orders</h3>
        <Table
          data={recentOrders}
          columns={[
            { key: "productId", label: "Product ID" },
            { key: "quantity", label: "Qty" },
            { key: "totalAmount", label: "Total", render: (row) => formatCurrency(row.totalAmount) },
            { key: "status", label: "Status" },
            { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) }
          ]}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-ink">Recent Payments</h3>
        <Table
          data={recentPayments}
          columns={[
            { key: "orderId", label: "Order ID" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "status", label: "Status" },
            { key: "transactionId", label: "Transaction" },
            { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) }
          ]}
        />
      </section>
    </div>
  );
}
