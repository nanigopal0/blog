export const emailValidate = (email:string):boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

export const passwordValidate = (password:string) :boolean=> {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%&*^?])[A-Za-z\d@$!#%&*^?]{8,}$/;
    return passwordRegex.test(password);
}

export  const fullNameValidate = (name:string):boolean => {
    const fullNameRegex =
      /^[A-Za-z]{2,}(?:[-'][A-Za-z]+)?\s[A-Za-z]{2,}(?:[-'][A-Za-z]+)?(?:\s[A-Za-z]{2,}(?:[-'][A-Za-z]+)?)*$/;
    return fullNameRegex.test(name);
  };