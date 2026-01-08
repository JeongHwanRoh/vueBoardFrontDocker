import { createBoard, updateBoard } from '~/lib/apiService/boardApi';
import type { BoardCreateRequest } from '~/lib/types/board';
import { useUserStore } from '~/stores/userStore';

export const submitBoards = async () => {
    const route = useRoute();
    // const UserStore = useUserStore(); // pinia에 저장된 user객체를 가져옴(향후 구현 예정)

    // 게시글 입력 폼 데이터 생성
    const board = ref({
        title: '',
        content: '',
        // pinia 구현 후 구현 예정
        writer: useUserStore().name, //writer: pinia의 user 객체의 name을 직접 가져오기(향후 진행)
        pn: useUserStore().pn, //pn: pinia의 user 객체의 pn을 직접 가져오기(향후 진행)
        regdate: new Date(), //현재 날짜(시분초까지),
        
    })

    /* 
        writer: UserStore.name, //writer: pinia의 user 객체의 name을 직접 가져오기
        pn: Number(UserStore.pn), //pn: pinia의 user 객체의 pn을 직접 가져오기
    
    */

    const boardId = ref(
        route.query.id ? Number(route.query.id) : null
    );
    const newBoardId = ref<number | null>(null);
    const isUpdate = computed(() => boardId.value ? true : false) // 수정 여부 판단
    const isSubmit = ref<boolean>(false); // 제출 여부

    // 등록 완료(신규생성 또는 수정)
    const submitBoard = async (updatedBoard: BoardCreateRequest) => {
        board.value = updatedBoard;
        console.log("submitBoard - board value : ", board.value);
        // 제목, 내용 값 추출
        const title = board.value?.title?.trim();
        const content = board.value?.content?.trim();

        // 제목, 내용 값 없는 경우 등록 제한
        if (!title || !content) {
            alert("제목과 내용 모두 입력해주세요");
            return;
        }

        let targetId: number | null = null;

        // 게시글 수정일 경우
        if (isUpdate.value) {
            try {
                targetId = boardId.value!; // ! : Non-null assertion (업데이트 모드에서만 호출)
                await updateBoard(targetId, board.value);
                alert("게시글 수정이 완료되었습니다.")
            } catch (error: any) {
                // 권한 에러(403 Forbidden)
                if (error.response.status === 403) {
                    console.log("error response : ", error.response)
                    alert(error.response.data.title) // 본인이 작성한 공지만 수정할 수 있습니다.
                } else {
                }
                console.error("공지 수정 실패: ", error)
            }
        }
        else {
            // 신규 게시글 작성인 경우
            const res = await createBoard(board.value);
            targetId = res.boardId; // auto increment된 id
            newBoardId.value = targetId; // 필요할 경우 저장
            alert('게시글 등록이 완료되었습니다.')
        }

        // 제출 시
        isSubmit.value = true;

    }
    return { board, boardId, isUpdate, isSubmit, submitBoard};

}