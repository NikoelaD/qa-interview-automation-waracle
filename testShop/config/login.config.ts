export const LoginConfig = {
  credentials: {
    valid: {
      email: "john.doe@example.com",
      password: "Password123",
    },
    invalidEmail: {
      email: "jon.doe@example.com",
      password: "qwerty",
      errorMessage: "Wrong email or password!",
    },
    invalidPassword: {
      email: "john.doe@example.com",
      password: "Password1234",
      errorMessage: "Wrong email or password!",
    },
  },
};
