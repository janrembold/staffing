import {
  loadDbBegin,
  loadDbSuccess,
  loadDbError,
  closeProjectSuccess,
  addStaffingSuccess,
  addProjectSuccess,
  updateProjectSuccess,
  addUserSuccess, updateUserSuccess, addUserCustomDaySuccess, updateUserCustomDaySuccess
} from './actions';
import store from './index';
import {config} from '../config';
import axios from 'axios';
import {defaultConfig} from "../vendor/axios/config";

export function loadDb() {
  return dispatch => {
    dispatch(loadDbBegin());

    return axios.all([
      axios.get(`${config.databaseHost}/users`, defaultConfig()),
      axios.get(`${config.databaseHost}/projects?year=${config.year}&closed=false`, defaultConfig()),
      axios.get(`${config.databaseHost}/userCustomDays?year=${config.year}`, defaultConfig())
    ]).then(axios.spread((users, projects, userCustomDays) => {
      dispatch(loadDbSuccess({
        users: users.data,
        projects: projects.data,
        userCustomDays: userCustomDays.data
      }));
    })).catch((error) => {
      dispatch(loadDbError(error))
    });
  };
}

export function closeProject(projectId) {
  return dispatch => {
    // dispatch(loadDbBegin());

    const state = store.getState();
    const { projects } = state.data;
    const project = Object.assign({}, projects.find((item) => item.id === projectId));
    project.closed = true;

    return axios(defaultConfig({
      method: 'PUT',
      url: `${config.databaseHost}/projects/${project.id}`,
      headers: { 'Content-Type': 'application/json' },
      data: project
    }))
      .then((response) => {
        dispatch(closeProjectSuccess(response.data));
      })
      .catch((error) => {
        console.error('error close project', error);
        // dispatch(loadDbError(error))
      });
  };
}

export function addStaffings(projectId, staffings) {
  return dispatch => {
    // dispatch(loadDbBegin());

    const state = store.getState();
    const { projects } = state.data;
    const project = Object.assign({}, projects.find((item) => item.id === projectId));
    project.staffings.push(...staffings);

    return axios(defaultConfig({
      method: 'PUT',
      url: `${config.databaseHost}/projects/${project.id}`,
      headers: { 'Content-Type': 'application/json' },
      data: project
    }))
      .then((response) => {
        dispatch(addStaffingSuccess(response.data));
      })
      .catch((error) => {
        console.error('error close project', error);
        // dispatch(loadDbError(error))
      });
  };
}

export function removeStaffing(projectId, userId, week, days) {
  return dispatch => {
    // dispatch(loadDbBegin());

    const state = store.getState();
    const { projects } = state.data;
    const project = Object.assign({}, projects.find((item) => item.id === projectId));
    project.staffings.splice(project.staffings.findIndex(elem => (elem.userId === userId && elem.week === week && elem.days === days)), 1);

    return axios(defaultConfig({
      method: 'PUT',
      url: `${config.databaseHost}/projects/${projectId}`,
      headers: { 'Content-Type': 'application/json' },
      data: project
    }))
      .then((response) => {
        dispatch(updateProjectSuccess(response.data));
      })
      .catch((error) => {
        console.error('error remove staffing', error);
        // dispatch(loadDbError(error))
      });
  };
}


export function addProject(project) {
  return dispatch => {
    // dispatch(loadDbBegin());

    return axios(defaultConfig({
      method: 'POST',
      url: `${config.databaseHost}/projects`,
      headers: { 'Content-Type': 'application/json' },
      data: project
    }))
      .then((response) => {
        dispatch(addProjectSuccess(response.data));
      })
      .catch((error) => {
        console.error('error adding project', error);
        // dispatch(loadDbError(error))
      });
  };
}

export function updateProject(project) {
  return dispatch => {
    // dispatch(loadDbBegin());

    return axios(defaultConfig({
      method: 'PUT',
      url: `${config.databaseHost}/projects/${project.id}`,
      headers: { 'Content-Type': 'application/json' },
      data: project
    }))
      .then((response) => {
        dispatch(updateProjectSuccess(response.data));
      })
      .catch((error) => {
        console.error('error updating project', error);
        // dispatch(loadDbError(error))
      });
  };
}

export function addUser(user) {
  return dispatch => {
    // dispatch(loadDbBegin());

    return axios(defaultConfig({
      method: 'POST',
      url: `${config.databaseHost}/users`,
      headers: { 'Content-Type': 'application/json' },
      data: user
    }))
      .then((response) => {
        dispatch(addUserSuccess(response.data));
      })
      .catch((error) => {
        console.error('error adding user', error);
        // dispatch(loadDbError(error))
      });
  };
}

export function updateUser(user) {
  return dispatch => {
    // dispatch(loadDbBegin());

    return axios(defaultConfig({
      method: 'PUT',
      url: `${config.databaseHost}/users/${user.id}`,
      headers: { 'Content-Type': 'application/json' },
      data: user
    }))
      .then((response) => {
        dispatch(updateUserSuccess(response.data));
      })
      .catch((error) => {
        console.error('error updating user', error);
        // dispatch(loadDbError(error))
      });
  };
}

export function addUserCustomDay(userCustomDay) {
  return dispatch => {
    // dispatch(loadDbBegin());

    return axios(defaultConfig({
      method: 'POST',
      url: `${config.databaseHost}/userCustomDays`,
      headers: { 'Content-Type': 'application/json' },
      data: userCustomDay
    }))
      .then((response) => {
        dispatch(addUserCustomDaySuccess(response.data));
      })
      .catch((error) => {
        console.error('error adding user custom day', error);
        // dispatch(loadDbError(error))
      });
  };
}

export function updateUserCustomDay(userCustomDay) {
  return dispatch => {
    // dispatch(loadDbBegin());

    return axios(defaultConfig({
      method: 'PUT',
      url: `${config.databaseHost}/userCustomDays/${userCustomDay.id}`,
      headers: { 'Content-Type': 'application/json' },
      data: userCustomDay
    }))
      .then((response) => {
        dispatch(updateUserCustomDaySuccess(response.data));
      })
      .catch((error) => {
        console.error('error updating user', error);
        // dispatch(loadDbError(error))
      });
  };
}
