import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store.ts";
import {addUser, fetchUsers, updateUser} from "../../../slices/userSlice.ts";

interface RegisterData{
    id: string | null; // User ID as a string or null if not authenticated
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    image?: string | File // Optional image field
}
export const Register = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterData>({
        id: null,
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Validate passwords
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            // Validate required fields
            if (!formData.username || !formData.email || !formData.password) {
                alert("Please fill in all required fields");
                return;
            }

            // Ensure image URL is set
            if (!formData.image || typeof formData.image !== "string") {
                alert("Please upload a profile image");
                return;
            }

            // Prepare user payload
            const userPayload = {
                id: formData.id,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                image: formData.image,
                status: "active", // Default status
            };

            // Dispatch appropriate action
            if (formData.id) {
                await dispatch(updateUser(userPayload));
            } else {
                await dispatch(addUser(userPayload));
            }

            // Redirect to login only after successful registration
            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {formData.id ? "Update User" : "Register"}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your username"
                            required
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
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="border p-2 w-full"
                        />
                        {typeof formData.image === "string" && formData.image && (
                            <img
                                src={formData.image}
                                alt="Category"
                                className="w-40 h-40 object-cover mt-2"
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {formData.id ? "Update User" : "Register"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-medium text-lg rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Already have an account? Login
                    </button>
                </form>
            </div>
        </div>
    );
};
