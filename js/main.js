// imports
import { LanguagesDropdown } from "../components/Dropdown/LanguagesDropdown.js";


// components
new LanguagesDropdown('#footer_languages_dropdown').start();


// helping functions
function changeClasses(element, classToRemove, classToAdd) {
  element.classList.remove(classToRemove);
  element.classList.add(classToAdd);
}

function checkClass(element, classToCheck) {
  return element.classList.contains(classToCheck);
}

function delegate(parent, selector, eventName, handler) {
  parent.addEventListener(eventName, event => {
    const {target} = event;
    const element = target.closest(selector);

    if (element && parent.contains(element)) {
      handler.call(element, event);
    }
  });
}

function getElementHeight(element) {
  return element.getBoundingClientRect().height
}


// export
export {changeClasses, checkClass, delegate, getElementHeight};


// just for test
const loginButton = document.querySelector('.user__login-button');
const logoutButton = document.querySelector('.user__logout-button');
const header = document.querySelector('.header');

loginButton.onclick = () => header.classList.add('authorized');
logoutButton.onclick = () => header.classList.remove('authorized');
// ===============================
