import React from 'react';
import { useGoogleAuthMutation } from '../redux/api/apiSlice';

export default function GoogleLoginButton() {
  const [googleAuth] = useGoogleAuthMutation();

  const handleCallbackResponse = async (response) => {
    const idToken = response.credential;
    try {
      const result = await googleAuth({ idToken }).unwrap();
      if (result.token) {
        localStorage.setItem('token', result.token);
        window.location.href = '/';
      } else {
        alert('Ошибка: не получен токен приложения!');
      }
    } catch (e) {
      alert('Ошибка входа через Google!');
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, []);

  return <div id="googleSignInDiv"></div>;
}
