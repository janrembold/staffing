export const config = {
  databaseHost: window.localStorage.getItem('databaseHost') || '',
  databaseToken: window.localStorage.getItem('databaseToken') || '',
  year: window.localStorage.getItem('year') || new Date().getFullYear()
};
