import { logout } from '~/lib/apiService/userApi'
export const logoutHandlers = async () => {
    const logoutHandler = async () => {
        await logout();
    }
    return {
        logoutHandler
    };
};


