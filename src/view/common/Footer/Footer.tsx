import { Link } from "react-router-dom";
import logo from '../../../assets/keels.jpg';
import logo_1 from '../../../assets/logo_1.png';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl mx-auto p-4">
                <div className="flex flex-wrap items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img className="w-16 h-16 cursor-pointer rounded-full" src={logo_1} alt="logo" />
                        <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">Mobile Hub</span>
                    </Link>
                    <ul className="flex flex-wrap gap-6 mt-4 md:mt-0">
                        <li><Link className="text-lg font-semibold text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500" to="/">Home</Link></li>
                        <li><Link className="text-lg font-semibold text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500" to="/about">About</Link></li>
                        <li><Link className="text-lg font-semibold text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500" to="/contact">Contact</Link></li>
                        <li><Link className="text-lg font-semibold text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500" to="/services">Services</Link></li>
                    </ul>
                </div>
                <div className="text-center text-gray-500 mt-6 dark:text-gray-400">
                    <p className="text-sm">© 2025 Mobile Hub. All rights reserved.</p>
                    <p className="text-sm">Privacy Policy | Terms of Service</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;