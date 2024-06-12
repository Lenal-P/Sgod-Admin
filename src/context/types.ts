import { Dayjs } from "dayjs"

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  _id: string
  username: string
  fullName?: string
  avatar?: string | null
  role: string
  email: string
  name?: {
    last_name: string
    first_name: string
  }
  password?: string
  birthday?: string | Date | Dayjs
  phone_number?: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}

export type Category = {
  _id: string,
  name: string,
  icon: string
  total?: number;
}

export type Courses = {
  _id: string,
  name: string,
  category_id: string,
  icon: string,
  status: string
}

export type ForgotPass = {
  email: string,
  otp: string,
  newPassword: string,
  confirmNewPassword: string
}

export type QuizQuestionStore = {
  _id: string,
  title: string,
  owner: string,
  owner_name: string,
  is_share: boolean,
  createAt: Date
}

export type QuizQuestion = {
  _id: string,
  quiz_store_id: string,
  level: string,
  question: string,
  answer: [{
    content: string,
    score: number,
  }]
}

export type Quiz = {
  _id: string,
  teacher_id: string,
  teacher_name: string,
  title: string,
  course_id: string,
  total_question_hard: number;
  total_question_middle: number;
  total_question_easy: number;
  total_time: number,
  max_score: number,
  time_begin: string | Date | Dayjs,
  time_end: string | Date | Dayjs,
  createAt: string | Date | Dayjs,
  type?: string

}

export type QuizList = {
  quiz: Quiz
}

export type QuizOnline = {
  _id: string
  name: string
  title: string
  teacherId: string
}

export type Essay = {
  exam: {
    content: string;
    course_id: string;
    createAt: string | Date | Dayjs,
    files: string[];
    teacher_id: string;
    time_end: string | Date | Dayjs,
    time_start: string | Date | Dayjs,
    title: string;
    total_time: number;
    _id: string;
  }
  teacher_name: string;
}

export type EssayData = {
  data: {
    _id: string;
    essay_exam_id: string;
    student_id: string;
    content_answers: string;
    file_upload: string[];
    status: string;
    time_out: string | Date | Dayjs,
    createAt: string | Date | Dayjs,
  }
  student_name: string;
  essay_title?: string
  score?: number
}

export type QuizChart = {
  scores: string[]
  series: { data: number[] }[]
}

export type QuizScore = {
  id: string;
  name: string;
  dataScore: {
    total_exam: number;
    total_select_answer: number;
    max_score: string;
    ten_point_scale: string;
    num_true_answer: string;
    total_score_all_questions: number;
  }
};

export type QuizExamDetail = {
  _id: string;
  quizExamId: string;
  quizId: string;
  studentId: string;
  answers: {
    question: {
      _id: string;
      quizStoreId: string;
      level: string;
      question: string;
      answer: {
        _id?: string;
        content: string;
        score: number;
      }[];
      createAt: string | Date | Dayjs;
    };
    answer_select: number | null;
  }[];
  total_score: number;
  createdAt: string;
  updatedAt: string;
  total_score_all_questions: number;
};

export type CheckPlagiarism = {
  answer: {
    _id: string,
    essay_exam_id: string,
    student_id: string,
    content_answers: string,
    file_upload: [],
    status: string,
    createAt: string | Date | Dayjs,
    time_out: string | Date | Dayjs
  },
  note: string,
  student_name: string
};

export type QuizAnswer = {
  content: string;
  is_correct: boolean;
}

export type QuizOnlineData = {
  _id: string;
  quiz_store_id: string;
  question: string;
  level: string;
  answers: QuizAnswer[];
}

export type QuizData = {
  _id: string;
  teacherId: string;
  title: string;
  time_per_question: number;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}