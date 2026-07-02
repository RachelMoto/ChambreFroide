import { GoogleLogin }
from "@react-oauth/google";
import axios from "axios";
import { useNavigate }
from "react-router-dom";

function GoogleButton() {

  const navigate = useNavigate();

  const handleSuccess = async (
    credentialResponse
  ) => {

    try {

      const res = await axios.post(
        "http://localhost:3001/api/auth/google",
        {
          token:
            credentialResponse.credential,
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