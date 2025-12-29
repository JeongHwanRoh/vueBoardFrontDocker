<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>✏️ 새 게시글 작성</h3>

      <input v-model="newBoard.title" placeholder="제목" />
      <textarea v-model="newBoard.content" placeholder="내용"></textarea>
      <input v-model="newBoard.writerId" placeholder="작성자" readonly />
      <input v-model="newBoard.category" placeholder="카테고리" />

      <div class="modal-buttons">
        <button class="submit-btn" @click="submitBoard">등록</button>
        <button class="cancel-btn" @click="$emit('close')">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits} from "vue";

// props: 상위에서 user 정보 가져오기
const props = defineProps({
  user: { type: Object, default: null },
});

// emit: create, close 이벤트 부모로 전달
const emit = defineEmits(["create", "close"]);

const newBoard = ref({
  title: "",
  content: "",
  writerId: "",
  category: "",
});

// 로그인 사용자 정보가 바뀌면 작성자 자동 세팅
watch(
  () => props.user,
  (val) => {
    if (val) newBoard.value.writerId = val.memberId;
  },
  { immediate: true }
);

// 등록 버튼 클릭 시 상위로 데이터 emit
const submitBoard = () => {
  if (!newBoard.value.title || !newBoard.value.writerId) {
    alert("제목과 작성자는 필수 입력 항목입니다.");
    return;
  }
  emit("create", newBoard.value);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: #fff;
  width: 400px;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 12px;
  color: #333;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  resize: none;
}

.modal-content textarea {
  height: 100px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.submit-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.cancel-btn {
  background-color: #aaa;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #777;
}
</style>
