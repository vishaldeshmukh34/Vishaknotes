export const saveAuth = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  localStorage.setItem('email', data.email);
};

export const getToken = () => localStorage.getItem('token');
export const getUsername = () => localStorage.getItem('username');
export const isLoggedIn = () => !!localStorage.getItem('token');

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
};