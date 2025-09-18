import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Authorization from './Authorization';
import TwoFactorAuth from './TwoFactorAuthefication';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Authorization />} />
        <Route path="/2fa" element={<TwoFactorAuth />} />
      </Routes>
    </div>
  );
};

export default App;

