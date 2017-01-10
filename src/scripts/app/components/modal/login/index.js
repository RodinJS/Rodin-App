import LoginCtrl from './controller';

const Login = {
  templateUrl: 'app/components/modal/login/index.html',
  controller: LoginCtrl,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
};

export default Login;