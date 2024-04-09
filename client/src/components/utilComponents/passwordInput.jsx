import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function PasswordInput({ value, ...rest }) {
  const [showPassword, setShowPassword] = useState(false);

  return (<div className="relative">
    <input {...rest} type={showPassword ? "text" : "password"} value={value}
           onPasteCapture={(e) => e.preventDefault()} />
    <div className="text-stone-400 absolute right-2 top-1/2 -translate-y-1/2"
         onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
    </div>
  </div>);
};

export default PasswordInput;