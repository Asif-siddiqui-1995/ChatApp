import {Outlet} from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
    return (
        <div className="h-[calc(100vh)] overflow-hidden sm:h-screen">
            <div className="h-full rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">
                {/* Sidebar */}
                <Sidebar />
                <Outlet />
            </div>
        </div>
    );
}
