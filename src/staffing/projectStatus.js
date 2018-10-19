export const PROJECT_STATUS = {
  'NEW': 'New Project',
  'SEARCH': 'Search for resources',
  'WAITFEEDBACK': 'Waiting for feedback',
  'HOLD': 'On hold',
  'BLOCKER': 'Blocker',
  'ACTIVE': 'Active Development'
};

export const getProjectStatusByKey = (key) => {
  if(!PROJECT_STATUS[key]) {
    return `Unknown project status translation for key = "${key}"`;
  }
  return PROJECT_STATUS[key];
};
