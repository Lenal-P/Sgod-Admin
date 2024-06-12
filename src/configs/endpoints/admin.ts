const API_URL = process.env.NEXT_PUBLIC_BASE_URL

export default {
  //Admin
  changeImageAdminEndpoint: `${API_URL}/admin/change-image`,
  putAdminEndpoint: `${API_URL}/admin/put`,
  changePassAdminEndpoint: `${API_URL}/auth/change-password-admin/change-password`,

  //User
  deleteUserEndpoint: `${API_URL}/admin/manager/delete-user`,
  editUserEndpoint: `${API_URL}/admin/manager/edit-user`,
  addUserEndpoint: `${API_URL}/admin/manager/create-user`,
  listStudentEndpoint: `${API_URL}/admin/manager/get-paginate?role=student`,
  listTeacherEndpoint: `${API_URL}/admin/manager/get-paginate?role=teacher`,
  getIdUserEndpoint: `${API_URL}/user/get`,

  // Category
  listCategoryEndpoint: `${API_URL}/category/get-paginate`,
  deleteCategoryEndpoint: `${API_URL}/category/delete`,
  editCategoryEndpoint: `${API_URL}/category/put`,
  addCategoryEndpoint: `${API_URL}/category/post`,
  getallCategoryEndpoint: `${API_URL}/category/get-all`,


  //Courses
  listCoursesEndpoint: `${API_URL}/course/get-paginate`,
  getallCoursesEndpoint: `${API_URL}/course/get-all`,
  getIdCoursesEndpoint: `${API_URL}/course/get`,
  deleteCoursesEndpoint: `${API_URL}/course/delete`,
  editCoursesEndpoint: `${API_URL}/course/put`,
  addCoursesEndpoint: `${API_URL}/course/post`,
  detailCoursesEndpoint: `${API_URL}/course/get-detail`,
  addStudentToCoursesEndpoint: `${API_URL}/admin/manager/add-user-course`,
  deleteStudentToCoursesEndpoint: `${API_URL}/admin/manager/delete-user-course`,
  studentWithoutCourseEndpoint: `${API_URL}/course/get-student-without-course`,

  //Forgot Password
  forgotStep1Endpoint: `${API_URL}/auth/forget-password/send-otp`,
  forgotStep2Endpoint: `${API_URL}/auth/forget-password/verify-otp`,
  forgotStep3Endpoint: `${API_URL}/auth/forget-password/reset-password`,


  // Upload File
  uploadFileEndpoint: `${API_URL}/upload-image`,
  deleteFileEndpoint: `${API_URL}/delete-image`,

  //Quiz Question Store
  getallQuizStoreEndpoint: `${API_URL}/quiz-question-store/get-all`,
  getIdQuizStoreEndpoint: `${API_URL}/quiz-question-store/get`,
  listQuizStoreEndpoint: `${API_URL}/quiz-question-store/get-paginate`,
  editQuizStoreEndpoint: `${API_URL}/quiz-question-store/put`,
  deleteQuizStoreEndpoint: `${API_URL}/quiz-question-store/delete`,
  getDetailQuizStoreEndpoint: `${API_URL}/quiz-question-store/get-store-detail`,
  addQuizStoreEndpoint: `${API_URL}/quiz-question-store/post`,

  //Quiz Question
  deleteQuizQuestionEndpoint: `${API_URL}/quiz-question/delete`,
  editQuizQuestionEndpoint: `${API_URL}/quiz-question/put`,

  //Quiz
  deleteQuizEndpoint: `${API_URL}/quiz/delete`,
  editQuizEndpoint: `${API_URL}/quiz/put`,
  listQuizEndpoint: `${API_URL}/quiz/get-paginate`,
  getIdQuizEndpoint: `${API_URL}/quiz/get`,
  getIdQuizScoreEndpoint: `${API_URL}/quiz-answer/get-score-quiz`,
  getDetailQuizExamEndpoint: `${API_URL}/quiz-answer/get-detail-quiz-exam`,
  getallQuizEndpoint: `${API_URL}/quiz/get-all`,

  //Quiz Online
  getallQuizOnlineEndpoint: `${API_URL}/quiz-online/get-paginate`,
  deleteQuizOnlineEndpoint: `${API_URL}/quiz-online/delete`,
  getDetailQuizOnlineEndpoint: `${API_URL}/quiz-online/get`,

  //Essay
  addEssayEndpoint: `${API_URL}/essay-exam/post`,
  getallEssayEndpoint: `${API_URL}/essay-exam/list-exams/all-exams`,
  getCreateEssayEndpoint: `${API_URL}/essay-exam/list-exams/exams-created`,
  getIdEssayEndpoint: `${API_URL}/essay-exam/exams-student`,
  editEssayEndpoint: `${API_URL}/essay-exam/update-essay-exam`,
  deleteEssayEndpoint: `${API_URL}/essay-exam/delete-essay-exam`,
  getIdEssayExamEndpoint: `${API_URL}/essay-exam-score/get-scores-all`,
  markEssayExamEndpoint: `${API_URL}/essay-exam-score/mark-essay-exam`,
  getAnswerEssayExamEndpoint: `${API_URL}/essay-exam-answer`,
  getEssayScoreEndpoint: `${API_URL}/essay-exam-score/get-score-by-idanswer/essay-score`,
  getStatusMarkEndpoint: `${API_URL}/essay-exam-score/get-list-student/confirm/status-mark`,
  checkPlagiarismEndpoint: `${API_URL}/essay-exam-answer/check-plagiarism`,

  //Chart
  getScoreQuizEndpoint: `${API_URL}/chart/get-quiz-score-admin`,
  getScoreEssayEndpoint: `${API_URL}/essay-exam-score/get-chart-by-exam/essay-score`,
}
