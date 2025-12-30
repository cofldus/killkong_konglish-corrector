// mobile/src/config/api.js
import { Platform } from 'react-native';

// 🚨 여기에 실제 컴퓨터 IP 주소를 입력하세요!
const YOUR_COMPUTER_IP = '172.20.10.13'; // ← ipconfig에서 확인한 IP로 변경

// 백엔드 서버 URL 설정
const getBackendUrl = () => {
  // 개발 환경에 따른 URL 설정
  if (__DEV__) {
    if (Platform.OS === "android") {
      // Android 에뮬레이터에서 실제 디바이스 테스트용
      return `http://${YOUR_COMPUTER_IP}:8000`;
    } else if (Platform.OS === "ios") {
      // iOS 시뮬레이터용 (Mac에서는 localhost 작동)
      return `http://${YOUR_COMPUTER_IP}:8000`;
    } else {
      // 웹용
      return "http://localhost:8000";
    }
  } else {
    // 프로덕션 환경
    return "https://your-production-server.com";
  }
};

// 또는 더 간단하게, 모든 환경에서 실제 IP 사용:
const getBackendUrlSimple = () => {
  return `http://${YOUR_COMPUTER_IP}:8000`;
};

export const API_CONFIG = {
  BASE_URL: getBackendUrl(), // 또는 getBackendUrlSimple()
  ENDPOINTS: {
    HEALTH: '/health',
    CHAT: '/api/v1/chat',
  },
  TIMEOUT: 30000, // 30초
};

// 디버깅용 - 앱 시작시 URL 출력
console.log('🌐 Backend URL:', API_CONFIG.BASE_URL);

// 나머지 코드는 동일...
export class FriendsFixerAPI {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    console.log('📡 API initialized with URL:', this.baseURL);
  }

  async checkHealth() {
    try {
      console.log('🏥 Health check to:', `${this.baseURL}/health`);
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Health check success:', data);
      return data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  async sendMessage(message, showHints = false) {
    try {
      console.log('💬 Sending message to:', `${this.baseURL}/api/v1/chat`);
      console.log('📝 Message:', message);
      
      const response = await fetch(`${this.baseURL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          show_hints: showHints,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Message sent successfully:', data.processing_time + 's');
      return data;
    } catch (error) {
      console.error('❌ Send message failed:', error);
      if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
        throw new Error('네트워크 연결을 확인해주세요. 백엔드 서버가 실행 중인가요?');
      }
      throw error;
    }
  }
}

// 싱글톤 인스턴스
export const friendsFixerAPI = new FriendsFixerAPI();