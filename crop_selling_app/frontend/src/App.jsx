import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Marketplace from './pages/Marketplace';
import CreateListing from './pages/CreateListing';
import Calculator from './pages/Calculator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Marketplace />} />
          <Route path="create-listing" element={<CreateListing />} />
          <Route path="calculator" element={<Calculator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
