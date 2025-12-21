import { getDocument } from "./firebaseService";

export const getUserById = async (userId: string) => {
    return getDocument<{ email: string; username: string }>("users", userId);
}