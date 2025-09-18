import React, { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { mockApi } from "./api";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "./styles/TwoFactor.css";

const TwoFactorAuth: React.FC = () => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false);
  const [isCodeInvalid, setIsCodeInvalid] = useState<boolean>(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    if (!canResend) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, canResend]);

  useEffect(() => {
    if (code.every((c) => c !== "")) {
      setIsCodeValid(true);
    } else {
      setIsCodeValid(false);
      setIsCodeInvalid(false);
    }
  }, [code]);

  const verifyMutation = useMutation({
    mutationFn: () => mockApi.verifyCode(code.join("")),
    onSuccess: (data) => {
      if (data.success) {
        alert("✅ Two-Factor success!");
        setIsCodeInvalid(false);
      } else {
        setIsCodeInvalid(true);
      }
    },
  });

  const requestNewCode = () => {
    console.log("Requesting new code...");
    setTimeLeft(30);
    setCanResend(false);
    setCode(new Array(6).fill(""));
    setIsCodeValid(false);
    setIsCodeInvalid(false);
  };

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="wrapper2FA">
      <button onClick={() => navigate(-1)} className="back-button">
        <IoArrowBack className="arrow" />
      </button>

      <div className="wrapperCompany">
        <img src="/Symbol.png" alt="logo" />
        <h3>Company</h3>
      </div>

      <h2>Two-Factor Authentication</h2>
      <p className="subtitle">
        Enter the 6-digit code from the Google Authenticator app
      </p>

      <div className="codeInputs">
        {code.map((digit, index) => (
            <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => {
                inputsRef.current[index] = el;
            }}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`code-input${isCodeInvalid ? " input-invalid" : ""}`}
            />
        ))}
      </div>

      {isCodeInvalid && (
        <p className="error-text">Invalid code</p>
      )}

      <div className="resend-section">
        {canResend ? (
          <button className="resend-button" onClick={requestNewCode}>
            Get New
          </button>
        ) : (
          <p className="timer">Get a new code in {timeLeft}s</p>
        )}
      </div>

      {isCodeValid && !isCodeInvalid && (
        <button
          className="verify-button"
          onClick={() => verifyMutation.mutate()}
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? "Verifying..." : "Continue"}
        </button>
      )}
    </div>
  );
};

export default TwoFactorAuth;

