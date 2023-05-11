// imports
import { Tabs } from "./Tabs.js";

// variables
const lastBetsList = document.querySelector('.bets-list');


// events
lastBetsList.onclick = toggleBetItems;


// components
new Tabs('#streams_tabs').startEvents();


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
