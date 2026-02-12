import axiosApi from '~/lib/apiService/axiosApi';


/* 게시글 목록조회 관련 AXIOS 요청 정의 */
export const loadBoards = async (currentPage: number, pageSize: number) => {
    const res = await axiosApi.get("/board/list", {
        params: { page: currentPage, size: pageSize }, // 요청보내는 값: currentPage, pageSize
    });
    return res.data;
};

/* 게시글 최신 5개 목록조회(board_id 기준) */
export const loadRecentFiveBoards=async()=>{

    const res=await axiosApi.get("/board/listRecentFive");
    return res.data;

}
    
/* 게시글 목록 상세조회 관련 AXIOS 요청 정의 */
export const loadBoardDetail = async (boardId: number) => {
    const res = await axiosApi.get(`/board/${boardId}`);
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

/* 게시글 수정 관련 AXIOS 요청 정의  */
export const updateBoard = async (boardId: number, board: object) => {
    const res = await axiosApi.put(
        `/board/update/${boardId}`,
        board, // 실제 body
        { withCredentials: true }
    );
    return res.data;
};

/* 게시글 삭제 관련 AXIOS 요청 정의  */
export const deleteBoards = async (boardId: number) => {
  return axiosApi.delete(`/board/delete/${boardId}`)
}
