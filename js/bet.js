// imports
import { changeClasses, checkClass, delegate, getHeight } from "../modules/helpers.js";
import { Tabs } from "../components/Tabs/Tabs.js";
import { ArrowDropdown } from "../components/Dropdown/ArrowDropdown.js";


// HTML elements
// stash elements
const stashBody = document.querySelector('.stash__body');
const rarityFilterDropdown = document.getElementById('stash_rarity_dropdown');
const stashSort = stashBody.querySelector('.stash__sort');
const stashItemsParent = stashBody.querySelector('.stash__items');
const stashGameItems = stashItemsParent.querySelectorAll('.game-item');
const stashTotalSum = document.querySelector('.stash__total-sum');
const allInButton = document.querySelector('.stash__all-in')

// user bet elements
const userBet = document.querySelector('.user-bet');
const userBetBody = userBet.querySelector('.user-bet__body');
const cancelBetButton = userBet.querySelector('.user-bet__cancel-button');
const userBetTotalSum = userBet.querySelector('.user-bet__total-sum');

// teams bet elements
const teamsBet = document.querySelector('.teams-bet');
const teamsBetList = teamsBet.querySelector('.teams-bet__coefficients');
const teamsBetRows = teamsBetList.querySelectorAll('.teams-bet__row');
const coefRadios = teamsBet.querySelectorAll('.coef__radio');
const showMoreCoefsButton = teamsBet.querySelector('.teams-bet__show-more');

// last bes elements
const lastBetsList = document.querySelector('.bets-list');

// betcoin-range
const betcoinRange = document.querySelector('.betcoin-range')
const betcoinSlider = betcoinRange.querySelector('.betcoin-range__slider');
const betcoinRangeNum = betcoinRange.querySelector('.betcoin-range__num');

// show more
const showMore = document.querySelectorAll('.show-more');



// components
new Tabs('#streams_tabs').start();
new ArrowDropdown('#stash_rarity_dropdown').start();



// libs
// custom scrollbar
new SimpleBar(document.getElementById('last_bets_list'), {
  autoHide: false
});



// functions calls & events
countStashItems();
countUserBetItems();

// stash filter & sort
delegate(rarityFilterDropdown, '.arrow-dropdown__list-button', 'click', filterItemsByRarity);
stashSort.addEventListener('click', sortOnClick);

// show more height toggling
showMore.forEach(block => {
  const wrapper = block.querySelector('.show-more__wrapper');
  const inner = block.querySelector('.show-more__inner');
  const items = block.querySelectorAll('.show-more__item');
  const button = block.querySelector('.show-more__button');

  hideSecondRowItems(wrapper, items, block);
  button.addEventListener('click', () => {
    toggleShowMoreBlockHeight(block, wrapper, items, inner, button);
  });
});

// last bets items show/hide
delegate(lastBetsList, '.open-button', 'click', toggleBetItemsHeight);

// betcoin range slider
betcoinRange.addEventListener('input', slideBetcoinsAmount);

// show/hide more bet coefficients
showMoreCoefsButton.addEventListener('click', betCoefsHeightToggle);
betCoefsHeightToggle();

// show/hide user bet
delegate(teamsBet, '.coef__radio', 'click', showHideUserBet);

// activate coef block
delegate(teamsBet, '.coef__radio', 'click', activateCoefBlock);

// show/hide teams bet details
delegate(teamsBet, '.open-button', 'click', toggleTeamsDetails);
showHideUserBet();

// bet item
stashItemsParent.addEventListener('click', event => {
  betItem(event, userBetBody);
})

userBetBody.addEventListener('click', event => {
  betItem(event, stashItemsParent);
});

// all in
allInButton.addEventListener('click', allIn);

// cancel bet
cancelBetButton.addEventListener('click', cancelBet);

// disable coefs radio
disableCoefsRadio();


// functions
// change height
function toggleHeight(wrapper, inner, minHeight = 0) {
  let innerMarginTop = getComputedStyle(inner).getPropertyValue('margin-top');
  let innerMarginBottom = getComputedStyle(inner).getPropertyValue('margin-bottom');
  innerMarginTop = innerMarginTop.slice(0, innerMarginTop.indexOf('p'));
  innerMarginBottom = innerMarginBottom.slice(0, innerMarginBottom.indexOf('p'));
  const innerMargins = Number(innerMarginTop) + Number(innerMarginBottom);

  const wrapperHeight = getHeight(wrapper);
  const innerHeight = getHeight(inner) + innerMargins;

  if (wrapperHeight === minHeight) {
    wrapper.style.height = `${innerHeight}px`;
  } else {
    wrapper.style.height = `${minHeight}px`;
  }
  return wrapperHeight;
}

function toggleFullHeight(wrapper, inner, button) {
  const currentHeight = toggleHeight(wrapper, inner);

  if (currentHeight === 0) {
    button.classList.add('open-button--active');
  } else {
    button.classList.remove('open-button--active');
  }
}

