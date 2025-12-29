<template>
  <div class="board-detail-container" v-if="board">
    <h2 align="center">게시글 상세보기</h2>

    <!-- editMode일 경우 제목-> input모드로, 내용->textarea 모드로 -->
    <div class="board-info">
      <p><strong>번호:</strong> {{ board.boardId }}</p>
      <p><strong>제목:</strong>
        <span v-if="!editMode">{{ board.title }}</span>
        <input v-else v-model="editBoard.title" class="edit-input" type="text" />
      </p>
      <p><strong>작성자:</strong> {{ board.writerId }}</p>
      <p><strong>등록일:</strong> {{ formatDate(board.regdate) }}</p>
    </div>

    <!-- 내용 -->
    <div class="board-content">
      <h3>내용</h3>
      <div v-if="!editMode">{{ board.content }}</div>
      <textarea v-else v-model="editBoard.content" class="edit-textarea"></textarea>
    </div>

    <div class="buttons">
      <button @click="goBack">목록으로</button>

      <!-- ✨ 본인 작성글만 수정/삭제 버튼 표시 -->
      <template v-if="user && board.writerId === user.memberId">
        <button v-if="!editMode" @click="enableEdit">수정</button>
        <button v-if="!editMode" class="delete" @click="deleteBoard">삭제</button>
      </template>

      <!-- editMode일 경우 버튼구성: 완료, 취소-->      
      <template v-if="editMode">
        <button class="save" @click="updateBoard">✔ 완료</button>
        <button @click="cancelEdit">취소</button>
      </template>
    </div>
  </div>

  <div v-else class="loading">
    <p>게시글을 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import '@/assets/css/boardDetail.css'
import {sessionUser} from "@/lib/userApi.ts"; // userApi.ts의 sessionUser 함수 불러오기

// 라우터
const route = useRoute()
const router = useRouter()

// 상태
const board = ref(null)
const editBoard = ref({})
const editMode = ref(false)
const boardId = computed(() => route.query.id)
const user = ref(null) // 로그인 사용자 정보

// 게시글 상세 조회
const getBoardDetail = async () => {
  try {
    const res = await axios.get(`/api/board/${boardId.value}`)
    board.value = res.data
    console.log('게시글 상세:', res.data)
  } catch (err) {
    console.error('게시글 불러오기 실패:', err)
    alert('게시글 정보를 불러올 수 없습니다.')
  }
}

// 로그인 사용자 정보 조회
const loadSessionUser = async () => {
  try {
    const res = await sessionUser();
    if (res.isLogin) {
      user.value = res.user;
      console.log("세션 불러오기 성공", user.value)
    } else {
      navigateTo("/");
    }
  } catch (err) {
    console.error("세션 조회 실패:", err);
  }
};


// 수정 모드 활성화
const enableEdit = () => {
  if (!user.value) {
    alert("로그인이 필요합니다.")
    return
  }
  if (board.value.writerId !== user.value.memberId) {
    alert("본인 작성글만 수정할 수 있습니다.")
    return
  }

  editMode.value = true // 수정 버튼 클릭 시 editMode 활성화
  editBoard.value = { ...board.value } // 수정 사항의 기본값은 board.value에서 가져옴
}

// 수정 취소
const cancelEdit = () => {
  editMode.value = false // editMode 비활성화
  editBoard.value = {} // 수정 사항 지워짐
}

// 수정 완료 (UPDATE)
const updateBoard = async () => {
  try {
    await axios.put(`/api/board/update/${boardId.value}`, editBoard.value, {
      withCredentials: true,
    })
    alert("게시글이 수정되었습니다.")
    editMode.value = false // editMode 비활성화
    getBoardDetail() // 수정된 게시물 상세보기 조회
  } catch (err) {
    console.error("게시글 수정 실패:", err)
    alert("수정 중 오류가 발생했습니다.")
  }
}

// 삭제 (DELETE)
const deleteBoard = async () => {
  if (!user.value || board.value.writerId !== user.value.memberId) {
    alert("본인 작성글만 삭제할 수 있습니다.")
    return
  }
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await axios.delete(`/api/board/delete/${boardId.value}`)
      alert('삭제되었습니다.')
      router.push('/board')
    } catch (err) {
      console.error('삭제 실패:', err)
    }
  }
}

// 목록으로 돌아가기
const goBack = () => router.push('/board/main')

// 날짜 포맷 => 날짜 객체를 문자열로 변환(EX.25/10/23 14:14:57.000000000 -> 2025.10.23 오후 2:14:57)
const formatDate = (date) => new Date(date).toLocaleString()

// 초기 로드: 세션 불러온 후 상세 게시글 조회
onMounted(() => {
  loadSessionUser()
  if (boardId.value) getBoardDetail(boardId.value)
  else alert('잘못된 접근입니다.')
})

watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      getBoardDetail(newId)
    } else {
      alert("잘못된 접근입니다.")
    }
  },
  { immediate: true } // 첫 마운트 시에도 바로 실행
)

// 본 페이지에 대한 서버 측 렌더링을 끈다.
// 쿼리와 세션 기반 비동기 데이터 로딩이 ssr 시점에 처리되게 하기 위해 브라우저에서만 렌더링되도록 설정
definePageMeta({ ssr: false }) 
</script>

<style scoped>

</style>
