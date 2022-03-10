export const API_BASE_URL = "https://aivle-api.leotan.cn";
// export const API_BASE_URL = "http://127.0.0.1:8000";
// export const API_BASE_URL = "http://192.168.3.51:8000"

export const ROLE_ADMIN = 'ADM';
export const ROLE_GUEST = 'GUE';
export const ROLE_STUDENT = 'STU';
export const ROLE_LECTURER = 'LEC';
export const ROLE_TEACHING_ASSISTANT = 'TA';

export const JobStatusMap = {
  "C": "Received",
  "Q": "Queued",
  "R": "Running",
  "E": "Error",
  "D": "Done",
}

export const JobErrorMap = {
  "TLE": "Time Limit Exceeded",
  "MLE": "Memory Limit Exceeded",
  "VLE": "VRAM Limit Exceeded",
  "RE": "Runtime Error",
}