function toggleBetItemsHeight() {
  const parentItem = this.closest('.bets-item');
  const wrapper = parentItem.querySelector('.bets-item__content');
  const inner = parentItem.querySelector('.bets-item__items');
  toggleFullHeight(wrapper, inner, this)
}

function hideSecondRowItems(wrapper, insideItems, block) {
  const rowHeight = checkRowHeight(insideItems);
  const wrapperHeight = getHeight(wrapper);

  if (wrapperHeight > rowHeight + 20) {
    wrapper.style.height = `${rowHeight + 35}px`;
    block.classList.add('show-more--active');
  }
}

function checkRowHeight(rowItems) {
  let rowHeight = '';
  rowItems.forEach(item => {
    const itemHeight = getHeight(item);
    if (itemHeight !== 0) {
      rowHeight = itemHeight;
    }
  });
  return Number(rowHeight);
}

function toggleShowMoreBlockHeight(block, wrapper, insideItems, inner, button) {
  const rowHeight = checkRowHeight(insideItems);
  const isOpened = block.classList.contains('show-more--opened');
  toggleHeight(wrapper, inner, rowHeight + 35);

  if (!isOpened) {
    block.classList.add('show-more--opened');
    if (button) button.textContent = 'Show less';
  } else {
    block.classList.remove('show-more--opened');
    if (button) button.textContent = 'Show more';
  }
}

function correctShowMoreHeight(block) {
  const wrapper = block.querySelector('.show-more__wrapper');
  const inner = block.querySelector('.show-more__inner');
  const item = block.querySelectorAll('.show-more__item');
  const rowHeight = checkRowHeight(item);
  const innerHeight = getHeight(inner);

  wrapper.style.height = `${innerHeight}px`;
  console.log(innerHeight, rowHeight)
  if (innerHeight <= rowHeight || rowHeight === 0) {
    block.classList.remove('show-more--active');
    block.classList.remove('show-more--opened');
  } else {
    block.classList.add('show-more--active');
    block.classList.add('show-more--opened');
  }
}

function betCoefsHeightToggle() {
  const wrapper = document.querySelector('.teams-bet__coefficients-wrapper');
  let minHeight = 0;

  if (teamsBetRows.length < 5) return;

  teamsBetRows.forEach((item, index) => {
    let itemMargin = getComputedStyle(item).getPropertyValue('margin-top');
    itemMargin = itemMargin.slice(0, itemMargin.indexOf('p'));
    itemMargin = Number(itemMargin);
    const height = getHeight(item);

    if (index < 5) {
      minHeight += itemMargin ? height + itemMargin : height;
    }
  });

  const currentHeight = toggleHeight(wrapper, teamsBetList, minHeight);
  if (currentHeight > minHeight) {
    showMoreCoefsButton.classList.remove('teams-bet__show-more--active');
    showMoreCoefsButton.textContent = 'Show more';
  } else {
    showMoreCoefsButton.classList.add('teams-bet__show-more--active');
    showMoreCoefsButton.textContent = 'Show less';
  }
}

function showHideUserBet() {
  let checkedRadio = false;
  coefRadios.forEach(radio => {
    if (radio.checked) checkedRadio = true;
  });

  if (checkedRadio) {
    userBet.style.display = 'block';
  } else {
    userBet.style.display = 'none';
  }
}

function toggleTeamsDetails() {
  const details = document.querySelector('.details');
  const inner = details.querySelector('.details__inner');
  toggleFullHeight(details, inner, this);
}


// game items sorting by price
function sortElements(elements, parent, order) {
  let sortArray = [];
  elements.forEach(item => {
    sortArray.push({
      element: item,
      price: Number(item.dataset.price)
    });
  });

  switch (order) {
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
  const isActive = this.className.includes('sort--');
  const stashItemsToSort = document.querySelectorAll('.stash__items .game-item');

  if (!isActive) {
    this.classList.add('sort--descending');
  } else if (checkClass(this, 'sort--descending')) {
    changeClasses(this, 'sort--descending', 'sort--ascending');
  } else if (checkClass(this, 'sort--ascending')) {
    changeClasses(this, 'sort--ascending', 'sort--descending');
  }

  if (checkClass(this, 'sort--descending')) {
    sortElements(stashItemsToSort, stashItemsParent, 'descending');
  } else if (checkClass(this, 'sort--ascending')) {
    sortElements(stashItemsToSort, stashItemsParent, 'ascending');
  }
}


// count items and price
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
  const stashItemsToCount = document.querySelectorAll('.stash__items .game-item')
  const stashTotalInfo = countItemsAndPrice(stashItemsToCount);
  stashTotalSum.textContent = `${stashTotalInfo[0]} (${stashTotalInfo[1]}$)`;
}

function countUserBetItems() {
  const userBetItemsToCount = document.querySelectorAll('.user-bet__body .game-item')
  const betItemsTotalInfo = countItemsAndPrice(userBetItemsToCount);
  userBetTotalSum.textContent = `${betItemsTotalInfo[0]} (${betItemsTotalInfo[1]}$)`;
}


