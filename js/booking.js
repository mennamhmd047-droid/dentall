// Noor Dental Clinic — Appointment Booking Handler with Firebase
import { saveAppointment, trackEvent } from "./firebase-config.js";
import { showToast } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  const successBox = document.getElementById("booking-success");
  const submitBtn = form?.querySelector("button[type='submit']");
  const bookingRefEl = document.getElementById("booking-reference-id");

  // Set min date for date input if present
  const dateInput = document.getElementById("booking-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    if (!dateInput.value) {
      dateInput.value = today;
    }
  }

  // Pre-fill service from URL or caller
  window.selectService = function (serviceName) {
    const select = document.getElementById("booking-service");
    if (select) {
      select.value = serviceName;
      // Scroll to booking section smoothly if present on same page
      const bookingSection = document.getElementById("booking");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Pre-fill doctor
  window.selectDoctor = function (doctorName, serviceName) {
    const docSelect = document.getElementById("booking-doctor");
    if (docSelect) docSelect.value = doctorName;
    if (serviceName) {
      const srvSelect = document.getElementById("booking-service");
      if (srvSelect) srvSelect.value = serviceName;
    }
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("patient-name");
    const phoneInput = document.getElementById("patient-phone");
    const serviceInput = document.getElementById("booking-service");
    const timeInput = document.getElementById("booking-time");
    const doctorInput = document.getElementById("booking-doctor");
    const dateVal = dateInput ? dateInput.value : new Date().toISOString().split("T")[0];
    const notesInput = document.getElementById("patient-notes");

    const patientName = nameInput?.value.trim();
    const patientPhone = phoneInput?.value.trim();
    const service = serviceInput?.value || "الفحص الشامل والوقاية";
    const timeSlot = timeInput?.value || "الفترة الصباحية (9 ص - 1 م)";
    const doctor = doctorInput ? doctorInput.value : "أي طبيب متاح";
    const notes = notesInput ? notesInput.value.trim() : "";

    // Validation
    if (!patientName || !patientPhone) {
      showToast("يرجى إدخال الاسم ورقم الجوال بشكل صحيح", "error");
      return;
    }

    if (patientPhone.length < 8) {
      showToast("يرجى التأكد من كتابة رقم هاتف صالح للتواصل", "error");
      return;
    }

    // Button loading state
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner"></span>
        <span>جاري تأكيد الحجز وإرسال البيانات...</span>
      `;
    }

    try {
      const appointmentPayload = {
        patientName,
        patientPhone,
        service,
        doctor,
        appointmentDate: dateVal,
        timeSlot,
        notes,
        status: "pending"
      };

      const result = await saveAppointment(appointmentPayload);

      if (result.success) {
        showToast("تم إرسال طلب الحجز بنجاح وحفظه في Firebase!", "success");

        if (successBox) {
          successBox.classList.remove("hidden");
          if (bookingRefEl) {
            bookingRefEl.textContent = result.id;
          }
          successBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        form.reset();
        
        // Reset default date if present
        if (dateInput) {
          dateInput.value = new Date().toISOString().split("T")[0];
        }
      }
    } catch (error) {
      console.error("Booking error:", error);
      showToast("حدث خطأ أثناء إرسال الحجز. يرجى المحاولة مرة أخرى.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
    }
  });
});
