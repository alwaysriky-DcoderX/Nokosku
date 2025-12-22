// app/router.tsx - React Router setup
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { Splash } from '../pages/Splash';
import { Welcome } from '../pages/Welcome';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Home } from '../pages/Home';
import { Deposit } from '../pages/Deposit';
import { DepositDetail } from '../pages/DepositDetail';
import { Buy } from '../pages/Buy';
import { Orders } from '../pages/Orders';
import { OrderDetail } from '../pages/OrderDetail';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { path: '/', element: <Splash /> },
      { path: '/welcome', element: <Welcome /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/home', element: <Home /> },
      { path: '/deposit', element: <Deposit /> },
      { path: '/deposit/:id', element: <DepositDetail /> },
      { path: '/buy', element: <Buy /> },
      { path: '/orders', element: <Orders /> },
      { path: '/orders/:id', element: <OrderDetail /> },
      { path: '/profile', element: <Profile /> },
      { path: '/settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);