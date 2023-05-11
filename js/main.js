// imports
import { Select } from "./Select.js";

// footer languages toggle
new Select('#footer_languages_toggle').startEvents();



// just for test
const loginButton = document.querySelector('.user__login-button');
const logoutButton = document.querySelector('.user__logout-button');
const header = document.querySelector('.header');

loginButton.onclick = () => header.classList.add('authorized');
logoutButton.onclick = () => header.classList.remove('authorized');
// ===============================
