import axios, { type AxiosInstance, AxiosError } from "axios";

//  axios api 요청 시 baseURL 잡기
const axiosApi: AxiosInstance = axios.create({
    baseURL: process.env.NUXT_PUBLIC_API_BASE, 
    withCredentials: true,
});

// 요청 인터셉터
// 요청 전 공통 헤더, 토큰 추가 등등
axiosApi.interceptors.request.use((config) => {
    return config;
},
    (error: AxiosError) => {
        console.error("요청 오류", error.message);
        return Promise.reject(error);

    }
);
// Api 초기화 /plugins/api.ts에서 호출
export function initApi(base: string) {
    //// console.log("API 초기화 - Base URL:", base);
  axiosApi.defaults.baseURL = base;
}

// 응답 인터셉터
// 에러 메시지 공통 처리 등
// 401, 500 등의 상태를 예외처리
axiosApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                console.warn("인증 실패: 로그인 필요")
            } else if (status == 500) {
                console.error("서버 내부 오류 발생")
            }
        } else {
            console.error("네트워크 오류: ", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosApi;