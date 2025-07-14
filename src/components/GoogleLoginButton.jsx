import { useEffect } from "react";
import { useGoogleAuthMutation } from "../redux/api/apiSlice"; // создадим ниже
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; // пропиши в .env

export default function GoogleLoginButton() {
  const [googleAuth] = useGoogleAuthMutation();

  useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    // response.credential — это id_token
    try {
      const result = await googleAuth({ idToken: response.credential }).unwrap();
      // result — твой JWT и данные пользователя
      localStorage.setItem("token", result.token); // или как у тебя называется поле
      window.location.href = "/"; // редирект после входа
    } catch (error) {
      alert("Ошибка входа через Google");
      // обработай ошибку по желанию
    }
  };

  return (
    <div>
      <div id="google-signin-btn"></div>
    </div>
  );
}
