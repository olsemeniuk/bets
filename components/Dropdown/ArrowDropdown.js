import { Dropdown } from "./Dropdown.js";

export class ArrowDropdown extends Dropdown {
  constructor(targetID) {
    super(targetID);
  }

  start() {
    super.start();

    this.button.addEventListener('click', () => this.arrowToggle());
    this.list.addEventListener('click', event => {
      const { target } = event;
      if (target.classList.contains('dropdown__list-button')) {
        this.arrowToggle();
      }
    });

    document.addEventListener('click', event => {
      const { target } = event;
      const isDropdown = Boolean(target.closest(this.selector));
      if (!isDropdown) this.arrowToggle();
    });
  }

  arrowToggle() {
    const isOpened = this.target.classList.contains('dropdown--open-top') ||
                     this.target.classList.contains('dropdown--open-bottom');

    if (isOpened) {
      this.target.classList.add('arrow-dropdown--open');
    } else {
      this.target.classList.remove('arrow-dropdown--open');
    }
  }
}
