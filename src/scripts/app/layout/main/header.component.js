class MainHeaderCtrl {
	constructor(AppConstants, $scope) {
		'ngInject';

		this.appName = AppConstants.appName;
	}
}

let MainHeader = {
	controller: MainHeaderCtrl,
	templateUrl: './layout/main/header.html'
};

export default MainHeader;
