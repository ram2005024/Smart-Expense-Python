import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Loader2,
  NotebookPen,
  Trash2,
  Upload,
  X,
  Edit,
  AlertCircle,
  ImageOff,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../../../utils/axios/axiosInstance";
import { fetchExpenses } from "../../../../store/thunks/expenseThunk";
import { fetchBudget } from "../../../../store/thunks/budgetThunk";
import toast from "react-hot-toast";

const statusOptions = [
  {
    name: "Pending",
    value: "PENDING",
    style: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    activeStyle: "bg-yellow-500 text-white",
  },
  {
    name: "Paid",
    value: "PAID",
    style: "bg-green-100 text-green-700 hover:bg-green-200",
    activeStyle: "bg-green-500 text-white",
  },
  {
    name: "Reimbursed",
    value: "REIMBRUSHED",
    style: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    activeStyle: "bg-blue-500 text-white",
  },
  {
    name: "Declined",
    value: "DECLINED",
    style: "bg-red-100 text-red-700 hover:bg-red-200",
    activeStyle: "bg-red-500 text-white",
  },
];

const InputField = ({ label, required, error, children }) => (
  <div className="space-y-1">
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const ExpenseEdit = ({ isEdit, setIsEdit, expenseId }) => {
  const dispatch = useDispatch();

  const { filteredExpenses, currentPage, pageSize, filter, selectedMonth } =
    useSelector((state) => state.expense);

  const {
    budgets,
    budgetLoading,
    error: budgetError,
  } = useSelector((state) => state.budget);

  const expense = filteredExpenses?.find((i) => i.id === expenseId);

  const [formData, setFormData] = useState({
    expense_name: "",
    expense_description: "",
    expense_amount: "",
    status: "PENDING",
    expense_image: null,
  });

  const [previewURL, setPreviewURL] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // ─── The budget currently assigned to this expense ───────────────────────
  const currentBudget = useMemo(
    () => budgets?.find((b) => b.id === expense?.budget?.id),
    [budgets, expense],
  );

  // Fetch budgets when modal opens
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchBudget());
      setIsDirty(false);
      setErrors({});
      setRemoveImage(false);
    }
  }, [isEdit]);

  // Load expense data
  useEffect(() => {
    if (expense) {
      setFormData({
        expense_name: expense.expense_name || "",
        expense_description: expense.expense_description || "",
        expense_amount: expense.expense_amount || "",
        status: expense.status || "PENDING",
        expense_image: null,
      });
      setPreviewURL(expense.expense_image || null);
    }
  }, [expense]);

  // Image object URL preview
  useEffect(() => {
    if (!formData.expense_image) return;
    const url = URL.createObjectURL(formData.expense_image);
    setPreviewURL(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.expense_image]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.expense_name?.trim())
      newErrors.expense_name = "Name is required";
    if (!formData.expense_amount || Number(formData.expense_amount) <= 0)
      newErrors.expense_amount = "Enter a valid amount";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "expense_image") return; // handled separately
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      if (formData.expense_image) {
        data.append("expense_image", formData.expense_image);
      } else if (removeImage) {
        data.append("expense_image", ""); // signal backend to clear
      }

      await axiosInstance.patch(`/expenses/${expenseId}/`, data);

      await Promise.all([
        dispatch(
          fetchExpenses({
            page: currentPage,
            page_size: pageSize,
            date: selectedMonth,
            ...(filter || {}),
          }),
        ).unwrap(),
        dispatch(fetchBudget()).unwrap(),
      ]);

      toast.success("Expense updated successfully");
      setIsEdit(false);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Update failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (!window.confirm("Discard unsaved changes?")) return;
    }
    setIsEdit(false);
  };

  // Keyboard: close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isEdit) handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isEdit, isDirty]);

  return (
    <AnimatePresence>
      {isEdit && (
        <motion.div
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed z-40 inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", stiffness: 140, damping: 18 },
            }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-[440px] max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <NotebookPen className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold leading-tight">
                    Edit Expense
                  </h2>
                  <span className="text-xs text-indigo-200">
                    Update your transaction
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-white/20 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Expense Name */}
              <InputField
                label="Expense Name"
                required
                error={errors.expense_name}
              >
                <input
                  value={formData.expense_name}
                  onChange={(e) => handleChange("expense_name", e.target.value)}
                  placeholder="e.g. Office Supplies"
                  className={`w-full mt-1 px-3 py-2 rounded-lg bg-slate-50 border text-sm transition
                    focus:outline-none focus:ring-2 focus:ring-indigo-300
                    ${errors.expense_name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
              </InputField>

              {/* Description */}
              <InputField label="Description">
                <textarea
                  value={formData.expense_description}
                  onChange={(e) =>
                    handleChange("expense_description", e.target.value)
                  }
                  placeholder="Optional details…"
                  rows={2}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-50 border border-gray-200 text-sm resize-none
                    focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </InputField>

              {/* Budget Category — read-only */}
              <InputField label="Budget Category">
                {budgetLoading ? (
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Loader2 className="animate-spin size-4" /> Loading budgets…
                  </div>
                ) : budgetError ? (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {budgetError}
                  </p>
                ) : currentBudget ? (
                  <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    <span className="text-sm font-medium text-indigo-700">
                      {currentBudget.budget_name}
                    </span>
                    <span className="ml-auto text-xs text-indigo-400 select-none">
                      Read-only
                    </span>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-sm text-gray-400 italic">
                      No budget assigned
                    </span>
                  </div>
                )}
              </InputField>

              {/* Amount */}
              <InputField label="Amount" required error={errors.expense_amount}>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium select-none">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.expense_amount}
                    onChange={(e) =>
                      handleChange("expense_amount", e.target.value)
                    }
                    placeholder="0.00"
                    className={`w-full pl-7 pr-3 py-2 rounded-lg bg-slate-50 border text-sm transition
                      focus:outline-none focus:ring-2 focus:ring-indigo-300
                      ${errors.expense_amount ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                </div>
              </InputField>

              {/* Status */}
              <InputField label="Status">
                <div className="flex gap-2 flex-wrap mt-1">
                  {statusOptions.map((s) => {
                    const active = formData.status === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => handleChange("status", s.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                          ${active ? s.activeStyle : s.style}`}
                      >
                        {active && <span className="mr-1">✓</span>}
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </InputField>

              {/* Receipt Image */}
              <InputField label="Receipt Image">
                {previewURL ? (
                  <div className="relative group mt-2 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={previewURL}
                      alt="Receipt preview"
                      className="w-full object-cover max-h-48"
                    />
                    <div
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                      flex items-center justify-center gap-3 transition duration-200"
                    >
                      <label
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700
                        px-3 py-1.5 rounded-lg text-white text-xs font-medium cursor-pointer transition"
                      >
                        <Edit size={14} /> Change
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            setRemoveImage(false);
                            handleChange("expense_image", e.target.files[0]);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewURL(null);
                          setRemoveImage(true);
                          handleChange("expense_image", null);
                        }}
                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600
                          px-3 py-1.5 rounded-lg text-white text-xs font-medium transition"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    className="mt-2 border-2 border-dashed border-gray-200 hover:border-indigo-400
                    h-24 flex flex-col items-center justify-center rounded-xl cursor-pointer
                    text-gray-400 hover:text-indigo-500 transition group"
                  >
                    <Upload
                      size={22}
                      className="mb-1 group-hover:scale-110 transition"
                    />
                    <span className="text-xs">
                      Click to upload receipt image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        setRemoveImage(false);
                        handleChange("expense_image", e.target.files[0]);
                      }}
                    />
                  </label>
                )}
              </InputField>
            </div>

            {/* ── Footer ── */}
            <div className="border-t bg-slate-50 px-5 py-3 flex justify-between items-center shrink-0">
              {isDirty && (
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle size={12} /> Unsaved changes
                </span>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !formData.expense_name?.trim() ||
                    !formData.expense_amount
                  }
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300
                    disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition font-medium"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  {loading ? "Updating…" : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpenseEdit;
