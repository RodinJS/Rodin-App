export class APP {
    constructor (params) {
        this.domElement = params.domElement;
        this.API = params.API;

        this.getProjects();
    }

    getProjects() {
        let filters = {
            // skip: 0,
            // limit: 20
        };

        this.API.getProjects('all', filters).then(
            data => {
                console.log(data);
            },
            err => {
                console.log(err);
            }
        )
    }
}
