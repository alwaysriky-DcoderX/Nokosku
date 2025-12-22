// app/App.tsx - Main App component
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastContainer } from '../ui/components/Toast';
import '../styles/theme.css';
import '../styles/app.css';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;