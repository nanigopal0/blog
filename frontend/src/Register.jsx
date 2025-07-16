import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingIndicator from "./util/LoadingIndicator";

import { emailValidate, passwordValidate } from "./util/RegisterInputValidate";
import { Button } from "@mui/material";
import RegisterDialog from "./components/RegisterDialog";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      if (password === confirmPassword && validatePassword(password)) {
        setLoading(true);
        const data = {
          name: fullName,
          email: email,
          password: password,
          roles: "USER",
        };

        const result = await fetch(`/api/public/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!result.ok) {
          throw new Error("Invalid credentials");
        }
        const resultData = await result.text(); // Parse the text from the response
        // localStorage.setItem("token", "Bearer "+resultData);
        // onLogin();
        setLoading(false);
        navigate("/login");
      } else throw new Error("Invalid password");
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error("There has been a problem with fetch operation:", error);
    }
  };
  const fullNameValidate = () => {
    const fullNameRegex =
      /^[A-Za-z]{2,}(?:[-'][A-Za-z]+)?\s[A-Za-z]{2,}(?:[-'][A-Za-z]+)?(?:\s[A-Za-z]{2,}(?:[-'][A-Za-z]+)?)*$/;
    return fullNameRegex.test(fullName);
  };
  const isRegisterDisabled = () => {
    return (
      !fullNameValidate() ||
      !emailValidate(email) ||
      !passwordValidate(password) ||
      confirmPassword !== password
    );
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      className="h-screen  bg-cover bg-center w-full"
      style={{ backgroundImage: "url('src/assets/login.jpg')" }}
    >
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <RegisterDialog open={open} onClose={handleClose} />
      <div className="flex justify-center items-center h-full  lg:me-10">
        <div className="bg-purple-200 bg-opacity-70 border-2 border-white rounded-xl lg:w-2/5 lg:h-5/6 sm:w-4/6 p-5">
          {loading ? <LoadingIndicator /> : <></>}
          <h1 className="text-3xl text-center font-bold  mb-6">Register</h1>

          <p className="my-3 text-lg">Enter full name</p>
          <input
            type="text"
            value={fullName}
            onChange={(fn) => setFullName(fn.target.value)}
            className="p-2 w-full border-solid border-2 border-black 
                rounded-xl "
            placeholder="Full name"
          />

          <p className="my-3 text-lg">Enter email</p>
          <input
            type="email"
            value={email}
            onChange={(mail) => setEmail(mail.target.value)}
            className="p-2 w-full border-solid border-2 border-black 
                rounded-xl "
            placeholder="Email"
          />

          <p className="mt-5 mb-3 text-lg">Enter password</p>
          <input
            type="password"
            value={password}
            onChange={(pass) => setPassword(pass.target.value)}
            className="p-2 w-full border-solid border-2 
                border-black rounded-xl"
            placeholder="Password"
          />

          <p className="my-3 text-lg ">Confirm password</p>
          <input
            type="password"
            value={confirmPassword}
            onChange={(confirmPass) =>
              setConfirmPassword(confirmPass.target.value)
            }
            className="p-2 w-full border-solid border-2 border-black 
                rounded-xl "
            placeholder="Confirm password"
          />
          <p className="text-red-600">{error}</p>
          <div className="w-full my-5 ">
            <button
              disabled={isRegisterDisabled()}
              className="disabled:opacity-40 disabled:cursor-not-allowed bg-blue-700 w-full font-medium text-white rounded-md py-1"
              onClick={() => handleRegister()}
            >
              Register
            </button>
          </div>
          <div className="flex my-4 justify-center">
            <p className="mx-2">Already have an account?</p>
            <Link className="text-blue-700 font-medium" to={"/login"}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}
