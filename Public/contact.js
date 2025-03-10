let searchbar = document.querySelector('#search-bar');
let searchbox = document.querySelector('.search-box');
let shop = document.querySelector('#shop-cart');
let shopcart = document.querySelector('.shopping-cart');
let menubar = document.querySelector('#menu-bar');
let mynav = document.querySelector('.navbar');


searchbar.onclick = () =>{
    searchbox.classList.toggle('active')
}
shop.onclick = () =>{
    shopcart.classList.toggle('active');
}
menubar.onclick = () =>{
    mynav.classList.toggle('active');
}

  
  // Arrays to manage multiple slideshows
  const slideshows = {
      slideshow1: {
          images: ["feature4.png", "feature2.png", "feature3.png"],
          currentIndex: 0
      },
      slideshow2: {
          images: ["men2.jpg", "men1.jpg", "men3.jpg"],
          currentIndex: 0
      },
      slideshow3: {
          images: ["shoe.jpg","goggles1.jpg","bag1.jpg"],
          currentIndex: 0
      }
  };

  function getSlideshow(id) {
      return slideshows[id];
  }

  function updateButtons(id) {
      const slideshow = getSlideshow(id);
      const container = document.getElementById(id);
      const prev = container.querySelector('.prev');
      const next = container.querySelector('.next');

      if (slideshow.currentIndex === 0) {
          prev.classList.add('disabled');
      } else {
          prev.classList.remove('disabled');
      }

      if (slideshow.currentIndex === slideshow.images.length - 1) {
          next.classList.add('disabled');
      } else {
          next.classList.remove('disabled');
      }
  }

  function showSlide(id) {
      const slideshow = getSlideshow(id);
      const container = document.getElementById(id);
      const slide = container.querySelector('.slide-img');
      slide.src = slideshow.images[slideshow.currentIndex];
      updateButtons(id);
  }

  function nextSlide(id) {
      const slideshow = getSlideshow(id);
      slideshow.currentIndex = (slideshow.currentIndex + 1) % slideshow.images.length;
      showSlide(id);
  }

  function prevSlide(id) {
      const slideshow = getSlideshow(id);
      slideshow.currentIndex = (slideshow.currentIndex - 1 + slideshow.images.length) % slideshow.images.length;
      showSlide(id);
  }

  // Initialize all slideshows
  Object.keys(slideshows).forEach(id => showSlide(id));


  document.getElementById('menu-bar').addEventListener('click', function() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
});




// Function to open the popup
function openPopup() {
    document.getElementById("popup").style.display = "block";
    startCountdown(); // Start countdown when the popup opens
}

// Function to close the popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Function to start the countdown
function startCountdown() {
    // Set the date we're counting down to (modify this date for your sale end)
    var saleEndDate = new Date("Oct 31, 2024 23:59:59").getTime();

    // Update the countdown every 1 second
    var timer = setInterval(function() {
        var now = new Date().getTime();
        var timeLeft = saleEndDate - now;

        // Time calculations for days, hours, minutes, and seconds
        var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Display the result in the #countdown div
        document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

        // If the countdown is over, display a message
        if (timeLeft < 0) {
            clearInterval(timer);
            document.getElementById("countdown").innerHTML = "SALE ENDED";
        }
    }, 1000);
}

// Open the popup when the page loads
window.onload = function() {
    openPopup();
};

// document.addEventListener("DOMContentLoaded", () => {
//     document.querySelector("form").addEventListener("submit", async function (event) {
//         event.preventDefault(); // Prevent default form submission

//         let username = document.getElementById("username").value.trim();
//         let email = document.getElementById("email").value.trim();
//         let password = document.getElementById("password").value.trim();
//         let confirmPassword = document.getElementById("confirm-password").value.trim();

//         if (!username || !email || !password || !confirmPassword) {
//             alert("All fields are required!");
//             return;
//         }

//         if (password !== confirmPassword) {
//             alert("Passwords do not match!");
//             return;
//         }

//         let userData = { username, email, password };

//         try {
//             let response = await fetch("/signup", {  // Removed hardcoded localhost
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(userData),
//             });

//             let result = await response.json();
//             if (response.ok) {
//                 alert(result.message);
//                 window.location.href = "login.html"; // Redirect on success
//             } else {
//                 alert(result.error);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             alert("Something went wrong. Try again!");
//         }
//     });
// });

// document.addEventListener("DOMContentLoaded", () => {
//     document.querySelector("form").addEventListener("submit", async function (event) {
//         event.preventDefault(); // Prevent default form submission

//         let formData = {
//             name: document.getElementById("name").value.trim(),
//             email: document.getElementById("email").value.trim(),
//             subject: document.getElementById("subject").value.trim(),
//             message: document.getElementById("message").value.trim(),
//         };

//         console.log("Form Data:", formData); // Debugging log

// //         try {
// //             let response = await fetch("/submit-message", {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify(formData),
// //             });

// //             let result = await response.json();
// //             console.log("Server Response:", result); // Debugging log

// //             if (response.ok) {
// //                 alert(result.message);
// //                 document.querySelector("form").reset();
// //             } else {
// //                 alert(result.error);
// //             }
// //         } catch (error) {
// //             console.error("Fetch Error:", error);
// //             alert("Something went wrong!");
// //         }

// try {
//     let messages = [];
//     if (fs.existsSync(messagesFilePath)) {
//         const fileContent = fs.readFileSync(messagesFilePath, "utf8").trim();
//         messages = fileContent ? JSON.parse(fileContent) : [];
//     }

//     messages.push(newMessage);
//     fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));

//     console.log("Form Submission:", newMessage);
//     res.status(200).json({ message: "Message saved successfully!" });

// } catch (error) {
//     console.error("Error saving message:", error);
//     res.status(500).json({ error: "Failed to save message" });
// }
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#contact-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        let formData = {
            name: document.querySelector("input[name='name']").value.trim(),
            email: document.querySelector("input[name='email']").value.trim(),
            subject: document.querySelector("input[name='subject']").value.trim(),
            message: document.querySelector("textarea[name='message']").value.trim(),
        };

        console.log("Form Data:", formData); // Debugging log

        try {
            let response = await fetch("/submit-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            let result = await response.json();
            console.log("Server Response:", result); // Debugging log

            if (response.ok) {
                alert(result.message);
                document.querySelector("form").reset();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("Something went wrong!");
        }
    });
});
