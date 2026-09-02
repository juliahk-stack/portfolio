
  // form submission
  const form = document.getElementById("contactForm");
const response = document.getElementById("message");
const button = document.getElementById("submitBtn");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("subject").value;
    const message = document.getElementById("message").value.trim();

    if(!name || !email || !phone || !subject || !message){

        response.style.color="red";
        response.innerHTML="Please complete all required fields.";
        return;

    }

    button.disabled = true;
    button.innerHTML = "Sending...";

    emailjs.send(
        "service_471ozob",
        "template_j6pdrlr",
        {
            from_name: name,
            from_email: email,
            phone: phone,
            service: subject,
            message: message
        }
    )
    .then(function(){

        return emailjs.send(
    "service_471ozob",
    "template_j6pdrlr",
    {
        from_name: name,
        from_email: email,
        service: subject
    });

        response.style.color = "#198754";
        response.innerHTML = "✔ Thank you! Your enquiry has been sent successfully.";

        form.reset();

    })
    .catch(function(error){

    console.log("EmailJS Error:", error);

    response.style.color = "red";
    response.innerHTML = error.text || "Something went wrong.";

    })
    .finally(function(){

        button.disabled = false;
        button.innerHTML = "Send Enquiry";
    });

});
