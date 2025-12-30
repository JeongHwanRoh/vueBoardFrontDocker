import axiosApi from "~/lib/axiosApi";


/* 게시글 목록조회 관련 AXIOS 요청 정의 */
export const loadBoards = async (currentPage: number, pageSize: number) => {
    const res = await axiosApi.get("/board/list", {
        params: { page: currentPage, size: pageSize }, // 요청보내는 값: currentPage, pageSize
    });
    return res.data;
};

/* 게시글 등록 관련 AXIOS 요청 정의  */
export const createBoard = async (board: object) => {
    const res = await axiosApi.post(
        "/board/create",
        board, // 실제 body
        { withCredentials: true }
    );
    return res.data;
};

/* 게시글 삭제 관련 AXIOS 요청 정의  */
export const deleteBoard = async (boardId: number) => {
    const res = await axiosApi.delete(`/board/delete/${boardId}`,{
        params: {boardId:boardId},
    });
    
}