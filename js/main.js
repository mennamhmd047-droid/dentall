// Noor Dental Clinic — Main UI & Navigation Scripts

// Toast notification helper
export function showToast(message, type = "success", duration = 4500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let iconName = "check_circle";
  let iconColor = "text-teal-bright";
  if (type === "error") {
    iconName = "error";
    iconColor = "text-red-600";
  } else if (type === "info") {
    iconName = "info";
    iconColor = "text-clinical-teal";
  }

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[22px] shrink-0" aria-hidden="true">${iconName}</span>
    <div class="flex flex-col text-sm text-on-surface">
      <span class="font-cairo font-semibold">${type === "success" ? "تمت العملية" : type === "error" ? "تنبيه" : "معلومات"}</span>
      <span class="text-on-surface-muted text-xs leading-relaxed">${message}</span>
    </div>
    <button type="button" class="text-gray-400 hover:text-gray-600 mr-auto p-1 text-sm focus:outline-none" aria-label="إغلاق">&times;</button>
  `;

  const closeBtn = toast.querySelector("button");
  closeBtn.addEventListener("click", () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Expose globally for inline button handlers if needed
window.showToast = showToast;

// Initialize common navigation & interactions
document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Drawer
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isHidden = mobileNav.classList.contains("hidden");
      mobileNav.classList.toggle("hidden", !isHidden);
      menuToggle.setAttribute("aria-expanded", String(isHidden));
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target) && !mobileNav.classList.contains("hidden")) {
        mobileNav.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 2. Active Page Highlighting
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPath = href.split("/").pop().split("#")[0];
    if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 3. Service preselection via URL param (e.g. ?service=...)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get("service");
  if (serviceParam) {
    const serviceSelect = document.getElementById("booking-service");
    if (serviceSelect) {
      serviceSelect.value = decodeURIComponent(serviceParam);
    }
  }

  const doctorParam = urlParams.get("doctor");
  if (doctorParam) {
    const doctorSelect = document.getElementById("booking-doctor");
    if (doctorSelect) {
      doctorSelect.value = decodeURIComponent(doctorParam);
    }
  }

  // 4. Keyboard accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (mobileNav && !mobileNav.classList.contains("hidden")) {
        mobileNav.classList.add("hidden");
        menuToggle?.setAttribute("aria-expanded", "false");
      }
    }
  });
});
