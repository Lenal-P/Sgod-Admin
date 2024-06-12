export interface ITab {
  [x: string]: any;
  content: any;
  score: number
}
export interface IState {
  quiz_store_id: string | null;
  level: "easy" | "middle" | "hard" | null;
  question: any
  answer: ITab[];
}
export interface IQuizStore {
  _id: string;
  title: string;
  owner: string;
  is_share: boolean;
}

export interface ICourse {
  _id: string;
  name: string;
  category_id: string;
  icon: boolean;
  status: string;
}

export interface IQuizDetail {
  _id: string;
  teacher_id: string;
  title: string;
  course_id: string;
  total_question_hard: number;
  total_question_middle: number;
  total_question_easy: number;
  total_time: number;
  max_score: number;
  time_begin: string;
  time_end: string;
  createAt: string;
}
