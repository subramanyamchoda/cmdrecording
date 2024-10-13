import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'regenerator-runtime/runtime';

import CameraRecorder from './CameraRecorder';

const App = () => {
  return (
    <Router>
      <Routes>
 
        <Route path='/' element={<CameraRecorder />} />
        
      </Routes>
    </Router>
  );
}

export default App;
