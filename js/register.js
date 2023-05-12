const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    alert("Registration successful!");
    window.location.href = "/html/login.html"; // Redirect to the home page or any other page after successful registration
  } catch (error) {
    alert("Error: " + error.message);
  }
});
