import axiosApi from "./axiosApi";

/* 회원가입 관련 API 요청 */
export const joinApi = {
  join: async (payload: { memberId: string; password: string; name: string; email: string }) => {
    return await axiosApi.post("/join/memberJoin", payload);
  }
};