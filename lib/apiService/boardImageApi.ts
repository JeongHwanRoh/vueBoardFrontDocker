import axiosApi from '~/lib/apiService/axiosApi';

/* 이미지 업로드(임시 저장용) => TB_TEMP_IMAGE */
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosApi.post("/board/image/upload", formData, {
        // headers: {
        //     "Content-Type": "multipart/form-data"
        // },
        withCredentials: true
    });

    return res.data as { imageUrl: string }

}
/* 업로드된 이미지 게시글 저장할 때 같이 저장 => TB_BOARD_IMAGE */
export const saveUploadedImage = async (targetId: number, content: string) => {
    const boardId = targetId;
    console.log('boardId 값:', boardId);
    const res = await axiosApi.post(`/board/image/save/${boardId}`,
        { content },
        {headers:{ "Content-Type": "application/json" }, withCredentials: true}
    );
    return res.data;
}