//displayip.js 
     // Wait for the HTML document to be fully loaded
        document.addEventListener("DOMContentLoaded", function() {
            // Fetch the IP address from the ipify.org API
            fetch("https://api.ipify.org?format=json")
                .then(response => response.json()) // Parse the JSON response
                .then(data => {
                    // Update the text content of the paragraph with the ID "ip-address"
                    document.getElementById("ip-address").textContent = data.ip;
                })
                .catch(error => {
                    // If there's an error, log it to the console
                    console.error("Error fetching IP address:", error);
                    document.getElementById("ip-address").textContent = "Could not retrieve IP address.";
                });
        });