const API_URL = process.env.NEXT_PUBLIC_BASE_URL

export default {
  userListEndpoint: `${API_URL}/get_student`,
  createQuizEndpoint: `${API_URL}/get_student`,
  getDetailQuizEndpoint: `${API_URL}/quiz-question/get`,
  getAllQuizQuestionStore: `${API_URL}/quiz-question-store/get-all`,
  getAllCourse: `${API_URL}/course/get-all`,
  getExamDetail: `${API_URL}/essay-exam/essay-exam-detail`,
  getLevelQuestionStore: `${API_URL}/quiz-question-store/get-num-of-level`,
  getDetailQuestionStore: `${API_URL}/quiz-question-store/get-store-detail`,
  getDetailQuiz: `${API_URL}/quiz/get`,
  getQuestionQuizDetail: `${API_URL}/quiz-exam/get/examDetail`
}
