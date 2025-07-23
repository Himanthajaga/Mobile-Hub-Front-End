import './MainContent.css';
import {Route, Routes} from "react-router-dom";
import {Home} from "../../pages/Home/Home.tsx";
import {About} from "../../pages/About/About.tsx";
import {Contact} from "../../pages/Contact/Contact.tsx";
import {ShoppingCart} from "../../pages/ShoppingCart/ShoppingCart.tsx";
import {ProtectedRoute} from "../../../auth/ProtectedRoute.tsx";
import {AdminPanel} from "../../pages/AdminPanel/AdminPanel.tsx";
import {AddProduct} from "../../pages/AddProducts/AddProducts.tsx";
import {useEffect, useState} from "react";
import {ManageCategory} from "../../pages/ManageCategory/ManageCategory.tsx";
import {ManageProducts} from "../../pages/ManageProducts/ManageProducts.tsx";
import {AddCategory} from "../../pages/AddCategory/AddCategory.tsx";

export function MainContent() {
    const [role, setRole] = useState<string | null>(null);
    useEffect(() => {
        // Load from localStorage when component mounts
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-[#f0f0f0]">
            <Routes>
                {/* Routes visible to non-admins only */}
                {role === 'customer' && (
                    <>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/shopping-cart" element={<ShoppingCart/>}/>
                        <Route path="/payment/addPayment" element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <ShoppingCart/>
                            </ProtectedRoute>
                        }/>
                    </>
                )}
                <>
                    <Route path="/admin-panel" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminPanel/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/add-product" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AddProduct/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/add-category" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AddCategory/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/manage-category" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ManageCategory/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/manage-products" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ManageProducts/>
                        </ProtectedRoute>
                    }/>
                </>
            </Routes>
        </div>
    );
}
export default MainContent;