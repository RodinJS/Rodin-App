class ErrorCtrl {
  constructor(AppConstants) {
    'ngInject';

    this.appName = AppConstants.appName;
    alert("init error ctrl")
  }

}

export default ErrorCtrl;
