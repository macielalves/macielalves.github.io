export function getRandomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}   

export function getRandomBoolean() {
  return Math.random() < 0.5;
}   

export function getRandomDate() {
  return new Date(Math.random() * (Date.now() - Date.now() - 1000 * 60 * 60 * 24 * 365));
}

export function getRandomString(length) {
  return Math.random().toString(36).substring(2, length + 2);
}   

export function getRandomArray(length) {
  return Array.from({ length }, () => getRandomString(getRandomNumber(1, 10)));
}   

export function addOrAppendElement(el, parent){
    if (typeof el === 'string') {
        parent.innerHTML += el;
    } else if (el instanceof HTMLElement) {
        parent.appendChild(el);
    } else {
        console.log(el);
        console.error(`El não é uma string ou um HTMLElement`);
    }
}

export function validateId(id) {
  let validId = id;
  let counter = 1;

  while (document.getElementById(validId)) {
    validId = `${id}_${counter}`;
    counter++;
  }

  return validId;
}

export function checkWindowStateVisibleById(id) {
    const window = document.getElementById(id);
    if (window) {
      if (window.classList.contains('hidden') || window.classList.contains('minimized')) {
        return 'hidden';
      } else if (window.classList.contains('maximized')) {
        return 'maximized';
      } else {
        return 'visible';
      }
    } else {
      return null;
    }
  }


