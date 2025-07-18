import {Route, Routes} from "react-router-dom";
import {Home} from "../../pages/Home/Home.tsx";
import {About} from "../../pages/About/About.tsx";
import {Contact} from "../../pages/Contact/Contact.tsx";
import {ShoppingCart} from "../../pages/ShoppingCart/ShoppingCart.tsx";
import {Services} from "../../pages/Services/Services.tsx";
import {Register} from "../../pages/Register/Register.tsx";
import React from "react";
export function MainContent() {
    return (
        <div className="flex-justify-center items-center w-full h-full bg-gray-100 p-4">
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/services" element={<Services/>}/>
                <Route path="/register" element={<Register/>}/>

                <Route path="/shopping-cart" element={<ShoppingCart/>}/>
                {/*<Route path="/login" element={<Login />} />*/}
            </Routes>
        </div>
    );
}

export default MainContent;