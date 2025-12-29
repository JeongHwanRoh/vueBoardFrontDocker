<template>
  <div v-if="isOpen" class="chat-modal">
    <div class="chat-content">
      <!-- 상단 헤더 -->
      <div class="chat-header">
        <h3>💬 실시간 채팅</h3>
        <span class="close" @click="$emit('close')">&times;</span>
      </div>

      <!-- 채팅 메시지 -->
      <div class="chat-messages" ref="chatMessages">
        <div v-for="(msg, idx) in messages" :key="idx" class="chat-msg">
          <strong>{{ msg.name }}:</strong>
          <span>{{ msg.message }}</span>
          <small>{{ formatTime(msg.sendtime) }}</small>
        </div>
      </div>

      <!-- 하단 입력 -->
      <div class="chat-input-area">
        <input
          v-model="newMessage"
          type="text"
          placeholder="메시지를 입력하세요..."
          @keyup.enter="sendMessage"
        />
      </div>
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import ChatSocket from "@/lib/chatSocket";
import type { ChatMessage } from "@/lib/chatSocket"; // 타입 전용 IMPORT

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  user: { type: Object, default: null },
});
const emit = defineEmits(["close"]);

const socket = new ChatSocket();
const messages = ref<ChatMessage[]>([]);
const newMessage = ref("");

// 시간 포맷
const formatTime = (time: string) =>
  new Date(time).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

// 메시지 자동 스크롤
watch(messages, async () => {
  await nextTick();
  const box = document.querySelector(".chat-messages");
  if (box) box.scrollTop = box.scrollHeight;
});

// 메시지 전송
const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const msg: ChatMessage = {
    memberId: props.user?.memberId || "guest",
    name: props.user?.name || "익명",
    message: newMessage.value,
    sendtime: new Date().toISOString(),
  };
  socket.sendMessage(msg);
  newMessage.value = "";
};

// 모달이 열릴 때 WebSocket 연결
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      socket.connect((msg) => messages.value.push(msg));
    }
  }
);

// 연결 해제
onBeforeUnmount(() => socket.disconnect());
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.chat-content {
  width: 400px;
  height: 550px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
  padding: 10px;
}

.chat-msg {
  margin-bottom: 8px;
}

.chat-input-area {
  display: flex;
  border-top: 1px solid #ccc;
  padding: 10px;
}

.chat-input-area input {
  flex: 1;
  padding: 8px;
  margin-right: 8px;
}

.chat-input-area button {
  padding: 8px 16px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
