import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (<div className="absolute">
    <input {...rest} type="text" value={showPassword ? value : "●".repeat(value.length)} />
    <div className="absolute right-0 top-0" onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
    </div>
  </div>);
};

export default PasswordInput;