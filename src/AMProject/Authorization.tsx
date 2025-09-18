import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CgProfile } from "react-icons/cg";
import { TbLockPassword } from "react-icons/tb";
import { mockApi } from "./api";
import "./styles/global.css";

const Authorization: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const isValidEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isFormValid = isValidEmail(email) && password.length >= 6;

  const loginMutation = useMutation({
    mutationFn: () => mockApi.login(email, password),
    onSuccess: (data) => {
      console.log("Login result:", data);
      if (data.success) {
        navigate("/2fa");
      } else {
        alert("Invalid email or password");
      }
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  });

  return (
    <div className="wrapperLogin">
      <div className="wrapperCompany">
        <img src="/Symbol.png" alt="Company Logo" />
        <h3>Company</h3>
      </div>
      <h2>Sign in to your account to continue</h2>
      <div className="inputs">
        <div className="input-container">
          <CgProfile className="i" />
          <input
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="Email"
          />
        </div>
        <div className="input-container">
          <TbLockPassword className="i" />
          <input
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
          />
        </div>
        <button
          className={`Login ${isFormValid ? "active" : ""}`}
          disabled={!isFormValid || loginMutation.isPending}
          onClick={() => loginMutation.mutate()}
        >
          {loginMutation.isPending ? "Loading..." : "Log in"}
        </button>
      </div>
    </div>
  );
};

export default Authorization;