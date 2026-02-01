import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lyrics-history" element={<Home initialPage="lyrics-history" />} />
          <Route path="/note-history" element={<Home initialPage="note-history" />} />
          <Route path="/favorites" element={<Home initialPage="favorites" />} />
          <Route path="/settings" element={<Home initialPage="settings" />} />
          <Route path="/support" element={<Home initialPage="support" />} />
          <Route path="/pricing" element={<Home initialPage="pricing" />} />
          <Route path="/my-account" element={<Home initialPage="my-account" />} />
          <Route path="/checkout" element={<Home initialPage="checkout" />} />
          <Route path="/reviews" element={<Home initialPage="reviews" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
