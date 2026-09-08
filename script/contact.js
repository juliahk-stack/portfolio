javascript
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("consultation-form");

  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const formStatus = document.getElementById("form-status");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Prevent multiple submissions
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    if (formStatus) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }

    try {
      const templateParams = {
        full_name: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim()
      };

      // Send form through EmailJS
      const response = await emailjs.send(
        "service_471ozob",
        "template_j6pdrlr",
        templateParams
      );

      console.log("EmailJS response:", response);

      if (formStatus) {
        formStatus.textContent =
          "Your consultation request has been sent successfully. The office will respond as appropriate.";
        formStatus.classList.add("success");
      }

      form.reset();

    } catch (error) {
      console.error("EmailJS error:", error);

      if (formStatus) {
        formStatus.textContent =
          "Unable to send your request at this time. Please try again or contact the office directly.";
        formStatus.classList.add("error");
      }

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Consultation Request";
    }
  });
});

