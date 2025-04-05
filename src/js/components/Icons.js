export default class Icon {
  constructor(src = '') {
    this._src = src;
  }

  get src() {
    return this._src;
  }

  setSrc(src) {
    this._src = src;
  }
}