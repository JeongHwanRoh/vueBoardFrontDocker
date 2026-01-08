
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


/* 세션 조회 관련 AXIOS요청 정의 */
// withCredential: true =>AXIOS 요청에서 쿠키나 인증정보 함께 보낼지 여부 지정
export const sessionUser= async()=>{
    const res=await axiosApi.get('/session',{withCredentials:true}); 
    return res.data;
}