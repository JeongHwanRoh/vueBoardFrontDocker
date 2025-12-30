// lib/chatSocket.ts
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export interface ChatMessage {
  memberId: string;
  name: string;
  message: string;
  sendtime: string;
}

class ChatSocket {
  private stompClient: any = null;
  private connected = false;

  connect(onMessage: (msg: ChatMessage) => void): void {
    // 이미 연결된 경우 중복 방지
    if (this.connected && this.stompClient) {
      console.log("이미 STOMP 연결 중 - 재연결 생략");
      return;
    }

    const socket = new SockJS("/ws-chat");
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log("STOMP 연결 성공");
      this.connected = true;

      this.stompClient.subscribe("/topic/messages", (msg: any) => {
        const message: ChatMessage = JSON.parse(msg.body);
        onMessage(message);
      });
    });
  }

  sendMessage(message: ChatMessage): void {
    if (!this.stompClient || !this.connected) {
      console.warn("STOMP 연결이 안 되어 있습니다.");
      return;
    }
    this.stompClient.send("/app/send", {}, JSON.stringify(message));
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      console.log(" STOMP 연결 종료");
      this.connected = false;
    }
  }
}
export default ChatSocket;
