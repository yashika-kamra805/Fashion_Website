// function saveForm() {
//     let un = document.getElementById("username").value;
//     let pw = document.getElementById("password").value;

//     // Save to localStorage
//     localStorage.setItem("user", JSON.stringify({ username: un, password: pw }));

//     alert("Account created successfully! Redirecting to login page...");
    
//     // Redirect to login page
//     window.location.href = "login.html";

//     return false; // Prevent form submission
//        }

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("form").addEventListener("submit", async function (event) {
        event.preventDefault(); 

        let username = document.getElementById("username").value.trim();
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirm-password").value;

        if (!username || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        let userData = { username, email, password }; 

        try {
            let response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            let result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = "login.html"; 
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Try again!");
        }
    });
});