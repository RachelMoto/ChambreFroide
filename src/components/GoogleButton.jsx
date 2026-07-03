import { GoogleLogin }
from "@react-oauth/google";
import api from "../services/api";
import { useNavigate }
from "react-router-dom";

function GoogleButton() {

  const navigate = useNavigate();

  const handleSuccess = async (
    credentialResponse
  ) => {

    try {

      const res = await api.post(
  "/auth/google",
  {
    token: credentialResponse.credential,
  }
);

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      navigate("/dashboard");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() =>
        console.log("Erreur Google")
      }
    />
  );
}

export default GoogleButton;