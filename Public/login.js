document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let enteredUsername = document.getElementById("username").value;
    let enteredPassword = document.getElementById("password").value;

    const userData = { username: enteredUsername, password: enteredPassword };

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            // window.location.href = result.redirect; // Redirect from server response
            // window.location.href = "/contact";
            window.location.href = "http://localhost:5000/";
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong! Try again.");
    }
});
