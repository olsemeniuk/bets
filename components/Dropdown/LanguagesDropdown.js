import { Dropdown } from "./Dropdown.js";

export class LanguagesDropdown extends Dropdown {
  constructor(targetID) {
    super(targetID);
  }

  activateItem() {
    const activeListButton = this.target.querySelector('.dropdown__list-button--active');
    const activeButtonText = activeListButton.textContent.trim();

    this.buttonText.textContent = activeButtonText;
    if (this.input) this.addItemValueToInput(activeButtonText);
    this.removeActiveItemFromList();

    const hasIcon = activeListButton.classList.contains('icon');
    if (!hasIcon) return;

    let buttonIconClass = '';
    this.buttonText.classList.forEach(buttonClass => {
      if (buttonClass.includes('icon--')) {
        buttonIconClass = buttonClass;
      }
    });

    if (buttonIconClass) this.buttonText.classList.remove(buttonIconClass);

    let activeButtonIconClass = '';
    activeListButton.classList.forEach(buttonClass => {
      if (buttonClass.includes('icon--')) {
        activeButtonIconClass = buttonClass;
      }
    });

    this.buttonText.classList.add(activeButtonIconClass, 'icon');
  }
}
