// Calls the home page Javascript

// Check if a username exists in localStorage
function checkUsername() {
    var username = localStorage.getItem('username');
    if (!username) {
        return false;
    }
    return true;
}

// Add event listener to the Start Game button
var startButton = document.getElementById('startButton');
startButton.addEventListener('click', function () {
    var validUsername = checkUsername();
    if (validUsername) {
        // Redirect to the function that will handle the game setup
        startGame();
    } else {
        // Show an alert if the username is not valid
        alert('Please add a username before starting the game.');
        return;
    }
});

// Function to handle game setup and redirection
function startGame() {
    // Redirect to the game page (snake.html)
    window.location.href = 'snake.html';
}

// Adds and saves username
function saveUsername() {
    var usernameInput = document.getElementById('username');
    var username = usernameInput.value;

    if (username.length === 0) {
        alert('Please enter a username.');
        return;
    }

    if (username.length > 10) {
        alert('Username must be maximum 10 characters long.');
        return;
    }

    localStorage.setItem('username', username);
    alert('Username saved!');
}