import { useState } from "react";
import LoginDialog from "./components/LoginDialog";
import RegisterDialog from "./components/RegisterDialog";

function Register({ onClose }: { onClose: () => void }) {
  const [openLogin, setOpenLogin] = useState(true);
  const [openRegister, setOpenRegister] = useState(false);

  const handleChangeLogin = () => {
    setOpenRegister(false);
    setOpenLogin(true);
  };

  const handleChangeRegister = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  };

  return (
    <div>
      <LoginDialog
        isOpen={openLogin}
        onClose={onClose}
        onChangeRegister={handleChangeRegister}
      />
      <RegisterDialog
        isOpen={openRegister}
        onClose={onClose}
        onChangeLogin={handleChangeLogin}
      />
    </div>
  );
}

export default Register;
