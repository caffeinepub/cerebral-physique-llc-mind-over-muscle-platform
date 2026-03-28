import { Outlet } from "@tanstack/react-router";
import Footer from "./Footer";
import Header from "./Header";
import MusicPlayer from "./MusicPlayer";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* pt-24 accounts for brand name + nav rows in header */}
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer />
      <MusicPlayer />
    </div>
  );
}
