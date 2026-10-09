document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  // this allow us to reveal animation
  var items = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    items.forEach(function (item) {
      item.classList.add("visible");
    });
  }

  // Contact form: opens the visitor's email app with the message filled in
  var form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var message = document.getElementById("message").value.trim();

      var subject = encodeURIComponent("Portfolio message from " + name);
      var body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");

      window.location.href =
                "mailto:atmbunambal320@gmail.com?subject=" + subject + "&body=" + body;
    });
  }
});