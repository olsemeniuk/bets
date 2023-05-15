const helpers = {
  changeClasses: function (element, classToRemove, classToAdd) {
    element.classList.remove(classToRemove);
    element.classList.add(classToAdd);
  },

  checkClass: function (element, classToCheck) {
    return element.classList.contains(classToCheck);
  },

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
    return element.getBoundingClientRect().height
  },
}

export const changeClasses = helpers.changeClasses;
export const checkClass = helpers.checkClass;
export const delegate = helpers.delegate;
export const getHeight = helpers.getHeight;
