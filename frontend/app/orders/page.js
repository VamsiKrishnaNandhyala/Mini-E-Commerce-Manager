"use client";

import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { orderService } from "../../services/orderService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const emptyForm = { productId: "", quantity: "", totalAmount: "", status: "PENDING" };
const statuses = ["PENDING", "CONFIRMED", "CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setOrders(await orderService.getAll());
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (order) => {
    setEditing(order);
    setForm({
      productId: order.productId,
      quantity: String(order.quantity),
      totalAmount: String(order.totalAmount),
      status: order.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      productId: form.productId,
      quantity: Number(form.quantity),
      totalAmount: Number(form.totalAmount),
      status: form.status
    };

    try {
      if (editing) {
        await orderService.update(editing.id, payload);
      } else {
        await orderService.create(payload);
      }
      setModalOpen(false);
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save order");
    } finally {
      setSaving(false);
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm("Delete this order?")) return;
    await orderService.remove(id);
    await loadOrders();
  };

  if (loading) return <Loader label="Loading orders" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink">Orders</h2>
          <p className="mt-1 text-sm text-muted">Create and update customer orders.</p>
        </div>
        <Button onClick={openCreate}>Create Order</Button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Table
        data={orders}
        columns={[
          { key: "productId", label: "Product ID" },
          { key: "quantity", label: "Qty" },
          { key: "totalAmount", label: "Total", render: (row) => formatCurrency(row.totalAmount) },
          { key: "status", label: "Status" },
          { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Button variant="secondary" className="min-h-8 px-3 py-1" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Button variant="danger" className="min-h-8 px-3 py-1" onClick={() => deleteOrder(row.id)}>
                  Delete
                </Button>
              </div>
            )
          }
        ]}
      />

      <Modal
        title={editing ? "Edit Order" : "Create Order"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="order-form" disabled={saving}>
              {saving ? "Saving" : "Save"}
            </Button>
          </>
        }
      >
        <form id="order-form" className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Product ID" value={form.productId} onChange={(value) => setForm({ ...form, productId: value })} />
          <Field
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={(value) => setForm({ ...form, quantity: value })}
          />
          <Field
            label="Total Amount"
            type="number"
            step="0.01"
            value={form.totalAmount}
            onChange={(value) => setForm({ ...form, totalAmount: value })}
          />
          <label className="block">
            <span className="text-sm font-semibold text-ink">Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </form>
      </Modal>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", step }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        required
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-line px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
