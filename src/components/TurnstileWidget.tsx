import { useEffect } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";

function TurnstileWidget() {
  const turnstile = useTurnstile();

  useEffect(() => {
    // Limpia el token almacenado cuando el componente se monta
    localStorage.removeItem("turnstileToken");

    const interval = setInterval(() => {
      if (turnstile) {
        turnstile.reset();
      }
    }, 1000);
    return () => clearInterval(interval);
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
