import { useEffect } from "react";

const VerifyComplete = () => {
  useEffect(() => {
    // Redirige vers ton lien deep link mobile
    window.location.href = "zeno://identity-verification-complete";
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Redirection en cours...</h2>
      <p>
        Si vous n’êtes pas redirigé automatiquement,{" "}
        <a href="zeno://identity-verification-complete">cliquez ici</a>.
      </p>
    </div>
  );
};

export default VerifyComplete;
