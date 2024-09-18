import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CreateUser from './components/CreateUser';
import LandingPage from './components/LandingPage';

const CollabCultPage = lazy(() => import('./components/CollabCultPage'));

const App = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <div>
          <Routes>
            <Route exact path="/cc" element={<LandingPage />} />
            <Route path="/register" element={<CreateUser />} />
            <Route
              path="/"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CollabCultPage />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
