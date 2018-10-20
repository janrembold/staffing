export const NEW = 'NEW';
export const SEARCH = 'SEARCH';
export const WAITFEEDBACK = 'WAITFEEDBACK';
export const HOLD = 'HOLD';
export const BLOCKER = 'BLOCKER';
export const ACTIVE = 'ACTIVE';

export const PROJECT_STATUS = {
  NEW: 'New Project',
  SEARCH: 'Search for resources',
  WAITFEEDBACK: 'Waiting for feedback',
  HOLD: 'On hold',
  BLOCKER: 'Blocker',
  ACTIVE: 'Active Development'
};

export const getProjectStatusByKey = (key) => {
  const uppercaseKey = key.toUpperCase();
  if(!PROJECT_STATUS[uppercaseKey]) {
    return `Unknown project status translation for key = "${key}"`;
  }
  return PROJECT_STATUS[uppercaseKey];
};
