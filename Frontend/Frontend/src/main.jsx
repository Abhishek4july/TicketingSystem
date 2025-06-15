import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/LoginPage.jsx';
import Signup from './pages/SignupPage.jsx';
import TicketForm from './Components/TicketForm.jsx';
import AdminTicketDashboard from './Components/AdminTicketDashboard.jsx';
import TicketCommentsPageAdmin from './pages/TicketCommentsPageAdmin.jsx';
import TicketFullViewPageAdmin from './pages/TicketFullViewPageAdmin.jsx';
import TicketFullViewUserPage from './pages/TicketFullViewUserPage.jsx';
import TicketCommentUserPage from './pages/TicketCommentUserPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import UserDashboardPage from './pages/UserDashboardPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import TicketsPerDayPage from './pages/TicketsPerDayPage.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import Home from './Components/Home.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path:'/',
        element:<Home/>
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: (
            <Signup />
        ),
      },
      {
        path: "/submitTicket",
        element:(
          <ProtectedRoute>
             <TicketForm />,
             </ProtectedRoute>
        )
      },
     {
      path:"/user/dashboard",
      element:(
          <ProtectedRoute>
             <UserDashboardPage />,
             </ProtectedRoute>
        )
     },
     {
      path:"/user/tickets/:ticketId",
      element:(
          <ProtectedRoute>
             <TicketFullViewUserPage />,
             </ProtectedRoute>
        )
     },
     {
      path:"/user/tickets/:ticketId/comments",
      element:(
          <ProtectedRoute>
             <TicketCommentUserPage />,
             </ProtectedRoute>
        )
     },



     {
      path:"/admin/tickets",
      element:(
        <PrivateRoute adminOnly>
         <AdminDashboardPage/>
         </PrivateRoute>
      )
     },
     {
      path:"/admin/tickets/:ticketId",
      element:(
       <PrivateRoute adminOnly>
      <TicketFullViewPageAdmin/>
        </PrivateRoute>
      )
     },
     {
      path:"/admin/tickets/:ticketId/comments",
      element:(
        <PrivateRoute adminOnly>
          <TicketCommentsPageAdmin/>
        </PrivateRoute>
      )
     },
     {
      path:"/admin/analytics",
      element:(
        <PrivateRoute adminOnly>
          <AnalyticsPage/>
        </PrivateRoute>
      )
     },
     {
      path:"/admin/ticketsPerDay",
      element:(
        <PrivateRoute adminOnly>
          <TicketsPerDayPage/>
        </PrivateRoute>
      )
     }
      
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
