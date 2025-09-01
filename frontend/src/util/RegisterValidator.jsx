
export function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export  const fullNameValidate = () => {
    const fullNameRegex =
      /^[A-Za-z]{2,}(?:[-'][A-Za-z]+)?\s[A-Za-z]{2,}(?:[-'][A-Za-z]+)?(?:\s[A-Za-z]{2,}(?:[-'][A-Za-z]+)?)*$/;
    return fullNameRegex.test(fullName);
  };