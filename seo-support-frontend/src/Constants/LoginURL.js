const { REACT_APP_BE_URL } = process.env;

export const LoginURL = {
  normalLogin: `${REACT_APP_BE_URL}/login`,

  googleAuth: `${REACT_APP_BE_URL}/auth/google/user`,

  googleLogin: `${REACT_APP_BE_URL}/auth/google`,
};

export const authUserURL = `${REACT_APP_BE_URL}/auth/user`;
