import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { Start } from 'components/pages';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path=":roomId" element={<HelloRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

const HelloRoom = () => {
  let { roomId } = useParams();

  return (
    <div>hello room {roomId}</div>
  );
};
