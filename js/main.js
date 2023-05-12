// imports
import { Select } from "../components/Select.js";


// components
new Select('#footer_languages_toggle').startEvents();



// just for test
const loginButton = document.querySelector('.user__login-button');
const logoutButton = document.querySelector('.user__logout-button');
const header = document.querySelector('.header');

loginButton.onclick = () => header.classList.add('authorized');
logoutButton.onclick = () => header.classList.remove('authorized');
// ===============================
