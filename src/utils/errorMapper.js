/**
 * 백엔드 에러 메시지를 한국어로 변환하는 유틸리티
 */
export const getKoreanErrorMessage = (error) => {
    // 1. 응답 데이터 확인 (다양한 포맷 대응)
    const response = error?.response;
    const data = response?.data;
    const status = response?.status;

    // 에러 메시지 추출 시도
    let message = "";

    if (data) {
        if (typeof data === "string") {
            message = data;
        } else if (typeof data === "object") {
            message = data.message || data.error || data.detail || "";
        }
    }

    // 만약 메시지가 없으면 기본 error.message 확인
    if (!message) {
        message = error?.message || "";
    }

    // 소문자로 변환하여 비교 (대소문자 무시)
    const lowerMsg = message.toLowerCase();

    // console.log("Debug Error:", { status, message, lowerMsg });

    // 2. 메시지 내용 기반 매핑
    if (
        lowerMsg.includes("bad credentials") ||
        lowerMsg.includes("invalid email or password") ||
        lowerMsg.includes("login failed") ||
        lowerMsg.includes("unauthorized")
    ) {
        return "이메일 또는 비밀번호가 일치하지 않습니다.";
    }

    if (lowerMsg.includes("user already exists") || lowerMsg.includes("email already in use")) {
        return "이미 가입된 이메일입니다.";
    }

    if (lowerMsg.includes("user not found")) {
        return "가입되지 않은 이메일입니다.";
    }

    if (lowerMsg.includes("constraintviolationexception")) {
        return "입력 값이 올바르지 않습니다. 다시 확인해주세요.";
    }

    // 3. HTTP Status Code 기반 매핑
    if (status === 401 || status === 403) {
        return "이메일 또는 비밀번호가 일치하지 않습니다.";
    }
    if (status === 409) {
        return "이미 존재하는 계정입니다.";
    }
    if (status === 404) {
        return "가입되지 않은 이메일입니다.";
    }

    // 4. 일반적인 에러 패턴
    if (lowerMsg.includes("network error")) {
        return "서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
    }
    if (status >= 500) {
        return "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    // 5. Fallback (원본 메시지 포함 - 디버깅용)
    // 알 수 없는 오류일 때 원본을 괄호에 표시
    if (message && message.trim().length > 0) {
        const cleanMsg = message.length > 60 ? message.substring(0, 60) + "..." : message;
        return `오류가 발생했습니다. (${cleanMsg})`;
    }

    return "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.";
};
