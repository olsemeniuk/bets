// helping functions
const helpers = {
  delegate: function (parent, selector, eventName, handler) {
    parent.addEventListener(eventName, event => {
      const { target } = event;
      const element = target.closest(selector);

      if (element && parent.contains(element)) {
        handler.call(element, event);
      }
    });
  },

  getHeight: function (element) {
    const elementHeight = element.getBoundingClientRect().height;
    let marginTop = parseInt(getComputedStyle(element).getPropertyValue('margin-top'));
    let marginBottom = parseInt(getComputedStyle(element).getPropertyValue('margin-bottom'));
    return elementHeight + marginTop + marginBottom;
  }
}

const delegate = helpers.delegate;
const getHeight = helpers.getHeight;


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
const lastBets = document.querySelector('.last-bets');
const lastBetsList = lastBets.querySelector('.bets-list');

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
const customScroll = new SimpleBar(document.getElementById('last_bets_list'), {
  autoHide: false
});

// mixitup
const stashMixer = mixitup(stashItemsParent, {
  animation: {
    effects: 'fade translateZ(-100px)',
    duration: 300,
  }
});



// functions calls & events
document.addEventListener('DOMContentLoaded', () => {
  correctShowMoreHeight(stashBody);
  countStashItems();
  countUserBetItems();
  betCoefsHeightToggle();
  changeStashMinHeight();
  disableItemCheckbox();
});

// sort stash game items
stashSortButton.addEventListener('click', sortOnClick);

