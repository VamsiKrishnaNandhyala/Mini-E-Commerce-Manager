"use client";

import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import { paymentService } from "../../services/paymentService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const emptyForm = { orderId: "", amount: "", status: "PENDING", transactionId: "" };
const statuses = ["SUCCESS", "FAILED", "PENDING"];

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setPayments(await paymentService.getAll());
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (payment) => {
    setEditing(payment);
    setForm({
      orderId: payment.orderId,
      amount: String(payment.amount),
      status: payment.status,
      transactionId: payment.transactionId
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      orderId: form.orderId,
      amount: Number(form.amount),
      status: form.status,
      transactionId: form.transactionId
    };

    try {
      if (editing) {
        await paymentService.update(editing.id, payload);
      } else {
        await paymentService.create(payload);
      }
      setModalOpen(false);
      await loadPayments();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save payment");
    } finally {
      setSaving(false);
    }
  };

  const deletePayment = async (id) => {
    if (!confirm("Delete this payment?")) return;
    await paymentService.remove(id);
    await loadPayments();
  };

  if (loading) return <Loader label="Loading payments" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink">Payments</h2>
          <p className="mt-1 text-sm text-muted">Record payment attempts and outcomes.</p>
        </div>
        <Button onClick={openCreate}>Create Payment</Button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Table
        data={payments}
        columns={[
          { key: "orderId", label: "Order ID" },
          { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
          { key: "status", label: "Status" },
          { key: "transactionId", label: "Transaction" },
          { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Button variant="secondary" className="min-h-8 px-3 py-1" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Button variant="danger" className="min-h-8 px-3 py-1" onClick={() => deletePayment(row.id)}>
                  Delete
                </Button>
              </div>
            )
          }
        ]}
      />

      <Modal
        title={editing ? "Edit Payment" : "Create Payment"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="payment-form" disabled={saving}>
              {saving ? "Saving" : "Save"}
            </Button>
          </>
        }
      >
        <form id="payment-form" className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Order ID" value={form.orderId} onChange={(value) => setForm({ ...form, orderId: value })} />
          <Field
            label="Amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(value) => setForm({ ...form, amount: value })}
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
          <Field
            label="Transaction ID"
            value={form.transactionId}
            onChange={(value) => setForm({ ...form, transactionId: value })}
          />
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
