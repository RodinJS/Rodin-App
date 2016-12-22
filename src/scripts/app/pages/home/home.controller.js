class HomeCtrl {
    constructor(AppConstants, Project, User) {
        'ngInject';

        this.appName = AppConstants.appName;
        this._Project = Project;
        this._User = User;
        this.getPublishedList();
        if(this._User.current){
          this.getMyProjects();
        }

    }


    getPublishedList() {

        this._Project.getPublishedList().then(
            data => {
                console.log('PROJECTS LIST', data);
            },
            err => {
                console.log('SOME ERROR', err);
            }
        );

    }

    getMyProjects(){
        this._Project.getList().then(
            data=>{
                console.log('MY PROJECTS', data);
            },
            err=>{
                console.log('ERR', err);
            }
        )
    }

}

export default HomeCtrl;
