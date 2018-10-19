import {config} from "../../config";
import merge from 'lodash.merge';

export const defaultConfig = (conf) => {
  return merge({}, {
    headers: {
      token: config.databaseToken || window.localStorage.getItem('databaseToken')
    }
  }, conf);
};
