const errors = {
  Signin: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  CredentialsSignin: "Incorrect Email Or Password!! Please Try Again",
  default: "Unable to sign in.",
};

const SignInError = ({ error }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <div>{errorMessage}</div>;
};

export default SignInError;
