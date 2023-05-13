// imports
import { Tabs } from "../components/Tabs/Tabs.js";
import { ArrowDropdown } from "../components/Dropdown/ArrowDropdown.js";


// variables
const lastBetsList = document.querySelector('.bets-list');
const sortStashButton = document.querySelector('.stash__sort');
const showMore = document.querySelectorAll('.show-more');
const rarityStashFilter = document.querySelector('.rarity-dropdown');

const showMoreWrapper = document.querySelector('.show-more__items-wrapper');
const stashItemsList = document.querySelector('.stash__items')
const stashItems = document.querySelectorAll('.stash__item');
const stashTotal = document.querySelector('.stash__total');


// function calls and events
lastBetsList.addEventListener('click', toggleBetItems);
sortStashButton.addEventListener('click', sortOnClick);
rarityStashFilter.addEventListener('click', filterItemsByRarity);

showMore.forEach(block => {
  const wrapper = block.querySelector('.show-more__items-wrapper');
  const inner = block.querySelector('.show-more__items-inner');
  const items = block.querySelectorAll('.show-more__item');
  const button = block.querySelector('.show-more__button');

  hideSecondRowItems(wrapper, items, block);
  button.addEventListener('click', () => {
    toggleItemsBlockHeight(block, wrapper, items, inner, button);
  })
});

countItemsAndPrice(stashItems, stashTotal);


// components
new Tabs('#streams_tabs').start();
new ArrowDropdown('#stash_rarity_dropdown').start();


// functions
function toggleBetItems(event) {
  const { target } = event;
  const toggleButton = target.closest('.bets-item__show-content');

  if (!toggleButton) return;

  const parentItem = toggleButton.closest('.bets-item');
  const listWrapperToToggle = parentItem.querySelector('.bets-item__content');
  const listToToggle = parentItem.querySelector('.bets-item__items-list');

  const listHeight = listToToggle.getBoundingClientRect().height;
  const listWrapperHeight = listWrapperToToggle.getBoundingClientRect().height;

  if (listWrapperHeight === 0) {
    listWrapperToToggle.style.height = `${listHeight}px`;
    parentItem.classList.add('bets-item--opened');
  } else {
    listWrapperToToggle.style.height = 0;
    parentItem.classList.remove('bets-item--opened');
  }
}


function hideSecondRowItems(wrapper, insideItems, block) {
  let rowHeight = '';
  insideItems.forEach(item => {
    const itemHeight = item.getBoundingClientRect().height;
    if (itemHeight !== 0) {
      rowHeight = itemHeight;
    }
  });
  const wrapperHeight = wrapper.getBoundingClientRect().height;

  if (wrapperHeight > rowHeight + 20) {
    wrapper.style.height = `${rowHeight + 35}px`;
    block.classList.add('show-more--active');
  }
}


function toggleItemsBlockHeight(block, wrapper, insideItems, inner, button) {
  let rowHeight = '';
  insideItems.forEach(item => {
    const itemHeight = item.getBoundingClientRect().height;
    if (itemHeight !== 0) {
      rowHeight = itemHeight;
    }
  });
  const innerHeight = inner.getBoundingClientRect().height;

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


function countItemsAndPrice(items, total) {
  const itemsCount = items.length;
  let itemsPrice = 0;
  items.forEach(item => {
    const price = item.dataset.price;
    itemsPrice += Number(price);
  })

  itemsPrice = itemsPrice.toFixed(2);

  const totalElement = total.querySelector('.total__sum');
  totalElement.textContent = `${itemsCount} (${itemsPrice}$)`;
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
  } else if (sortStashButton.classList.contains('sort--descending')) {
    sortStashButton.classList.remove('sort--descending');
    sortStashButton.classList.add('sort--ascending');
  } else if (sortStashButton.classList.contains('sort--ascending')) {
    sortStashButton.classList.add('sort--descending');
    sortStashButton.classList.remove('sort--ascending');
  }

  if (sortStashButton.classList.contains('sort--descending')) {
    sortElements(stashItems, stashItemsList, 'descending');
  } else if (sortStashButton.classList.contains('sort--ascending')) {
    sortElements(stashItems, stashItemsList, 'ascending');
  }
}


function filterItemsByRarity(event) {
  const {target} = event;
  const closestButton = target.closest('.arrow-dropdown__list-button');
  if (!closestButton) return;

  let rarityFilter = target.dataset.rarity;
  rarityFilter = rarityFilter.toLowerCase().trim();

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

  correctStashHeight();
}


function correctStashHeight() {
  const listHeight = stashItemsList.getBoundingClientRect().height;
  showMoreWrapper.style.height = `${listHeight}px`;

  // test
  if (listHeight < 100) {
    showMore[0].classList.remove('show-more--active');
  } else {
    showMore[0].classList.add('show-more--active');
  }
}
