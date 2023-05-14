// imports
import { changeClasses, checkClass, delegate, getElementHeight } from "./main.js";
import { Tabs } from "../components/Tabs/Tabs.js";
import { ArrowDropdown } from "../components/Dropdown/ArrowDropdown.js";


// components
new Tabs('#streams_tabs').start();
new ArrowDropdown('#stash_rarity_dropdown').start();


// stash total
const stashItems = document.querySelectorAll('.stash__item');
const stashTotalSum = document.querySelector('.stash__total-sum');
countStashItems();

// user bet total
const userBetItems = document.querySelectorAll('.user-bet__item');
const userBetTotalSum = document.querySelector('.user-bet__total-sum');
countUserBetItems();

// rarity stash filter
const rarityStashFilter = document.querySelector('.rarity-dropdown');
delegate(rarityStashFilter, '.arrow-dropdown__list-button', 'click', filterItemsByRarity);

// stash items sort
const sortStashButton = document.querySelector('.stash__sort');
const stashItemsList = document.querySelector('.stash__items');
sortStashButton.addEventListener('click', sortOnClick);

// show more height toggling
const showMore = document.querySelectorAll('.show-more');
showMore.forEach(block => {
  const wrapper = block.querySelector('.show-more__items-wrapper');
  const inner = block.querySelector('.show-more__items-inner');
  const items = block.querySelectorAll('.show-more__item');
  const button = block.querySelector('.show-more__button');

  hideSecondRowItems(wrapper, items, block);
  button.addEventListener('click', () => {
    toggleItemsBlockHeight(block, wrapper, items, inner, button);
  });
});

// last bets items toggling
const lastBetsList = document.querySelector('.bets-list');
delegate(lastBetsList, '.bets-item__show-content', 'click', toggleBetItems);

// betcoin range slider
const betcoinBlock = document.querySelector('.betcoin-range');
betcoinBlock.addEventListener('input', slideBetcoinsAmount);


// functions
function toggleBetItems() {
  const parentItem = this.closest('.bets-item');
  const listWrapperToToggle = parentItem.querySelector('.bets-item__content');
  const listToToggle = parentItem.querySelector('.bets-item__items-list');

  const listHeight = getElementHeight(listToToggle);
  const listWrapperHeight = getElementHeight(listWrapperToToggle);

  if (listWrapperHeight === 0) {
    listWrapperToToggle.style.height = `${listHeight}px`;
    parentItem.classList.add('bets-item--opened');
  } else {
    listWrapperToToggle.style.height = 0;
    parentItem.classList.remove('bets-item--opened');
  }
}

function sortElements(elements, parent, order) {
  let sortArray = [];
  elements.forEach(item => {
    sortArray.push({
      element: item,
      price: Number(item.dataset.price)
    });
  });

  switch(order) {
    case 'ascending':
      sortArray = sortArray.sort((a, b) => {
        if (a.price < b.price) return -1;
        if (a.price > b.price) return 1;
        return 0;
      });
      break;
    case 'descending':
      sortArray = sortArray.sort((a, b) => {
        if (a.price < b.price) return 1;
        if (a.price > b.price) return -1;
        return 0;
      });
      break;
  }

  sortArray = sortArray.map(item => item.element);
  parent.innerHTML = '';
  parent.append(...sortArray);
}

function sortOnClick() {
  const isActive = sortStashButton.className.includes('sort--');

  if (!isActive) {
    sortStashButton.classList.add('sort--descending');
  } else if (checkClass(sortStashButton, 'sort--descending')) {
    changeClasses(sortStashButton, 'sort--descending', 'sort--ascending');
  } else if (checkClass(sortStashButton, 'sort--ascending')) {
    changeClasses(sortStashButton, 'sort--ascending', 'sort--descending');
  }

  if (checkClass(sortStashButton, 'sort--descending')) {
    sortElements(stashItems, stashItemsList, 'descending');
  } else if (checkClass(sortStashButton, 'sort--ascending')) {
    sortElements(stashItems, stashItemsList, 'ascending');
  }
}

function countItemsAndPrice(items) {
  items = Array.from(items).filter(item => {
    if (item.style.display !== 'none') {
      return item;
    }
  });
  const itemsCount = items.length;
  let itemsPrice = 0;
  items.forEach(item => {
    const price = item.dataset.price;
    itemsPrice += Number(price);
  });

  itemsPrice = itemsPrice.toFixed(2);
  return [itemsCount, itemsPrice];
}

