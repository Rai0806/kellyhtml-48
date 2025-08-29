import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    // Redirect to the HTML version
    window.location.href = '/index.html';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <p>Redirecting to HTML version...</p>
    </div>
  );
};

export default App;