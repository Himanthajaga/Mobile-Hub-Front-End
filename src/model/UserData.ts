export interface UserData{
    userId: string | null; // User ID as a string or null if not authenticated
    username: string | null;
    role: string | null;
}