// filter items by rarity
function filterItemsByRarity() {
  const currentFilter = this.dataset.rarity.toLowerCase().trim();
  const stashItemsToFilter = document.querySelectorAll('.stash__items .game-item');

  let filteredItems = [];

  stashItemsToFilter.forEach(item => {
    filteredItems.push({
      element: item,
      rarity: item.dataset.rarity.toLowerCase().trim(),
    });
    item.style.display = 'none';
  });

  if (currentFilter === 'all') {
    filteredItems = filteredItems.map(item => {
      item.element.style.display = 'flex';
      return item.element;
    });
  } else {
    filteredItems = filteredItems
      .filter(item => item.rarity === currentFilter)
      .map(item => {
        item.element.style.display = 'flex';
        return item.element;
      });
  }

  stashItemsParent.append(...filteredItems);
  countStashItems();
  correctShowMoreHeight(stashBody);
}

// slide betcoins amount
function slideBetcoinsAmount({ target }) {
  switch (target) {
    case betcoinSlider:
      betcoinRangeNum.value = Number(betcoinSlider.value) || 0;
      break;

    case betcoinRangeNum:
      betcoinRangeNum.value = validateNumberInput(betcoinRangeNum.value);
      const isBiggerThanMax = Number(betcoinRangeNum.value) > betcoinSlider.max;

      if (isBiggerThanMax) betcoinRangeNum.value = betcoinSlider.max;
      betcoinSlider.value = Number(betcoinRangeNum.value) === 0 ?
        0 : Number(betcoinRangeNum.value);
      break;
  }

  changeBetcoinSum(Number(betcoinRangeNum.value));
  if (Number(betcoinRangeNum.value) === '') changeBetcoinSum(0);
}

function validateNumberInput(value) {
  value = value.replace(/[^.\d]+|^00+|^\./g, '')
    .replace(/^([^\.]*\.)|\./g, '$1');

  const dotIndex = value.indexOf('.');

  if (dotIndex !== -1) {
    const digitisAfterDot = value.slice(dotIndex).length;
    if (digitisAfterDot > 2) value = value.slice(0, dotIndex + 3);
  }

  return value;
}

function changeBetcoinSum(value) {
  const betcoin = document.querySelector('.betcoin');
  const betcoinSum = betcoin.querySelector('.betcoin__sum');
  betcoin.dataset.sum = value;
  betcoinSum.textContent = `${value}$`;
}

// bet item
function changeGameItemPlace({ target }, placeForItem) {
  const clickedItem = target.closest('.game-item');
  if (userBet.style.display === 'none' || !clickedItem) return;

  const itemToBet = clickedItem;
  itemToBet.remove();
  placeForItem.append(itemToBet);
  correctShowMoreHeight(stashBody);
}

function betItem(event, wrapper) {
  changeGameItemPlace(event, wrapper);
  countUserBetItems();
  countStashItems();
}

function allIn() {
  if (userBet.style.display === 'none') return;

  let stashItemsArray = Array.from(stashGameItems);
  stashItemsArray = stashItemsArray.filter(item => {
    if (item.style.display !== 'none') return item;
  });

  stashItemsArray.forEach(item => item.remove());
  userBetBody.append(...stashItemsArray);

  correctShowMoreHeight(stashBody);
  countStashItems();
  countUserBetItems();
}

function cancelBet() {
  const gameItems = document.querySelectorAll('.user-bet__body .game-item');

  if (gameItems.length > 0) {
    gameItems.forEach(item => item.remove());
    stashItemsParent.append(...gameItems);

    countStashItems();
    countUserBetItems();
    correctShowMoreHeight(stashBody);
  }

  if (Number(betcoinSlider.value) > 0) {
    betcoinSlider.value = 0;
    betcoinRangeNum.value = 0;
    changeBetcoinSum(0);
  }
}

// coefs
function activateCoefBlock({ target }) {
  const isRadio = target.classList.contains('coef__radio');
  if (!isRadio) return;
  const parentRow = target.closest('.teams-bet__row');
  teamsBetRows.forEach(row => row.classList.remove('teams-bet__row--chosen'));
  parentRow.classList.add('teams-bet__row--chosen');
}

function disableCoefsRadio() {
  const teamsBetCoefs = document.querySelectorAll('.coef');
  teamsBetCoefs.forEach(coef => {
    const isLocked = coef.classList.contains('coef--locked');
    const isDisabled = coef.classList.contains('coef--disabled');
    const radio = coef.querySelector('.coef__radio');
    if (isLocked || isDisabled) radio.disabled = true;

    const parentRow = coef.closest('.teams-bet__row');
    const rowTitle = parentRow.querySelector('.teams-bet__row-title');
    const rowCoefs = parentRow.querySelectorAll('.coef');
    let numberOfInactiveCoefs = 0;

    rowCoefs.forEach(item => {
      const isLocked = item.classList.contains('coef--locked')
      const isDisabled = item.classList.contains('coef--disabled')
      if (isLocked || isDisabled) numberOfInactiveCoefs++;
    });

    if (numberOfInactiveCoefs === 2) rowTitle.classList.add('teams-bet__row-title--disabled')
  })
}
