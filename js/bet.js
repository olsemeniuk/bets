// imports
import { changeClasses, checkClass, delegate, getHeight } from "../modules/helpers.js";
import { ArrowDropdown } from "../components/Dropdown/ArrowDropdown.js";


// HTML elements
// stash elements
const stashBody = document.querySelector('.stash__body');
const rarityFilterDropdown = document.getElementById('stash_rarity_dropdown');
const stashSortButton = document.querySelector('.stash__sort');
const stashItemsParent = stashBody.querySelector('.stash__items');
const stashGameItems = stashItemsParent.querySelectorAll('.game-item');
const stashTotalSum = document.querySelector('.stash__total-sum');
const allInButton = document.querySelector('.stash__all-in')

// user bet elements
const userBet = document.querySelector('.user-bet');
const userBetInner = userBet.querySelector('.user-bet__inner');
const userBetBody = userBet.querySelector('.user-bet__body');
const cancelBetButton = userBet.querySelector('.user-bet__cancel-button');
const userBetTotalSum = userBet.querySelector('.user-bet__total-sum');

// teams bet elements
const teamsBet = document.querySelector('.teams-bet');
const teamsBetList = teamsBet.querySelector('.teams-bet__coefficients');
const teamsBetRows = teamsBetList.querySelectorAll('.teams-bet__row');
const coefRadios = teamsBet.querySelectorAll('.coef__radio');
const showMoreCoefsButton = teamsBet.querySelector('.teams-bet__show-more');

// last bets elements
const lastBetsList = document.querySelector('.bets-list');

// betcoin-range
const betcoinRange = document.querySelector('.betcoin-range')
const betcoinSlider = betcoinRange.querySelector('.betcoin-range__slider');
const betcoinRangeNum = betcoinRange.querySelector('.betcoin-range__num');

// show more
const showMore = document.querySelectorAll('.show-more');


// components
new ArrowDropdown('#stash_rarity_dropdown').start();


// libs
// custom scrollbar
new SimpleBar(document.getElementById('last_bets_list'), {
  autoHide: false
});

// sort and filter game items
const stashMixer = mixitup(stashItemsParent, {
  animation: {
    effects: 'fade translateZ(-100px)',
    duration: 500,
  }
});


stashSortButton.addEventListener('click', () => {
  const descendingClass = 'sort--descending';
  const ascendingClass = 'sort--ascending';
  const isDescending = stashSortButton.classList.contains(descendingClass);
  const isAscending = stashSortButton.classList.contains(ascendingClass);

  if (!isAscending && !isDescending) {
    stashSortButton.classList.add(descendingClass);
    stashMixer.sort('price:desc');
  }

  if (isAscending) {
    stashSortButton.classList.remove(ascendingClass);
    stashSortButton.classList.add(descendingClass);
    stashMixer.sort('price:desc');
  } else if (isDescending) {
    stashSortButton.classList.add(ascendingClass);
    stashSortButton.classList.remove(descendingClass);
    stashMixer.sort('price:asc');
  }
});


// functions calls & events
countStashItems();
countUserBetItems();

// stash filter & sort
delegate(rarityFilterDropdown, '.arrow-dropdown__list-button', 'click', function() {
  setTimeout(() => {
    correctShowMoreHeight(stashBody);
  }, 500);
  setTimeout(() => {
    countStashItems();
  }, 550);
});

