class MainFooterCtrl {
	constructor(AppConstants) {
		'ngInject';
		this.appName = AppConstants.appName;

		// Get today's date to generate the year
		this.date = new Date();
	}
}

let MainFooter = {
	controller: MainFooterCtrl,
	templateUrl: 'layout/main/footer.html'
};

export default MainFooter;
