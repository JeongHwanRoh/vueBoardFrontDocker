
import axiosApi from "./axiosApi";

/* 로그인 관련 AXIOS요청 정의 */
export const login = async (userId: string, password: string) => {
  const res = await axiosApi.post('/login', {
    userId,
    password,
  })
  return res.data;

};

/* 로그아웃 관련 AXIOS요청 정의 */
export const logout = async () => {
  try {
    const res = await axiosApi.post('/logout');

    console.log('로그아웃 성공');
    return res.data;

  } catch (err) {
    console.error('로그아웃 중 에러 발생:', err);
    throw err; // 필요하면 상위로 전달
  }
};

/* 
토큰으로 인증된 사용자 정보 조회 AXIOS요청 정의(새로고침 시 다시 사용자정보 불러올 떄 사용)
*/
export const getMe = async (headers?: Record<string, string>) => {
  const baseURL = import.meta.server
    ? 'http://backend:8092'      // 컨테이너 내부용
    : 'http://localhost:8092'    // 브라우저용(로컬호스트용)

  const res = await axiosApi.get(`${baseURL}/me`, {
    withCredentials: true, // 쿠키 포함해서 요청
    headers,
  })
  console.log('새로고침시 인증된 사용자 정보:', res.data);
  return res.data
}
