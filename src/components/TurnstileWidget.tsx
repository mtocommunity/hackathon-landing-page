import { useEffect, useRef } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";

function TurnstileWidget() {
  const turnstile = useTurnstile();
  const turnstileRef = useRef(turnstile);

  useEffect(() => {
    turnstileRef.current = turnstile;
  }, [turnstile]);

  useEffect(() => {
    const handler = (event: Event) => {
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    };

    window.addEventListener("turnstileReset", handler);
    return () => window.removeEventListener("turnstileReset", handler);
  }, []);

  return (
    <Turnstile
      sitekey="0x4AAAAAAB1JuZsovKT5Wzyy"
      appearance="always"
      language="es"
      theme="light"
      refreshExpired="auto"
      onExpire={() => {
        localStorage.removeItem("turnstileToken");
      }}
      onVerify={(token) => {
        localStorage.setItem("turnstileToken", token);
      }}
    />
  );
}

export default TurnstileWidget;
