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
    const elementHeight = element.getBoundingClientRect().height;
    let marginTop = getComputedStyle(element).getPropertyValue('margin-top');
    let marginBottom = getComputedStyle(element).getPropertyValue('margin-bottom');
    marginTop = Number(marginTop.slice(0, marginTop.indexOf('p')));
    marginBottom = Number(marginBottom.slice(0, marginBottom.indexOf('p')));
    return elementHeight + marginTop + marginBottom;
  }
}

const changeClasses = helpers.changeClasses;
const checkClass = helpers.checkClass;
const delegate = helpers.delegate;
const getHeight = helpers.getHeight;

export {changeClasses, checkClass, delegate, getHeight};