// height correction after stash filter & sort
delegate(rarityFilterDropdown, '.arrow-dropdown__list-button', 'click', function () {
  setTimeout(() => {
    countStashItems();
    correctShowMoreHeight(stashBody);
  }, 350);
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

teamsBet.addEventListener('click', () => {
  changeBetInfoText();
  countUserBetItems();
});

// show/hide user bet
delegate(teamsBet, '.coef__radio', 'click', showHideUserBet);
showHideUserBet();

// activate coef block
delegate(teamsBet, '.coef__radio', 'click', activateCoefBlock);

// show/hide teams bet details
delegate(teamsBet, '.open-button', 'click', toggleTeamsDetails);

// bet item
stashItemsParent.addEventListener('click', event => {
  changeGameItemPlace(event, userBetInner);
});

userBetInner.addEventListener('click', event => {
  changeGameItemPlace(event, stashItemsParent);
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

betcoinHeightFix();

const betsItem = document.querySelectorAll('.bets-item');
betsItem.forEach(item => countBetsItemItemsPrice(item))

customScroll.getScrollElement().addEventListener('scroll', () => {
  handleVerticalShadows(lastBetsList, customScroll)
});

addVerticalBottomShadow(lastBetsList, lastBets)
disableSubmitButton();
mobileTabsActiveBg();


window.addEventListener('resize', () => {
  const repeatCorrections = setInterval(() => {
    correctShowMoreHeight(stashBody);
    correctShowMoreHeight(userBetBody);
  }, 250);

  setTimeout(() => {
    clearInterval(repeatCorrections);
  }, 500);

  mobileTabsActiveBg();
  mobileTabsBgSize();
  correctBetCoefsHeightOnResize();
  addVerticalBottomShadow(lastBetsList, lastBets);
});


// functions
// change height
function toggleHeight(wrapper, inner, minHeight = 0, transitionTime = 500) {
  const wrapperHeight = getHeight(wrapper);
  const innerHeight = getHeight(inner);

  if (wrapperHeight <= minHeight + 10) {
    wrapper.style.height = `${innerHeight}px`;
    setTimeout(() => {
      wrapper.style.height = `100%`;
    }, transitionTime);
  } else {
    wrapper.style.transition = 'none';
    wrapper.style.height = `${innerHeight}px`;
    setTimeout(() => {
      wrapper.style.transition = `all ${transitionTime}ms ease-in-out`;
      wrapper.style.height = `${minHeight}px`;
    });
  }
  return wrapperHeight;
}

function toggleFullHeight(wrapper, inner, button, transitionTime = 500) {
  const currentHeight = toggleHeight(wrapper, inner, 0, transitionTime);

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
  toggleFullHeight(wrapper, inner, this, 300)
}

function checkRowHeight(rowItems) {
  let rowHeight = 0;
  rowItems.forEach(item => {
    const itemHeight = getHeight(item);
    if (item.style.display === 'none') return;
    if (itemHeight > rowHeight) {
      rowHeight = itemHeight;
    }
  });
  return Number(rowHeight);
}

function countMinShowMoreHight(block) {
  const inner = block.querySelector('.show-more__inner');
  const item = block.querySelectorAll('.show-more__item');

  const rowHeight = checkRowHeight(item);
  const isMobile = checkIfIsMobile();
  const percentToShowNextRow = isMobile ? 35 : 25;

  const innerPaddingTop = parseInt(window.getComputedStyle(inner).getPropertyValue('padding-top'));
  const innerPaddingBottom = parseInt(window.getComputedStyle(inner).getPropertyValue('padding-bottom'));

  if ((!isNaN(innerPaddingBottom) && innerPaddingBottom > 0) &&
    (!isNaN(innerPaddingTop) && innerPaddingTop > 0)) {
    return rowHeight + innerPaddingBottom + innerPaddingTop + (rowHeight / 100 * percentToShowNextRow);
  } else if (!isNaN(innerPaddingBottom) && innerPaddingBottom > 0) {
    return rowHeight + innerPaddingBottom + (rowHeight / 100 * percentToShowNextRow);
  } else if (!isNaN(innerPaddingTop) && innerPaddingTop > 0) {
    return rowHeight + innerPaddingTop + (rowHeight / 100 * percentToShowNextRow);
  } else {
    return rowHeight + (rowHeight / 100 * percentToShowNextRow);
  }
}

function hideSecondRowItems(block) {
  const wrapper = block.querySelector('.show-more__wrapper');
  const rowHeight = countMinShowMoreHight(block);
  const wrapperHeight = getHeight(wrapper);

  if (wrapperHeight > rowHeight * 2) {
    wrapper.style.height = `${rowHeight}px`;
    block.classList.add('show-more--active');
  }
}

function toggleShowMoreBlockHeight(block) {
  const wrapper = block.querySelector('.show-more__wrapper');
  const inner = block.querySelector('.show-more__inner');
  const button = block.querySelector('.show-more__button');
  const rowHeight = countMinShowMoreHight(block);

  toggleHeight(wrapper, inner, rowHeight);

  const isOpened = block.classList.contains('show-more--opened');
  if (!isOpened) {
    block.classList.add('show-more--opened');
    if (button) button.textContent = 'Show less';
  } else {
    block.classList.remove('show-more--opened');
    if (button) button.textContent = 'Show more';
  }
}

function betCoefsHeightToggle() {
  const wrapper = document.querySelector('.teams-bet__coefficients-wrapper');
  const minHeight = getCoefsMinHeight();
  if (minHeight === 0) return;
  const currentHeight = toggleHeight(wrapper, teamsBetList, minHeight, 300);
  if (currentHeight > minHeight) {
    teamsBet.classList.remove('teams-bet--opened');
  } else {
    teamsBet.classList.add('teams-bet--opened');
  }
  checkBetCoefsHeight(currentHeight, minHeight);
  window.addEventListener('resize', () => {
    checkBetCoefsHeight(currentHeight, minHeight);
  });
}

function getCoefsMinHeight() {
  let minHeight = 0;
  if (teamsBetRows.length <= 5) {
    teamsBet.classList.add('teams-bet--small');
    return 0;
  }
  teamsBetRows.forEach((item, index) => {
    const height = getHeight(item);
    if (index < 5) {
      minHeight += height;
    }
  });

  return minHeight;
}

function correctBetCoefsHeightOnResize() {
  const minHeight = getCoefsMinHeight();
  const isOpened = teamsBet.classList.contains('teams-bet--opened');
  if (minHeight === 0) return;
  const wrapper = document.querySelector('.teams-bet__coefficients-wrapper');
  if (isOpened) {
    wrapper.style.height = '100%';
    return;
  }
  wrapper.style.height = `${minHeight}px`;
}

function checkBetCoefsHeight(currentHeight, minHeight) {
  const isMobile = checkIfIsMobile();
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
    betInfoShow();
    userBet.style.display = 'block';
    setTimeout(() => {
      const userBetContentHeight = getHeight(userBetContent);
      userBet.style.height = `${userBetContentHeight}px`;
    });
    setTimeout(() => {
      userBet.style.height = 'auto';
    }, 300);
  } else {
    userBet.style.display = 'none';
    userBet.style.height = '0'
  }
  disableItemCheckbox();
}

function toggleTeamsDetails() {
  const details = document.querySelector('.details');
  const inner = details.querySelector('.details__inner');
  toggleFullHeight(details, inner, this, 300);
}

function correctShowMoreHeight(block) {
  const wrapper = block.querySelector('.show-more__wrapper');
  const inner = block.querySelector('.show-more__inner');
  const button = block.querySelector('.show-more__button');
  const items = block.querySelectorAll('.show-more__item');

  const rowHeight = countMinShowMoreHight(block);
  const innerHeight = getHeight(inner);
  const isOpened = block.classList.contains('show-more--opened');

  const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');

  if (innerHeight <= rowHeight || visibleItems.length === 0) {
    block.classList.remove('show-more--active');
    block.classList.remove('show-more--opened');
    wrapper.style.height = '100%';
    refreshShowMoreTransition(wrapper);

  } else {
    block.classList.add('show-more--active');
    if (isOpened) {
      wrapper.style.height = '100%';
      refreshShowMoreTransition(wrapper);
      button.textContent = 'Show less';
    } else {
      wrapper.style.height = `${rowHeight}px`;
      block.classList.remove('show-more--opened');
      button.textContent = 'Show more';
      refreshShowMoreTransition(wrapper);
    }
  }
  changeStashMinHeight();
}

function refreshShowMoreTransition(wrapper) {
  wrapper.style.transition = 'none';
  setTimeout(() => {
    wrapper.style.transition = 'all 0.5s ease-in-out';
  }, 500);
}

function changeStashMinHeight() {
  const items = stashItemsParent.querySelectorAll('.game-item');
  const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');

  if (visibleItems.length === 0) {
    stashItemsParent.style.minHeight = '125px';
  } else {
    stashItemsParent.style.minHeight = '70px';
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
  const betcoinsAmount = Number(betcoinRangeNum.value);
  const userBetItemsToCount = document.querySelectorAll('.user-bet__inner .game-item')
  const betItemsTotalInfo = countItemsAndPrice(userBetItemsToCount);
  const itemsPrice = Number(betItemsTotalInfo[1]);
  const finalSum = (betcoinsAmount + itemsPrice).toFixed(2);
  userBetTotalSum.textContent = `${betItemsTotalInfo[0]} (${finalSum}$)`;

  if (betItemsTotalInfo[0] === 0 && finalSum > 0) {
    userBetTotalSum.textContent = `1 (${finalSum}$)`;
  }

  disableSubmitButton();
  betInfoTextRefresh(finalSum);
}

function betInfoTextRefresh(finalSum) {
  const coefX = changeBetInfoText();
  const betInfoMoneyFor = document.querySelector('.bet-info__money-for');
  const betInfoMoneyGet = document.querySelector('.bet-info__money-get');

  const betInfoMoneyForSum = Number(finalSum);
  const betInfoMoneyGetSum = (Number(finalSum) * coefX) - finalSum || 0;

  betInfoMoneyFor.textContent = `$${roundNumber(betInfoMoneyForSum)}`;
  betInfoMoneyGet.textContent = `$${roundNumber(betInfoMoneyGetSum)}`;
}

function roundNumber(number) {
  const dotIndex = String(number).indexOf('.');
  if (dotIndex === -1) return number;
  const numbersAfterDot = String(number).slice(dotIndex + 1).length;
  if (numbersAfterDot > 2) {
    return number.toFixed(2);
  }
  return number;
}

function countBetsItemItemsPrice(item) {
  const itemsToCount = item.querySelectorAll('.game-item');
  if (itemsToCount.length === 0) return;
  const itemsPriceBlock = item.querySelector('.bets-item__items-price');
  const itemsTotal = countItemsAndPrice(itemsToCount)[1];
  itemsPriceBlock.textContent = `$${itemsTotal}`;
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
function disableItemCheckbox() {
  stashGameItems.forEach(item => {
    const checkbox = item.querySelector('.game-item__checkbox');
    if (userBet.style.display === 'none') {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });
}

function changeGameItemPlace({ target }, placeForItem) {
  let checkedItem = '';
  if (target.classList.contains('game-item__checkbox')) {
    checkedItem = target.closest('.game-item');
  }

  if (userBet.style.display === 'none' || !checkedItem) return;

  const itemToBet = checkedItem;
  itemToBet.remove();
  placeForItem.append(itemToBet);
  refreshBlocksAfterItemBet()
}

function allIn() {
  if (userBet.style.display === 'none') return;

  let stashItemsArray = Array.from(stashGameItems);
  stashItemsArray = stashItemsArray.filter(item => {
    if (item.style.display !== 'none') return item;
  });

  stashItemsArray.forEach(item => item.remove());
  userBetInner.append(...stashItemsArray);
  refreshBlocksAfterItemBet()
}

function cancelBet() {
  const gameItems = document.querySelectorAll('.user-bet__inner .game-item');

  if (gameItems.length > 0) {
    gameItems.forEach(item => item.remove());
    stashItemsParent.append(...gameItems);
  }

  if (Number(betcoinSlider.value) > 0) {
    betcoinSlider.value = 0;
    betcoinRangeNum.value = 0;
    changeBetcoinSum(0);
  }

  refreshBlocksAfterItemBet()
}

function refreshBlocksAfterItemBet() {
  countStashItems();
  countUserBetItems();
  betcoinHeightFix();
  correctShowMoreHeight(stashBody);
  correctShowMoreHeight(userBetBody);
  stashMixer.forceRefresh();
}

// coefs
function activateCoefBlock() {
  const parentRow = this.closest('.teams-bet__row');
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

function checkIfIsTablet() {
  let width = document.documentElement.clientWidth;
  return width <= 768;
}

// tabs
function tabs(allButtons, allContent, button, activeButtonClass, activeContentClass) {
  const buttonData = button.dataset.button;

  allButtons.forEach(item => {
    item.classList.remove(activeButtonClass);
    button.classList.add(activeButtonClass);
    if (item.classList.contains('mobile-tabs__button')) {
      addVerticalBottomShadow(lastBetsList, lastBets);
    }
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

  const activeButtonClass = 'mobile-tabs__button--active';
  const activeContentClass = 'mobile-tabs__content--active';

  tabs(allButtons, allContent, this, activeButtonClass, activeContentClass);

  mobileTabsActiveBg();
  mobileTabsBgSize();
}

function mobileTabsActiveBg() {
  const buttonsRow = document.querySelector('.mobile-tabs__buttons');

  if (!document.querySelector('.mobile-tabs__button--active-bg')) {
    const activeBgHTML = document.createElement('span');
    activeBgHTML.className = 'mobile-tabs__button--active-bg';
    buttonsRow.prepend(activeBgHTML);
  }

  const activeBg = document.querySelector('.mobile-tabs__button--active-bg');
  const activeButton = document.querySelector('.mobile-tabs__button--active');

  const buttonOffset = activeButton.offsetLeft;
  const buttonWidth = activeButton.getBoundingClientRect().width;

  activeBg.style.width = `${buttonWidth}px`;
  activeBg.style.transform = `translateX(${buttonOffset}px)`;
}

function mobileTabsBgSize() {
  const mobileTabs = document.querySelector('.mobile-tabs');
  const activeContent = document.querySelector('.mobile-tabs__content--active');

  mobileTabs.style.setProperty('--bg-height', `${getHeight(activeContent)}px`);
}

function streamTabs() {
  const allContent = document.querySelectorAll('.streams__content-item');
  const allButtons = document.querySelectorAll('.streams__tabs-button');
  const activeButtonClass = 'streams__tabs-button--active';
  const activeContentClass = 'streams__content-item--active';

  tabs(allButtons, allContent, this, activeButtonClass, activeContentClass);
}

function betInfoShow() {
  const betInfo = document.querySelector('.bet-info');
  const betInfoPlaceholder = betInfo.querySelector('.bet-info__placeholder');
  const betInfoPlacingBet = betInfo.querySelector('.bet-info__placing-bet');

  betInfoPlaceholder.style.display = 'none';
  betInfoPlacingBet.style.display = 'block';
}

function changeBetInfoText() {
  const radios = document.querySelectorAll('.coef__radio');
  const teams = document.querySelectorAll('.teams-bet__team');
  let teamName = '';
  let activeRadio = '';

  radios.forEach(radio => {
    if (radio.checked) {
      activeRadio = radio;
    }
  });

  if (!activeRadio) return;
  const radioValue = activeRadio.value;
  const radioTeamNum = radioValue.slice(radioValue.indexOf('_') + 1);
  teams.forEach(team => {
    const teamNum = team.dataset.team;
    if (teamNum === radioTeamNum) {
      const name = team.querySelector('.teams-bet__team-name');
      teamName = name.textContent;
    }
  });

  const parentRow = activeRadio.closest('.teams-bet__row');
  const title = parentRow.querySelector('.teams-bet__row-title span');
  const titleText = title.textContent;

  const titleContainsIcon = title.classList.contains('icon');
  let icon = '';
  if (titleContainsIcon) {
    title.classList.forEach(titleClass => {
      if (titleClass.includes('icon--') && titleClass !== 'icon--dot') icon = titleClass;
    });
  }

  const parentCoef = activeRadio.closest('.coef');
  const coefX = Number(parentCoef.querySelector('.coef__x').textContent.slice(1));
  const betInfoType = document.querySelector('.bet-info__type');

  if (!icon) {
    betInfoType.innerHTML = `${teamName} <span>${titleText}</span>`;
  } else {
    betInfoType.innerHTML = `${teamName} <span class="icon ${icon}">${titleText}</span>`;
  }

  return coefX;
}

function betcoinHeightFix() {
  const gameItem = userBetInner.querySelector('.game-item');
  const userBetBetcoin = userBetInner.querySelector('.betcoin');
  if (!gameItem) {
    userBetBetcoin.style.minHeight = '70px';
    userBetInner.style.justifyContent = 'center';
  } else {
    userBetBetcoin.style.minHeight = 'auto';
    userBetInner.style.justifyContent = 'flex-start';
  }
}

function sortOnClick() {
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
}

function handleVerticalShadows(block, scrollBar) {
  const scroll = scrollBar.getScrollElement();
  const distanceToTop = scroll.scrollTop;
  const distanceToBottom = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight;

  if (distanceToTop > 5) {
    block.classList.add('vertical-shadow--top');
  } else {
    block.classList.remove('vertical-shadow--top');
  }

  if (distanceToBottom < 5) {
    block.classList.remove('vertical-shadow--bottom');
  } else {
    block.classList.add('vertical-shadow--bottom');
  }
}

function addVerticalBottomShadow(block, parent) {
  if (block.classList.contains('bets-list')) {
    let listHeight = 0;
    const listItems = block.querySelectorAll('.bets-item');
    setTimeout(() => {
      listItems.forEach(item => {
        listHeight += getHeight(item);
      });
      addShadow(listHeight > parent.scrollHeight);
    }, 300);
  } else {
    addShadow(block.offsetHeight < parent.scrollHeight)
  }

  function addShadow(condition) {
    if (condition) {
      block.classList.add('vertical-shadow--bottom');
    } else {
      block.classList.remove('vertical-shadow--bottom');
    }
  }
}

function disableSubmitButton() {
  const submitButton = document.querySelector('.bet-form__submit');
  const totalIsEmpry = userBetTotalSum.textContent === '0 (0.00$)';
  if (totalIsEmpry) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
}
