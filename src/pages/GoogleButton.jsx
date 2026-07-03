import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function GoogleButton() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post(
        "/auth/google",
        {
          token: credentialResponse.credential,
        }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Erreur connexion Google");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() =>
        alert("Connexion Google annulée")
      }
    />
  );
}

export default GoogleButton;