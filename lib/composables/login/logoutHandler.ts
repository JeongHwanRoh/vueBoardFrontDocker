import { logout } from '~/lib/apiService/userApi'
export const logoutHandlers = async () => {

    const router = useRouter();
    const logoutHandler = async () => {
        await logout();
        router.push('/login');
    }
    return {
        logoutHandler
    };
};


