
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
20260414: SSR 기준 baseURL 설정되어있는걸 CSR 기준 baseURL 불러오는 로직으로 변경

ASIS) import.meta.server로 baseURL 지정하여 새로고침시 도커에서는  ssr 방식인 backend:8092로 매핑되고 
브라우저에서는 localhost:8092가 되도록 설정

TOBE) CSR 방식으로 전환 -> runtimeconfig에 설정된 환경변수값인 baseURL을 가져옴.
(.env -> config.ts에 runtimeConfig 설정 ->  config.public.apiBase로 불러오기 )
추가로 config.ts에서 ssr:false 설정 => 오직 CSR로 전체 페이지 돌리도록 수정함.

*/
export const getMe = async (headers?: Record<string, string>) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  console.log("config에서 가져온 baseURL", baseURL)
  try {
    const res = await axiosApi.get(`${baseURL}/me`, {
      withCredentials: true, // 쿠키 포함해서 요청
      headers,
    })
    console.log('새로고침시 인증된 사용자 정보:', res.data)
    return res.data
  } catch (error) {
    console.error("사용자 정보 재조회 실패: ", error)
    return null
  }
}
