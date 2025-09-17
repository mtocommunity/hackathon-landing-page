import Turnstile, { useTurnstile } from "react-turnstile";

function TurnstileWidget() {
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
