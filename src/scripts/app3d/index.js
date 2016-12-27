export class APP {
  constructor(params) {
    this.domElement = params.domElement;
    this.API = params.API;

    this.projects = [];
    this.window = APP.initWindow(params.domElement);
  }

  /**
   * Static method init window
   * @param _window
   * @returns {*}
   */
  static initWindow(_window) {
    Object.defineProperty(_window, "innerWidth", {
      get: function () {
        return this.offsetWidth;
      }
    });
    Object.defineProperty(_window, "innerHeight", {
      get: function () {
        return this.offsetHeight;
      }
    });

    return _window;
  }
}