// show more height toggling
showMore.forEach(block => {
  const button = block.querySelector('.show-more__button');
  hideSecondRowItems(block);
  button.addEventListener('click', () => {
    toggleShowMoreBlockHeight(block);
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
showHideUserBet();

// activate coef block
delegate(teamsBet, '.coef__radio', 'click', activateCoefBlock);

// show/hide teams bet details
delegate(teamsBet, '.open-button', 'click', toggleTeamsDetails);

// bet item
stashItemsParent.addEventListener('click', event => {
  betItem(event, userBetInner);
})

userBetInner.addEventListener('click', event => {
  betItem(event, stashItemsParent);
});

// all in
allInButton.addEventListener('click', allIn);

// cancel bet
cancelBetButton.addEventListener('click', cancelBet);

// disable coefs radio
disableCoefsRadio();

// mobile tabs
const mobileTabsButtonsRow = document.querySelector('.mobile-tabs__buttons');
delegate(mobileTabsButtonsRow, '.mobile-tabs__button', 'click', mobileTabs);

// streams tabs
const streamsButtonsRow = document.querySelector('.streams__tabs-buttons');
delegate(streamsButtonsRow, '.streams__tabs-button', 'click', streamTabs);


// functions
// change height
function toggleHeight(wrapper, inner, minHeight = 0) {
  const wrapperHeight = getHeight(wrapper);
  const innerHeight = getHeight(inner);

  if (wrapperHeight <= minHeight) {
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

function hideSecondRowItems(block) {
  const wrapper = block.querySelector('.show-more__wrapper');
  const insideItems = block.querySelectorAll('.show-more__item');
  const rowHeight = checkRowHeight(insideItems);
  const wrapperHeight = getHeight(wrapper);

  if (wrapperHeight > rowHeight) {
    wrapper.style.height = `${rowHeight + (rowHeight / 100 * 35)}px`;
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

function toggleShowMoreBlockHeight(block) {
  const wrapper = block.querySelector('.show-more__wrapper');
  const inner = block.querySelector('.show-more__inner');
  const button = block.querySelector('.show-more__button');
  const insideItems = block.querySelectorAll('.show-more__item');

  const rowHeight = checkRowHeight(insideItems);
  const isOpened = block.classList.contains('show-more--opened');
  toggleHeight(wrapper, inner, rowHeight + (rowHeight / 100 * 35));

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
  const isMobile = checkIfIsMobile();
  if (teamsBetRows.length <= 5) {
    teamsBet.classList.add('teams-bet--small');
    return;
  }
  teamsBetRows.forEach((item, index) => {
    const height = getHeight(item);
    if (index < 5) {
      minHeight += height;
    }
  });

  const currentHeight = toggleHeight(wrapper, teamsBetList, minHeight);

  if (currentHeight > minHeight) {
    showMoreCoefsButton.classList.remove('teams-bet__show-more--active');
    showMoreCoefsButton.textContent = 'Show more';
    if (isMobile) showMoreCoefsButton.textContent = 'More';
  } else {
    showMoreCoefsButton.classList.add('teams-bet__show-more--active');
    showMoreCoefsButton.textContent = 'Show less';
    if (isMobile) showMoreCoefsButton.textContent = 'Less';
  }
}

function showHideUserBet() {
  const userBetContent = userBet.querySelector('.user-bet__content');

  let checkedRadio = false;
  coefRadios.forEach(radio => {
    if (radio.checked) checkedRadio = true;
  });


  if (checkedRadio) {
    userBet.style.display = 'block';
    setTimeout(() => {
      const userBetContentHeight = getHeight(userBetContent);
      userBet.style.height = `${userBetContentHeight}px`;
    });
    setTimeout(() => {
      userBet.style.height = 'auto';
      toggleShowMoreBlockHeight(userBetBody);
    }, 300);
  } else {
    userBet.style.display = 'none';
    userBet.style.height = '0'
  }
}

function toggleTeamsDetails() {
  const details = document.querySelector('.details');
  const inner = details.querySelector('.details__inner');
  toggleFullHeight(details, inner, this);
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
  const betcoinsAmount = Number(betcoinRangeNum.value);
  const userBetItemsToCount = document.querySelectorAll('.user-bet__inner .game-item')
  const betItemsTotalInfo = countItemsAndPrice(userBetItemsToCount);
  const itemsPrice = Number(betItemsTotalInfo[1]);
  const finalSum = (betcoinsAmount + itemsPrice).toFixed(2);
  userBetTotalSum.textContent = `${betItemsTotalInfo[0]} (${finalSum}$)`;
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
  countUserBetItems();
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
  stashMixer.remove(itemToBet, true, () => {
    placeForItem.append(itemToBet);

    itemToBet.style.display = 'inline-block';
    itemToBet.style.transform = 'scale(0)';
    itemToBet.style.transition = 'all 0.3s';

    correctShowMoreHeight(stashBody);
    correctShowMoreHeight(userBetBody);

    setTimeout(() => {
      itemToBet.style.transform = 'scale(1)';
      countUserBetItems();
      countStashItems();
    });
  });

}

function betItem(event, wrapper) {
  changeGameItemPlace(event, wrapper);
}

function allIn() {
  if (userBet.style.display === 'none') return;

  let stashItemsArray = Array.from(stashGameItems);
  stashItemsArray = stashItemsArray.filter(item => {
    if (item.style.display !== 'none') return item;
  });

  stashItemsArray.forEach(item => item.remove());
  userBetInner.append(...stashItemsArray);

  correctShowMoreHeight(stashBody);
  correctShowMoreHeight(userBetBody);
  countStashItems();
  countUserBetItems();
}

function cancelBet() {
  const gameItems = document.querySelectorAll('.user-bet__inner .game-item');

  if (gameItems.length > 0) {
    gameItems.forEach(item => item.remove());
    stashItemsParent.append(...gameItems);
    countStashItems();
    correctShowMoreHeight(stashBody);
    correctShowMoreHeight(userBetBody);
  }

  if (Number(betcoinSlider.value) > 0) {
    betcoinSlider.value = 0;
    betcoinRangeNum.value = 0;
    changeBetcoinSum(0);
  }
  countUserBetItems();
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
      const isLocked = item.classList.contains('coef--locked');
      const isDisabled = item.classList.contains('coef--disabled');
      if (isLocked || isDisabled) numberOfInactiveCoefs++;
    });

    if (numberOfInactiveCoefs === 2) rowTitle.classList.add('teams-bet__row-title--disabled');
  });
}

function checkIfIsMobile() {
  let width = document.documentElement.clientWidth;
  return width <= 480;
}

// tabs
function tabs(allButtons, allContent, button, activeButtonClass, activeContentClass) {
  const buttonData = button.dataset.button;

  allButtons.forEach(item => {
    item.classList.remove(activeButtonClass);
    button.classList.add(activeButtonClass);
  });

  allContent.forEach(item => {
    const contentData = item.dataset.content;
    item.classList.remove(activeContentClass);
    if (buttonData === contentData) {
      item.classList.add(activeContentClass);
    }
  });
}

function mobileTabs() {
  const allContent = document.querySelectorAll('.mobile-tabs__content');
  const allButtons = document.querySelectorAll('.mobile-tabs__button');
  const activeButton = 'mobile-tabs__button--active';
  const activeContent = 'mobile-tabs__content--active';

  tabs(allButtons, allContent, this, activeButton, activeContent);
}

function streamTabs() {
  const allContent = document.querySelectorAll('.streams__content-item');
  const allButtons = document.querySelectorAll('.streams__tabs-button');
  const activeButton = 'streams__tabs-button--active';
  const activeContent = 'streams__content-item--active';

  tabs(allButtons, allContent, this, activeButton, activeContent);
}

// function sortOnClick() {
  // const currentSorting = stashSortButton.dataset.sort;
  // if (currentSorting === 'price:asc') {
  //   stashSortButton.dataset.sort = 'price:desc';
  // }
// }


// function animateItemRemove(item) {
//   const itemWidth = item.getBoundingClientRect().width;
//   item.style.transform = 'scale(0)';
//   item.style.marginRight = `-${itemWidth}px`;
//   setTimeout(() => item.remove(), 300);
//   return item;
// }

// function animateItemAppend(item, parent) {
//   setTimeout(() => {
//     parent.append(item);
//     item.style.marginRight = '20px';
//   }, 310);
//   setTimeout(() => {
//     item.style.transform = 'scale(1)';
//   }, 320);
// }
