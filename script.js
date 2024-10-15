// Placeholder for future functionality like form validation, booking submissions, etc.
console.log("Tourism Management System is loaded!");
// Load destinations from localStorage when the page loads
function loadDestinations() {
    const destinationList = document.getElementById('destinationList');
    const destinations = JSON.parse(localStorage.getItem('destinations')) || [];

    destinationList.innerHTML = ''; // Clear the list

    destinations.forEach(dest => {
        const destinationDiv = document.createElement('div');
        destinationDiv.className = 'destination';

        destinationDiv.innerHTML = `
            <h3>${dest.name}</h3>
            <img src="${dest.image}" alt="${dest.name}">
            <p>${dest.description}</p>
            <p><strong>Package:</strong> ${dest.package}</p>
            <p><strong>Amount:</strong> $${dest.amount}</p>
            <p><strong>Duration:</strong> ${dest.duration}</p>
            <p><strong>Highlights:</strong> ${dest.highlights || 'N/A'}</p>
            <button onclick="deleteDestination('${dest.name}')">Delete</button>
        `;

        destinationList.appendChild(destinationDiv);
    });
}

// Add event listener to the form
document.getElementById('destinationForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;
    const packageType = document.getElementById('packageType').value;
    const amount = document.getElementById('amount').value;
    const duration = document.getElementById('duration').value;
    const highlights = document.getElementById('highlights').value;

    // Save new destination to localStorage
    const destinations = JSON.parse(localStorage.getItem('destinations')) || [];
    destinations.push({ name, description, image, package: packageType, amount, duration, highlights });
    localStorage.setItem('destinations', JSON.stringify(destinations));

    // Clear the form
    this.reset();
    loadDestinations(); // Refresh the destination list
});

// Function to delete a destination
function deleteDestination(name) {
    const destinations = JSON.parse(localStorage.getItem('destinations')) || [];
    const updatedDestinations = destinations.filter(dest => dest.name !== name);
    localStorage.setItem('destinations', JSON.stringify(updatedDestinations));
    loadDestinations(); // Refresh the destination list
}

// Load destinations on page load
window.onload = loadDestinations;