function countStashItems() {
  const stashTotalInfo = countItemsAndPrice(stashItems);
  stashTotalSum.textContent = `${stashTotalInfo[0]} (${stashTotalInfo[1]}$)`;
}

function countUserBetItems() {
  const betItemsTotalInfo = countItemsAndPrice(userBetItems);
  userBetTotalSum.textContent = `${betItemsTotalInfo[0]} (${betItemsTotalInfo[1]}$)`;
}

function filterItemsByRarity() {
  const rarityFilter = this.dataset.rarity.toLowerCase().trim();
  let filteredItems = [];
  stashItems.forEach(item => {
    filteredItems.push({
      element: item,
      rarity: item.dataset.rarity.toLowerCase().trim(),
    });
    item.style.display = 'none';
  });

  if (rarityFilter === 'all') {
    filteredItems = filteredItems.map(item => {
      item.element.style.display = 'flex';
      return item.element;
    });
  } else {
    filteredItems = filteredItems
      .filter(item => item.rarity === rarityFilter)
      .map(item => {
        item.element.style.display = 'flex';
        return item.element;
      });
  }

  stashItemsList.innerHTML = '';
  stashItemsList.append(...filteredItems);
  countStashItems();
  correctStashHeight();
}

function hideSecondRowItems(wrapper, insideItems, block) {
  const rowHeight = checkRowHeight(insideItems);
  const wrapperHeight = getElementHeight(wrapper);

  if (wrapperHeight > rowHeight + 20) {
    wrapper.style.height = `${rowHeight + 35}px`;
    block.classList.add('show-more--active');
  }
}

function toggleItemsBlockHeight(block, wrapper, insideItems, inner, button) {
  const rowHeight = checkRowHeight(insideItems);
  const innerHeight = getElementHeight(inner);

  const isOpened = block.classList.contains('show-more--opened');

  if (!isOpened) {
    wrapper.style.height = `${innerHeight}px`;
    block.classList.add('show-more--opened');
    button.textContent = 'Show less';
  } else {
    wrapper.style.height = `${rowHeight + 35}px`;
    block.classList.remove('show-more--opened');
    button.textContent = 'Show more';
  }
}

function checkRowHeight(rowItems) {
  let rowHeight = '';
  rowItems.forEach(item => {
    const itemHeight = getElementHeight(item);
    if (itemHeight !== 0) {
      rowHeight = itemHeight;
    }
  });
  return rowHeight;
}

function correctStashHeight() {
  const stashItemsWrapper = document.querySelector('.stash__items-wrapper');
  const stashBody = document.querySelector('.stash__body');

  const listHeight = getElementHeight(stashItemsList);
  const rowHeight = checkRowHeight(stashItems);

  stashItemsWrapper.style.height = `${listHeight}px`;

  if (listHeight < rowHeight + 20) {
    stashBody.classList.remove('show-more--active');
  } else {
    stashBody.classList.add('show-more--active');
  }
}

function slideBetcoinsAmount({target}) {
  const betcoinSlider = document.querySelector('.betcoin-range__slider');
  const rangeNum = document.querySelector('.betcoin-range__num');

  switch (target) {

    case betcoinSlider:
      rangeNum.value = Number(betcoinSlider.value) || 0;
      break;

    case rangeNum:
      const isInvalid = Number(rangeNum.value) < 0 || /^00/.test(rangeNum.value)
      const isBiggerThanMax = Number(rangeNum.value) > betcoinSlider.max;
      if (isInvalid) rangeNum.value = 0;
      if (isBiggerThanMax) rangeNum.value = betcoinSlider.max;

      betcoinSlider.value = Number(rangeNum.value) === 0 ? 0 : rangeNum.value;
      break;
  }

  changeBetcoinSum(Number(rangeNum.value));
  if (Number(rangeNum.value) === '') changeBetcoinSum(0);
}

function changeBetcoinSum(value) {
  const betcoinBlock = document.querySelector('.betcoin');
  const betcoinSumText = betcoinBlock.querySelector('.betcoin__sum');

  betcoinBlock.dataset.sum = value;
  betcoinSumText.textContent = `${value}$`;
}
