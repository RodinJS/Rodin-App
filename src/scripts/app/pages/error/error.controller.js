class ErrorCtrl {
  constructor(AppConstants) {
    'ngInject';

    this.appName = AppConstants.appName;

      angular.element(document.querySelector('.main-layout')).on('click mousedown mouseup touchstart touchend', (e)=>{
          return e.stopPropagation();
      })
  }

}

export default ErrorCtrl;
