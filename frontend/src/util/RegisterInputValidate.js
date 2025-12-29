export const emailValidate = (email) => {
    return email.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$");
}

export const passwordValidate = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return passwordRegex.test(password);
}

export  const fullNameValidate = (name) => {
    const fullNameRegex =
      /^[A-Za-z]{2,}(?:[-'][A-Za-z]+)?\s[A-Za-z]{2,}(?:[-'][A-Za-z]+)?(?:\s[A-Za-z]{2,}(?:[-'][A-Za-z]+)?)*$/;
    return fullNameRegex.test(name);
  };