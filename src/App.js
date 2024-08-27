import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import UpdateUser from './components/UpdateUser';
import { GoogleOAuthProvider } from '@react-oauth/google';
import UsersList from './components/UsersList';
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/create" element={<UsersList />} />
            <Route path="/update/:id" element={<UpdateUser />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
