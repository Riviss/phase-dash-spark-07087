import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import LeftRail from "./LeftRail";

const AppLayout = () => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftRail />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
