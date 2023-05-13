export class Tabs {
  constructor(targetID) {
    this.selector = targetID;
    this.target = document.querySelector(this.selector);
    this.activeButtonData = null;

    this.buttonsRow = this.target.querySelector('.tabs__buttons');
    this.buttons = this.target.querySelectorAll('.tabs__button');
    this.contentItems = this.target.querySelectorAll('.tabs__content-item');
  }

  start() {
    this.buttonsRow.addEventListener('click', event => {
      this.#changeActiveButton(event);
      this.#changeActiveContent();
    });
  }

  #changeActiveContent() {
    if (!this.activeButtonData) return;

    this.contentItems.forEach(item => {
      item.classList.remove('tabs__content-item--active');
      if (item.dataset.content === this.activeButtonData) {
        item.classList.add('tabs__content-item--active');
      }
    });
  }

  #changeActiveButton(event) {
    const { target } = event;
    const button = target.closest('.tabs__button');

    if (!button) return;

    this.buttons.forEach(btn => btn.classList.remove('tabs__button--active'));
    button.classList.add('tabs__button--active');
    this.activeButtonData = button.dataset.button;
  }
}
