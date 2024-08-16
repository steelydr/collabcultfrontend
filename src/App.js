// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UsersList from './components/UsersList';
import UpdateUser from './components/UpdateUser';
import CreateUser from './components/CreateUser';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<UsersList />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/update/:id" element={<UpdateUser />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
