/**
 * Created by kh.levon98 on 31-Oct-16.
 */

import * as _ from "lodash/lodash.min";

function ModalFactory($uibModal) {
  'ngInject';

  let model = {};

  let openModals = {};

  model.login = login;
  model.closeModal = closeModal;
  model.openModals = openModals;

  return model;

  function login(resolve = {}, closeActiveModal = true) {
    if (closeActiveModal) {
      closeModal(openModals);
    }

    return openModal($uibModal.open({
      animation: false,
      component: 'loginModal',
      resolve: resolve
    }));
  }

  function closeModal(modal = null) {

    if (_.isObject(modal)) {
      for (let i in modal) {
        let md = modal[i];
        _.isFunction(md.dismiss) && md.dismiss({$value: 'cancel'});
      }
    } else {
      _.isFunction(modal.dismiss) && modal.dismiss({$value: 'cancel'});
    }

  }

  function openModal(modal = null) {
    modal.__INDEX__ = (parseInt(_.last(Object.keys(openModals))) || 0) + 1;

    modal.closed.then(function () {
      delete openModals[modal.__INDEX__];
    });

    return (openModals[modal.__INDEX__] = modal);
  }

}

export default ModalFactory;