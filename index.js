const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generation = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={}[]|\"<.>,/?:;';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider(); // Initialize the slider

// Set password length display
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

// Set strength indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

// Random integer generator between min and max
function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Generate random lowercase character
function generateLowerCase() {
    return String.fromCharCode(getRandInteger(97, 123));
}

// Generate random uppercase character
function generateUpperCase() {
    return String.fromCharCode(getRandInteger(65, 91));
}

// Generate random number
function generateRandomNumber() {
    return getRandInteger(0, 10); // Modified to include 9
}

// Generate random symbol
function generatesymbol() {
    const randNum = getRandInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// Calculate password strength
function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#7CFC00"); // Strong: Green
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#FF8C00"); // Medium: Yellow
    } else {
        setIndicator("#f00"); // Weak: Red
    }
}

// Copy password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Update password length when slider changes
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Shuffle password using Fisher-Yates algorithm
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

// Handle checkbox change and ensure password length is valid
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// Copy password to clipboard when copy button is clicked
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

// Generate password when the generate button is clicked
generation.addEventListener('click', () => {
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Clear the old password
    password = "";

    // Create an array of functions to generate characters
    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generatesymbol);

    // Add one character from each selected type
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Fill the rest of the password
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIndex = getRandInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    // Shuffle the final password
    password = shufflePassword(Array.from(password));

    // Display the password
    passwordDisplay.value = password;

    // Calculate the password strength
    calcStrength();
});

