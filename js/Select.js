export class Select {
  constructor(targetID) {
    this.selector = targetID;
    this.target = document.querySelector(this.selector);

    this.button = this.target.querySelector('.custom-select__button');
    this.buttonText = this.target.querySelector('.custom-select__text');
    this.listWrapper = this.target.querySelector('.custom-select__list-wrapper');
    this.list = this.target.querySelector('.custom-select__list');
    this.listItems = this.target.querySelectorAll('.custom-select__list-button');
    this.input = this.target.querySelector('.custom-select__input');
  }

  startEvents() {
    const activeItem = this.target.querySelector('.custom-select__list-button--active');

    if (activeItem) {
      this.#activateItem();
    } else {
      this.listItems[0].classList.add('custom-select__list-button--active');
      this.#activateItem();
    }

    this.button.onclick = () => this.#toggleList();
    this.list.onclick = event => this.#selectActiveItem(event);

    document.addEventListener('click', event => {
      const { target } = event;
      const isASelect = Boolean(target.closest(this.selector));
      if (!isASelect) this.#removeActiveStateOfList();
    });
  }

  #toggleList() {
    if (this.listItems.length < 2) return;

    const listWrapperHeight = this.listWrapper.getBoundingClientRect().height;
    const listHeight = this.list.getBoundingClientRect().height;

    this.#removeActiveStateOfList();

    if (listWrapperHeight === 0) {
      this.#setOpenListPosition();
      this.listWrapper.style.height = `${listHeight}px`;
      this.#listAndButtonGrowWidth()
    }
  }

  #listAndButtonGrowWidth() {
    const arrayOfListElementsWidth = [];
    this.listItems.forEach(item => arrayOfListElementsWidth.push(item.getBoundingClientRect().width));
    const maxItemWidth = Math.max(...arrayOfListElementsWidth);
    const buttonWidth = this.button.getBoundingClientRect().width;

    const maxWidth = Math.max(maxItemWidth, buttonWidth);

    this.button.style.width = `${maxWidth}px`;
    this.list.style.width = `${maxWidth}px`;
  }

  #listAndButtonShrinkWidth() {
    this.button.style.width = '100%';
    const buttonWidth = this.buttonText.getBoundingClientRect().width;
    this.list.style.width = `${buttonWidth}px`;
  }

  #setOpenListPosition() {
    const listDistanceToBottom = this.list.getBoundingClientRect().bottom;
    const windowHeight = document.documentElement.clientHeight;

    if (listDistanceToBottom > windowHeight - 10) {
      this.listWrapper.style.top = 'auto';
      this.listWrapper.style.bottom = '50%';
      this.target.classList.add('custom-select--open-top');

    } else {
      this.listWrapper.style.bottom = 'auto';
      this.listWrapper.style.top = '50%';
      this.target.classList.add('custom-select--open-bottom');
    }
  }

  #selectActiveItem(event) {
    const { target } = event;
    const listItem = target.closest('.custom-select__list-button');
    if (!listItem) return;

    this.listItems.forEach(item => item.classList.remove('custom-select__list-button--active'));
    listItem.classList.add('custom-select__list-button--active');
    this.#activateItem();

    this.#removeActiveStateOfList();
  }

  #activateItem() {
    const activeItem = this.target.querySelector('.custom-select__list-button--active');
    const activeItemText = activeItem.textContent.trim();

    this.buttonText.textContent = activeItemText;
    this.#addItemValueToInput(activeItemText);
    this.#removeActiveItemFromList();

    const hasIcon = activeItem.classList.contains('icon');
    if (!hasIcon) return;

    let buttonIconClass = '';
    this.buttonText.classList.forEach(item => {
      if (item.includes('icon--')) {
        buttonIconClass = item;
      }
    });

    if (buttonIconClass) this.buttonText.classList.remove(buttonIconClass);

    let activeItemIconClass = '';
    activeItem.classList.forEach(item => {
      if (item.includes('icon--')) {
        activeItemIconClass = item;
      }
    });

    this.buttonText.classList.add(activeItemIconClass, 'icon');
  }

  #addItemValueToInput(value) {
    this.input.value = value;
  }

  #removeActiveItemFromList() {
    const textInButton = this.buttonText.textContent.trim();
    let activeItem = '';

    this.listItems.forEach(item => {
      const itemParent = item.closest('.custom-select__item');
      itemParent.removeAttribute('hidden');

      if (item.textContent.trim() === textInButton) {
        activeItem = item;
      }
    });

    const activeItemParent = activeItem.closest('.custom-select__item');
    activeItemParent.setAttribute('hidden', '');
  }

  #removeActiveStateOfList() {
    this.#listAndButtonShrinkWidth()
    this.listWrapper.style.height = '0';
    this.target.classList.remove('custom-select--open-top');
    this.target.classList.remove('custom-select--open-bottom');
  }
}
