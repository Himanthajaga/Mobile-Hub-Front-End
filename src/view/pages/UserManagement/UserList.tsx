import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../slices/userSlice";
import type { RootState } from "../../../store/store.ts";

export function UserList() {
    const dispatch = useDispatch();
    const { users, status } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            {status === "loading" ? (
                <p>Loading...</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="px-4 py-2">{user.id}</td>
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.role}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
        </div>
    );
}