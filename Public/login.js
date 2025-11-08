document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let enteredEmail = document.getElementById("email").value;
    let enteredPassword = document.getElementById("password").value;

    const userData = { email: enteredEmail, password: enteredPassword };

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("token", result.token); 

            if (result.role === "admin") {
                alert("Admin is logged in");
                window.location.href = "http://localhost:5000/";
            } else {
                alert("User is logged in");
                window.location.href = "http://localhost:5000/";
            }
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong! Try again.");
    }
});
