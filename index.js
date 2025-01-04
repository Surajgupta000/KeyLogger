// Key Logger Advanced Implementation

const logDiv = document.getElementById("log");
const stateDiv = document.getElementById("state");
const startbtn = document.getElementById("start-btn");
const stopbtn = document.getElementById("stop-btn");

let activeKeys = new Set();
const audio = new Audio('keypress-sound.mp3');

// Start logging keypresses
startbtn.addEventListener("click", () => {
    document.addEventListener("keydown", handledown);
    document.addEventListener("keyup", handleup);
    startbtn.disabled = true; // Disable start button
    stopbtn.disabled = false; // Enable stop button
});

// Stop logging keypresses
stopbtn.addEventListener("click", () => {
    document.removeEventListener("keydown", handledown);
    document.removeEventListener("keyup", handleup);
    logDiv.textContent = ""; // Clear log content
    stateDiv.textContent = ""; // Clear state content
    stopbtn.disabled = true; // Disable stop button
    startbtn.disabled = false; // Enable start button
});

// Handle keydown event
function handledown(e) {
    // Play sound
    audio.currentTime = 0;
    audio.play();

    if (activeKeys.has(e.key)) return;

    // Log key details
    const logItem = document.createElement('div');
    logItem.textContent = `Key "${e.key}" (Code: ${e.code}) pressed`;
    logDiv.appendChild(logItem);

    // Make logDiv scrollable
    logDiv.scrollTop = logDiv.scrollHeight;

    // Track active keys for combinations
    activeKeys.add(e.key);
    stateDiv.textContent = `Keys active: ${[...activeKeys].join(' + ')}`;

    // Highlight virtual keyboard
    const keyElement = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
    if (keyElement) keyElement.classList.add('pressed');
}

// Handle keyup event
function handleup(e) {
    // Remove key from active keys
    activeKeys.delete(e.key);
    stateDiv.textContent = `Keys active: ${[...activeKeys].join(' + ')}`;

    // Remove highlight from virtual keyboard
    const keyElement = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
    if (keyElement) keyElement.classList.remove('pressed');
}

// Download logs as a text file
function downloadLog() {
    const logText = [...logDiv.children].map(item => item.textContent).join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'keylog.txt';
    link.click();
}

// Add button to download logs
const downloadButton = document.createElement('button');
downloadButton.textContent = "Download Logs";
downloadButton.addEventListener('click', downloadLog);
document.querySelector('.container').appendChild(downloadButton);

// Add theme toggle button
const themeToggle = document.createElement('button');
themeToggle.textContent = "Toggle Theme";
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});
document.querySelector('.container').appendChild(themeToggle);

// CSS for dark theme
const style = document.createElement('style');
style.textContent = `
.dark-theme {
    background-color: #333;
    color: #fff;
}
#virtual-keyboard button {
    padding: 10px;
    margin: 5px;
    font-size: 20px;
}
.pressed {
    background-color: yellow;
}
#log {
    overflow-y: auto;
    max-height: 200px;
}`;
document.head.appendChild(style);
