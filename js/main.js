// imports
import { LanguagesDropdown } from "../components/Dropdown/LanguagesDropdown.js";


// components
new LanguagesDropdown('#footer_languages_dropdown').start();



// just for test
const loginButton = document.querySelector('.user__login-button');
const logoutButton = document.querySelector('.user__logout-button');
const header = document.querySelector('.header');

loginButton.onclick = () => header.classList.add('authorized');
logoutButton.onclick = () => header.classList.remove('authorized');
// ===============================
