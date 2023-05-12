const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    alert("Login successful!");
    window.location.href = "/index.html"; // Redirect to the home page or any other page after successful login
  } catch (error) {
    alert("Error: " + error.message);
  }
});
