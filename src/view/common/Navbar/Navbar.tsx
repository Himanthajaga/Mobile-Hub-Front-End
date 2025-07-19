// import './Navbar.css';
import icon from '../../../assets/keels.jpg';
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

export function Navbar() {

    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        // Load from localStorage when component mounts
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        setUsername(storedUsername);
        setRole(storedRole);
    }, []);
    return (
        <div className="p-2 bg-[#444544] flex justify-between items-center">
            <div className="flex items-center p-2">
                <h1 className="text-3xl text-[#e6f0e6] hover:text-green-400">
                    Organic Shop
                </h1>
                <img className="h-[2.5rem] w-[2.5rem] ml-2" src={icon} alt="" />
            </div>
            <ul className="list-none flex gap-4 mt-2 mb-2">
                {/* Customer-only links */}
                {role === 'customer' && (
                    <>
                        <li className="text-[1.9rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="text-[1.9rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/about">About</Link>
                        </li>
                        <li className="text-[1.9rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li className="text-[1.9rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/shopping-cart">My-Cart</Link>
                        </li>
                    </>
                )}

                {/* Admin-only links */}
                {role === 'admin' && (
                    <>
                        <li className="text-[1.9rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/admin-panel">Admin Panel</Link>
                        </li>
                        <li className="text-[1.9rem] text-[#e6f0e6] hover:text-green-400">
                            <Link to="/manage-products">Manage Products</Link>
                        </li>
                    </>
                )}
            </ul>

            <div className="flex items-center space-x-4">
                {username ? (
                    <p className="text-2xl text-white">{username}</p>
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