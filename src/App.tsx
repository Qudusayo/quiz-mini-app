import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import Layout from "./layout";
import DailyChallenge from "./pages/daily-challenge";
import { Navigate, Route, Routes } from "react-router";
import QuickPlay from "./pages/quick-play";
import Profile from "./pages/profile";
import Home from "./pages/home";
import Leaderboard from "./pages/leaderboard";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge" element={<DailyChallenge />} />
        <Route path="/quick-play" element={<QuickPlay />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
