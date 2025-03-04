import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingIndicator from "./util/LoadingIndicator";
import { API_BASE_URL } from "./util/BaseUrl";
import { emailValidate, passwordValidate } from "./util/RegisterInputValidate";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState("");
    
    const setPass = (pass) => {
        setPassword(pass.target.value);
        if(error.length > 0) setError("");
    };

    const setMail = (mail) => {
        setEmail(mail.target.value);
        if(error.length > 0) setError("");
    };

    const handleLogin = async () => {
        try {
            if (validatePassword) {
                setLoading(true);
                const data = {
                    email: email,
                    password: password,
                };

                const result = await fetch(
                    `${API_BASE_URL}/public/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    }
                );
                if (!result.ok) {
                    throw new Error("Invalid credentials");
                }
                console.log("after error");

                const resultData = await result.text(); // Parse the text from the response
                localStorage.setItem("token", resultData);
                setLoading(false);
                onLogin();
                navigate("/home");
            } else throw new Error("Invalid password");
        } catch (error) {
            setLoading(false)
            setError(error.message);
            console.error("There has been a problem with fetch operation:", error);
        }
    };

    const isLoginDisabled = () => {
        return !emailValidate(email) || !passwordValidate(password);
    }

    return (
        // using grid to center a div
        <div className="h-screen  bg-cover bg-center w-full" style={{ backgroundImage: "url('/public/login.jpg')" }}>

            <div className="flex justify-center items-center h-full  lg:me-10">
                {/* using flex to center a div  *
                <div className="flex justify-center items-center h-screen"> */}
                <div className="bg-purple-200 bg-opacity-70 border-2 border-white rounded-xl lg:w-3/6 lg:h-4/6 sm:w-4/6 p-5">
                    <h1 className="text-3xl text-center font-bold mb-6">
                        Login
                    </h1>

                    <p className="my-3 text-lg">Enter email</p>
                    <input
                        type="email"
                        onChange={(em) => setMail(em)}
                        value={email}
                        className="p-2 w-full border-solid border-2 border-black text-md
                        rounded-xl "
                        placeholder="Email"
                    />

                    <p className="mt-5 mb-3 text-lg">Enter password</p>
                    <input
                        type="password"
                        onChange={(pass) => setPass(pass)}
                        value={password}
                        className="p-2 w-full border-solid border-2 text-md
                    border-black rounded-xl"
                        placeholder="Password"
                    />
                    <p className="text-red-600">{error}</p>
                    {loading ? <LoadingIndicator /> : <></>}
                    <div className="w-full my-5 ">
                        <button disabled={isLoginDisabled()}
                            onClick={() => handleLogin()}
                            className="disabled:opacity-40 disabled:cursor-not-allowed bg-blue-700 w-full text-lg font-medium text-white rounded-md py-1"
                        >
                            Login
                        </button>
                    </div>

                    <div className="flex my-4 justify-center">
                        <p className="mx-2 text-md font-semibold ">Don't have an account?</p>
                        <Link
                            className="text-blue-700 text-md font-semibold"
                            to={"/register"}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

function validatePassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}
