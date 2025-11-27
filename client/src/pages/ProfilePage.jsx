import {useState} from "react";
import {Link} from "react-router-dom";
import ProfileForm from "../section/Profile/ProfileForm";
import UpdatePasswordForm from "../section/Profile/UpdatePasswordForm";

export default function ProfilePage() {
    const [openTab, setOpenTab] = useState(1);
    const activeclasses = "text-primary md:text-base";
    const inActiveClasses = "border-transparent";
    return (
        <div className="w-full rounded-sm border border-stroke bg-white py-7.5 px-20 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
                <Link
                    to="#"
                    className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
                        openTab === 1 ? activeclasses : inActiveClasses
                    }`}
                    onClick={() => {
                        setOpenTab(1);
                    }}
                >
                    Profile
                </Link>
                <Link
                    to="#"
                    className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
                        openTab === 2 ? activeclasses : inActiveClasses
                    }`}
                    onClick={() => {
                        setOpenTab(2);
                    }}
                >
                    Update Password
                </Link>
            </div>
            {/* content */}
            <div>
                <div className={`${openTab === 1 ? "block" : "hidden"}`}>
                    {/* Profile Form */}
                    <ProfileForm />
                </div>
                <div className={`${openTab === 2 ? "block" : "hidden"}`}>
                    {/* Update Password Form */}
                    <UpdatePasswordForm />
                </div>
            </div>
        </div>
    );
}
