import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleAuthMutation } from '../redux/api/apiSlice';

export default function GoogleLoginButton() {
  const [googleAuth] = useGoogleAuthMutation();

  // Обработчик, когда Google вернул id_token
  const handleCallbackResponse = async (response) => {
    // Получили id_token!
    const idToken = response.credential;
    try {
      const result = await googleAuth({ idToken }).unwrap();
      // Получили JWT твоего приложения
      if (result.token) {
        localStorage.setItem('token', result.token);
        // Если backend возвращает user info, сохрани если надо
        // localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = '/'; // редиректим на главную или куда нужно
      }
    } catch (e) {
      alert('Ошибка входа через Google!');
    }
  };

  // После монтирования, инициализируем Google кнопку
  React.useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // через .env
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
