// import './Navbar.css';
import icon from '../../../assets/keels.jpg';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export function Navbar() {

    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        // Load from localStorage when component mounts
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        const storedImage = localStorage.getItem("image");

        setUsername(storedUsername);
        setRole(storedRole);
        setImage(storedImage);
    }, []);
    const handleLogout = () => {
        // Clear user session
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setUsername(null);
        setRole(null);

        // Redirect to login page
        navigate("/login");
    };
    return (
        <div className="p-2 bg-[#444544] flex justify-between items-center">
            <div className="flex items-center p-2">
                <h1 className="text-3xl text-[#e6f0e6] hover:text-green-400 font-bold">
                    Mobile Hub
                </h1>
                <img className="h-[2.5rem] w-[2.5rem] ml-2" src={icon} alt="" />
            </div>
            <ul className="list-none flex gap-20 mt-1 mb-2">
                {/* Customer-only links */}
                {role === 'customer' && (
                    <>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/about">About</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/shopping-cart">My-Cart</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}

                {/* Admin-only links */}
                {role === 'admin' && (
                    <>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-green-400 ">
                            <Link to="/admin-panel">Admin Panel</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/manage-products">Manage Products</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/manage-category">Manage Category</Link>
                        </li>
                    </>
                )}
            </ul>

            <div className="flex items-center space-x-4">
                {username ? (
                    <>
                        <p className="text-2xl text-white">{username}</p>
                        {image && (
                            <img
                                src={image}
                                alt="User Avatar"
                                className="h-[2.5rem] w-[2.5rem] rounded-full"
                            />
                        )}
                        <button
                            onClick={handleLogout}
                            className="text-[1.5rem] text-[#e6f0e6] bg-red-600 py-0.5 px-2
                            rounded-lg border-white border-2 hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="text-[1.5rem] text-[#e6f0e6] bg-[#1f9e4b] py-2 px-4
                        rounded-lg border-white border-2 hover:bg-green-400"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
}
export default Navbar;