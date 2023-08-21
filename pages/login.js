import { useState } from 'react';
import { signIn } from 'next-auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    signIn('credentials', {
      email,
      password,
      redirect: false, // Prevent automatic redirection
    })
      .then((response) => {
        if (response.error) {
          // Handle authentication error
          console.error(response.error);
        } else {
          // Authentication successful
          console.log(response);
        }
      })
      .catch((error) => {
        // Handle other errors
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
