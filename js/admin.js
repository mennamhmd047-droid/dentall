// Noor Dental Clinic — Admin & Reception Dashboard Controller
import { 
  subscribeToAppointments, 
  updateAppointmentStatus, 
  removeAppointment, 
  db, 
  firebaseConfig 
} from "./firebase-config.js";
import { showToast } from "./main.js";

let allAppointments = [];
let currentFilter = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("appointments-table-body");
  const statsTotal = document.getElementById("stat-total");
  const statsPending = document.getElementById("stat-pending");
  const statsConfirmed = document.getElementById("stat-confirmed");
  const searchInput = document.getElementById("admin-search");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const liveIndicator = document.getElementById("live-indicator");
  const emptyState = document.getElementById("empty-state");

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderAppointments();
    });
  }

  // Filter buttons handler
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => {
        b.classList.remove("bg-clinical-teal", "text-white");
        b.classList.add("bg-surface-alt", "text-on-surface-muted");
      });
      btn.classList.add("bg-clinical-teal", "text-white");
      btn.classList.remove("bg-surface-alt", "text-on-surface-muted");

      currentFilter = btn.dataset.filter || "all";
      renderAppointments();
    });
  });

  // Subscribe to real-time updates from Firebase
  if (liveIndicator) {
    liveIndicator.innerHTML = `
      <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
      <span>جاري الاتصال بـ Firebase...</span>
    `;
  }

  const unsubscribe = subscribeToAppointments(
    (items) => {
      allAppointments = items;
      if (liveIndicator) {
        liveIndicator.innerHTML = `
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span class="text-emerald-700 font-medium">متصل بـ Firebase Firestore</span>
        `;
      }
      updateStats();
      renderAppointments();
    },
    (error) => {
      console.warn("Real-time listener warning:", error);
      if (liveIndicator) {
        liveIndicator.innerHTML = `
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span class="text-blue-700 font-medium">قاعدة البيانات المحلية (تحديث محلي)</span>
        `;
      }
    }
  );

  function updateStats() {
    if (!statsTotal || !statsPending || !statsConfirmed) return;
    statsTotal.textContent = allAppointments.length;
    statsPending.textContent = allAppointments.filter(a => a.status === "pending" || !a.status).length;
    statsConfirmed.textContent = allAppointments.filter(a => a.status === "confirmed").length;
  }

  function renderAppointments() {
    if (!tableBody) return;

    let filtered = allAppointments.filter(item => {
      // Filter status
      if (currentFilter !== "all" && item.status !== currentFilter) {
        if (currentFilter === "pending" && !item.status) return true;
        return false;
      }
      return true;
    });

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const name = (item.patientName || "").toLowerCase();
        const phone = (item.patientPhone || "").toLowerCase();
        const service = (item.service || "").toLowerCase();
        return name.includes(searchQuery) || phone.includes(searchQuery) || service.includes(searchQuery);
      });
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    tableBody.innerHTML = filtered.map(app => {
      const dateFormatted = app.appointmentDate || (app.localCreatedAt ? app.localCreatedAt.split("T")[0] : "اليوم");
      const statusBadge = getStatusBadge(app.status || "pending");
      
      return `
        <tr class="border-b border-outline-subtle hover:bg-mint-tint/40 transition-colors">
          <td class="px-5 py-4 font-medium text-on-surface">
            <div class="flex flex-col">
              <span class="font-bold font-cairo">${escapeHtml(app.patientName || "مجهول")}</span>
              <span class="text-xs text-on-surface-muted font-mono" dir="ltr">${escapeHtml(app.patientPhone || "-")}</span>
            </div>
          </td>
          <td class="px-5 py-4 text-on-surface">
            <div class="flex flex-col">
              <span class="text-sm font-semibold">${escapeHtml(app.service || "فحص عام")}</span>
              <span class="text-xs text-clinical-teal">${escapeHtml(app.doctor || "أي طبيب متاح")}</span>
            </div>
          </td>
          <td class="px-5 py-4 text-sm text-on-surface-muted">
            <div class="flex flex-col">
              <span class="tabular-nums font-mono text-xs font-semibold text-on-surface">${escapeHtml(dateFormatted)}</span>
              <span class="text-xs">${escapeHtml(app.timeSlot || "صباحاً")}</span>
            </div>
          </td>
          <td class="px-5 py-4">
            ${statusBadge}
          </td>
          <td class="px-5 py-4">
            <div class="flex items-center gap-1.5">
              ${(app.status !== "confirmed") ? `
                <button onclick="handleStatusChange('${app.id}', 'confirmed')" title="تأكيد الحجز" class="p-1.5 rounded hover:bg-emerald-100 text-emerald-600 transition-colors">
                  <span class="material-symbols-outlined text-[19px]">check_circle</span>
                </button>
              ` : `
                <button onclick="handleStatusChange('${app.id}', 'pending')" title="إعادة إلى قيد الانتظار" class="p-1.5 rounded hover:bg-amber-100 text-amber-600 transition-colors">
                  <span class="material-symbols-outlined text-[19px]">schedule</span>
                </button>
              `}
              ${(app.status !== "cancelled") ? `
                <button onclick="handleStatusChange('${app.id}', 'cancelled')" title="إلغاء الموعد" class="p-1.5 rounded hover:bg-rose-100 text-rose-600 transition-colors">
                  <span class="material-symbols-outlined text-[19px]">cancel</span>
                </button>
              ` : ""}
              <button onclick="handleDelete('${app.id}')" title="حذف" class="p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors">
                <span class="material-symbols-outlined text-[19px]">delete</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function getStatusBadge(status) {
    if (status === "confirmed") {
      return `<span class="badge-status badge-confirmed"><span class="w-1.5 h-1.5 rounded-full bg-teal-bright"></span>مؤكد</span>`;
    } else if (status === "cancelled") {
      return `<span class="badge-status badge-cancelled"><span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>ملغي</span>`;
    } else {
      return `<span class="badge-status badge-pending"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>قيد الانتظار</span>`;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Global actions
  window.handleStatusChange = async function (id, newStatus) {
    try {
      await updateAppointmentStatus(id, newStatus);
      showToast(newStatus === "confirmed" ? "تم تأكيد الموعد بنجاح" : "تم تحديث حالة الموعد", "success");
    } catch (err) {
      showToast("فشل تحديث الحالة: " + err.message, "error");
    }
  };

  window.handleDelete = async function (id) {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا الحجز نهائياً؟")) {
      try {
        await removeAppointment(id);
        showToast("تم حذف الحجز بنجاح", "info");
      } catch (err) {
        showToast("فشل حذف الحجز: " + err.message, "error");
      }
    }
  };
});
