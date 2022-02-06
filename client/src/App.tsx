import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Start, Room } from 'components/pages';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path=":roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}
