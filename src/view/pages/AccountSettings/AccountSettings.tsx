import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {AppDispatch} from "../../../store/store.ts";
import {useDispatch} from "react-redux";
import {updateUser} from "../../../slices/userSlice.ts";

export function AccountSettings() {
    const [formData, setFormData] = useState({
        userId: "",
        username: "",
        email: "",
        image: "",
        oldPassword: "",
        newPassword: "",
        role: "",
        status: "active", // Default status
    });
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Load user data from localStorage
        const storedUsername = localStorage.getItem("username");
        const storedEmail = localStorage.getItem("email");
        const storedImage = localStorage.getItem("image");
        const storedUserId = localStorage.getItem("userId");
        const storedRole = localStorage.getItem("role");
        // Initialize formData with stored values or empty strings
        const storedStatus = localStorage.getItem("status") || "active"; // Default to 'active' if not set

        setFormData({
            userId: storedUserId || "",
            username: storedUsername || "",
            email: storedEmail || "",
            image: storedImage || "",
            oldPassword: "",
            newPassword: "",
            role: storedRole || "",
            status: storedStatus,
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const timestamp = Math.round(new Date().getTime() / 1000);

            try {
                // Fetch signature from the backend
                const response = await fetch("http://localhost:3000/api/cloudinary/signature", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ timestamp }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch Cloudinary signature");
                }

                const { signature } = await response.json();

                const uploadData = new FormData();
                uploadData.append("file", files[0]);
                uploadData.append("upload_preset", "my_preset");
                uploadData.append("api_key", "117186248654227");
                uploadData.append("timestamp", timestamp.toString());
                uploadData.append("signature", signature);

                // Upload the image to Cloudinary
                const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dfwzzxgja/image/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image to Cloudinary");
                }

                const data = await uploadResponse.json();

                // Set the new image URL in formData
                if (data.secure_url) {
                    setFormData((prevState) => ({ ...prevState, image: data.secure_url }));
                    console.log("New Image URL set in formData:", data.secure_url);
                } else {
                    throw new Error("secure_url not found in Cloudinary response");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate old password before sending the request
        if (!formData.oldPassword) {
            alert("Please enter your old password.");
            return;
        }
        try {
            const response = await dispatch(updateUser(formData));
            console.log("Update response:", response);


            // Update localStorage with new data
            localStorage.setItem("username", formData.username);
            localStorage.setItem("email", formData.email);
            localStorage.setItem("image", formData.image);
            localStorage.setItem("userId", response.payload?.userId || ""); // Use response.payload if available
            localStorage.setItem("role", response.payload?.role || "");
            localStorage.setItem("status", formData.status || "active");
            alert("Account updated successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Error updating account:", error);
            alert("Failed to update account.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 underline decoration-2 mb-6 text-center">
                    Account Settings
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-200 rounded-md text-sm shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-200 rounded-md text-sm shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Profile Picture URL
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleFileChange}
                            className="mt-1 block w-full border border-gray-200 rounded-md text-sm shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt="Profile"
                                className="w-20 h-20 object-cover mt-2 rounded-full"
                            />
                        )}
                    </div>
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                            Old Password
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-200 rounded-md text-sm shadow-sm focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-200 rounded-md text-sm shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Update Account
                    </button>
                </form>
            </div>
        </div>
    );
}