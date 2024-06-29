// ** React Imports
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// ** Custom Component Imports
import CustomTextField from "src/@core/components/mui/text-field";
import TableHeaderBreadcrumb from 'src/views/apps/courses/list/TableHeaderBreadcrumb';
import ChartQuizScore from '../../courses/chart/ChartQuizScore';

// ** Config
import teacherConfig from "src/configs/endpoints/teacher";

// ** Styled Component
import dayjs from "dayjs";
import AxiosInstance from "src/configs/axios";
import { ICourse } from "src/types/quiz/types";
import adminPathName from 'src/configs/endpoints/admin';

// ** Utils
import { useRouter } from "next/router";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { updateData } from 'src/store/apps/breadcrumbs'
import toast from "react-hot-toast";
import { QuizScore } from "src/context/types";
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface IQuizQuestion {
  _id: string;
  title: string;
  owner: string;
  is_share: boolean;
}

interface IQuizDetail {
  _id: string;
  teacher_id: string;
  title: string;
  course_id: string;
  total_question_hard: number;
  total_question_middle: number;
  total_question_easy: number;
  total_time: number;
  max_score: number;
  time_begin: string; // ISO string format for dates
  time_end: string; // ISO string format for dates
  createAt: string; // ISO string format for dates
}

export default function DetailQuiz() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [quizDetail, setQuizDetail] = useState<IQuizDetail>();
  const [listDetailQuestion, setListDetailQuestion] = useState<any[]>();
  const [courseList, setCourseList] = useState<ICourse[]>([])
  const [questionStoreList, setQuestionStoreList] = useState<any[]>([{
    title: "",
    _id: ""
  }])
  const isLoading = false
  const [value, setValue] = useState<string>('1')
  const [listScore, setListScore] = useState<QuizScore[]>([]);
  const { t } = useTranslation();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 });
  const dispatch = useDispatch()

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangePageScore = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPageScore = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPaginationModel((prev) => ({ ...prev, pageSize: parseInt(event.target.value, 10), page: 0 }));
  };

  async function fetchListQuizQuestion(id: string) {
    const res = await AxiosInstance.get(`${teacherConfig.getQuestionQuizDetail}/${id}`)

    setListDetailQuestion(res.data.res)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseListRes, questionRes, quizDetailRes, dataScoreRes] = await Promise.all([
          AxiosInstance.get(`${teacherConfig.getAllCourse}`),
          AxiosInstance.get(`${teacherConfig.getAllQuizQuestionStore}`),
          AxiosInstance.get(`${teacherConfig.getDetailQuiz}/${router.query.id}`),
          AxiosInstance.post(`${adminPathName.getIdQuizScoreEndpoint}`, { quiz_id: router.query.id })
        ]);
        const courseListData: ICourse[] = courseListRes.data
        const questionData: IQuizQuestion[] = questionRes.data.res
        const quizDetailData: IQuizDetail = quizDetailRes.data
        const dataScore: QuizScore[] = dataScoreRes.data
        fetchListQuizQuestion(quizDetailData._id)
        setQuestionStoreList(prev => [...prev, ...questionData.map((x: { title: any; _id: any; }) => ({ title: x.title, _id: x._id }))])
        setQuizDetail(quizDetailData)
        setCourseList(courseListData)
        setListScore(dataScore);
      } catch (error: any) {
        if (error && error.response) {
          toast.error(error.response.data.message)
        }
      }
    }
    fetchData()
  }, []);

  const generateCsvData = () => {
    return listScore.map((quiz: any) => ({
      Student: quiz.name,
      Total_Exam: quiz.dataScore.total_exam,
      Total_Score_All_Questions: quiz.dataScore.total_score_all_questions,
      Total_Select_Answer: quiz.dataScore.total_select_answer,
      Max_Score: quiz.dataScore.max_score,
      Ten_Point_Scale: quiz.dataScore.ten_point_scale,
      Num_True_Answer: quiz.dataScore.num_true_answer,
    }));
  };

  const generatePdfContent = () => {
    const doc = new jsPDF() as any; // Type assertion might be necessary here
    const totalPages = doc.internal.getNumberOfPages(); // Get total number of pages

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i); // Set current page
      doc.setFontSize(12);

      // Add title "List Scores" at the top
      doc.text(t("List Scores"), 105, 10, null, null, 'center');

      // Add content to each page
      if (listScore && listScore.length > 0) {
        doc.autoTable({
          head: [['Full Name', 'Total Exam', 'Total Score All Questions', 'Total Select Answer', 'Max Score', 'Ten Point Scale', 'Num True Answer']],
          body: listScore.map(user => [
            user.name,
            user.dataScore.total_exam,
            user.dataScore.total_score_all_questions,
            user.dataScore.total_select_answer,
            user.dataScore.max_score,
            user.dataScore.ten_point_scale,
            user.dataScore.num_true_answer
          ]),
          startY: 20
        });
        const signatureText = t("Teacher");
        const signatureX = doc.internal.pageSize.width - 30;
        const signatureY = doc.autoTable.previous.finalY + 15;
        doc.text(signatureText, signatureX, signatureY, null, null, 'right');
      } else {
        doc.text(t("No rows"));
      }
    }

    return doc;
  };

  const exportPDF = () => {
    const doc = generatePdfContent();
    doc.save(`quiz_scores_${router.query.id}.pdf`);
  };

  const user = localStorage.getItem('userData')
  const userData = user ? JSON.parse(user) : null

  return (
    <>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='customized tabs example'>
          <Tab value='1' label='Detail Quiz' />
          <Tab value='2' label='Quiz Score' />
        </TabList>
        <TabPanel value='1' sx={{ px: 0 }}>
          <Card>
            <TableHeaderBreadcrumb />
            <CardContent>
              <Grid container sx={{ alignItems: "center" }} spacing={4}>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('Title')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <CustomTextField value={quizDetail?.title || ""} disabled fullWidth placeholder='' />
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('Select Course')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <CustomTextField
                      disabled
                      select
                      fullWidth
                      defaultValue=""
                      SelectProps={{
                        MenuProps: {
                          sx: { maxHeight: "300px" },
                        },
                        value: courseList.filter(x => x._id === quizDetail?.course_id).map(x => x._id).join(),
                        displayEmpty: true,
                      }}
                    >
                      <MenuItem value="">{t('Select Course')}</MenuItem>
                      {courseList?.map((x, i) => {
                        return <MenuItem key={i} value={x._id}>{x.name}</MenuItem>
                      })}

                    </CustomTextField>
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('Issued Date')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <DateTimePicker
                      value={dayjs(quizDetail?.time_begin)}
                      disabled
                    />
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('End Date')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <Grid item xs={9.5}>
                      <DateTimePicker
                        value={dayjs(quizDetail?.time_end)}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('Time Limit')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CustomTextField
                        sx={{
                          '& > .MuiInputBase-root': { width: "66px !important", },
                          '& input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0
                          }

                        }}
                        type="number"
                        value={quizDetail?.total_time}
                        disabled
                      />
                      <Typography sx={{ display: "flex" }} variant='body1'>{t('Minute')}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('Point Ladder')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <TextField
                      disabled
                      sx={{
                        width: '56px',
                        padding: '8px 0px',
                        textAlign: 'center',
                      }}
                      value={quizDetail?.max_score}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('Total Question Easy')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <TextField
                      sx={{
                        width: '58px',
                        padding: '8px 0px',
                        textAlign: 'center',
                      }}
                      disabled
                      value={quizDetail?.total_question_easy}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('Total Question Normal')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <TextField
                      sx={{
                        width: '58px',
                        padding: '8px 0px',
                        textAlign: 'center',
                      }}
                      disabled
                      value={quizDetail?.total_question_middle}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('Total Question Hard')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <TextField
                      sx={{
                        width: '58px',
                        padding: '8px 0px',
                        textAlign: 'center',
                      }}
                      disabled
                      value={quizDetail?.total_question_hard}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
            <Stack sx={{ px: "1.5rem", mt: "1.5rem", border: "1px solid text.primary" }} direction="row" spacing={4}>
              <Box>{t('Total Question Easy')}:{" "}
                <Typography variant="caption" sx={{
                  fontSize: 15
                }}>
                  {quizDetail?.total_question_easy}
                </Typography>
              </Box>
              <Box>{t('Total Question Normal')}:{" "}
                <Typography variant="caption" sx={{
                  fontSize: 15
                }}>
                  {quizDetail?.total_question_middle}
                </Typography>
              </Box>
              <Box>{t('Total Question Hard')}:{" "}
                <Typography variant="caption" sx={{
                  fontSize: 15
                }}>
                  {quizDetail?.total_question_hard}
                </Typography>
              </Box>
            </Stack>
            <Grid container item sx={{ mt: "1.5rem" }}>
              {listDetailQuestion?.length ?
                <Box sx={{ width: "100%" }}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                        <TableRow>
                          <TableCell>{t('No')}</TableCell>
                          <TableCell>{t('Quiz Question Store')}</TableCell>
                          <TableCell>{t('Question')}</TableCell>
                          <TableCell>{t('Level')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listDetailQuestion?.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((row, index) => {
                          const questionStoreTitle = questionStoreList.filter(x => x._id === row.quiz_store_id).map((x, i) => i === 0 ? x.title : null).join('');

                          return (
                            <TableRow
                              key={row._id}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell>{questionStoreTitle}</TableCell>
                              <TableCell>
                                <Box dangerouslySetInnerHTML={{ __html: row.question }} />
                              </TableCell>
                              <TableCell>{row.level}</TableCell>
                            </TableRow>
                          );
                        })}

                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[1, rowsPerPage, listDetailQuestion.length]}
                    component="div"
                    count={listDetailQuestion.length}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Box> : <>
                  <Box sx={{ textAlign: 'center', padding: 5 }}>
                    {t('No rows')}
                  </Box>
                </>}
            </Grid>
            <Grid container item sx={{ px: "1.5rem", alignItems: "center", justifyContent: "flex-start", pt: "3rem", pb: "1.5rem" }}>
              <Box sx={{ mt: "0rem", textAlign: "right" }}>
                <Link href={`/apps/quiz/update/${router.query.id}`} passHref>
                  <Button
                    disabled={userData._id !== router.query.teacherID}
                    variant='contained'>
                    {isLoading ? t("Loading...") : t("Edit")}
                  </Button>
                </Link>
              </Box>
            </Grid>
          </Card >
        </TabPanel>

        <TabPanel value='2' sx={{ px: 0 }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Paper sx={{ flex: 1 }}>
                <TableHeaderBreadcrumb />
                <ChartQuizScore />
              </Paper>
              <Paper sx={{ flex: 1 }}>
                <Box
                  sx={{
                    padding: 6,
                    rowGap: 2,
                    columnGap: 4,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'end',
                    mt: 8
                  }}
                >
                  <Typography sx={{ display: 'flex', flex: 1, fontSize: 18 }}>{t('List Scores')}</Typography>
                  <CSVLink
                    data={generateCsvData()}
                    filename={`quiz_scores_${router.query.id}.csv`}
                    className="btn btn-primary"
                  >
                    <Button
                      variant='contained' disabled={!listScore || listScore.length === 0}>
                      {t('Export')} {t('CSV')}
                    </Button>
                  </CSVLink>
                  <Button variant='contained' onClick={exportPDF} disabled={!listScore || listScore.length === 0}>
                    {t('Export')} {t('PDF')}
                  </Button>
                </Box>
                <div id="pdfContent">
                  {listScore && listScore.length > 0 ? (
                    <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                      <Table aria-label='custom pagination table'>
                        <Box>
                          <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                            <TableRow>
                              <TableCell sx={{ width: '20%' }}>
                                {t('Full Name')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Total Exam')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, width: '20%', textAlign: 'center' }}>
                                {t('Total Score All Questions')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Total Selected Answer')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Max Score')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Ten Point Scale')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Num True Answer')}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                {t('Actions')}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {listScore && listScore.length > 0 && listScore.map((user: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell sx={{ fontSize: 15, width: '20%' }}>
                                  {user.name}
                                </TableCell>
                                <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                  {user.dataScore.total_exam}
                                </TableCell>
                                <TableCell sx={{ fontSize: 15, width: '20%', textAlign: 'center' }}>
                                  {user.dataScore.total_score_all_questions}
                                </TableCell>
                                <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                  {user.dataScore.total_select_answer}
                                </TableCell>
                                <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                  {user.dataScore.max_score}
                                </TableCell>
                                <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                  {user.dataScore.ten_point_scale}
                                </TableCell>
                                <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                  {user.dataScore.num_true_answer}
                                </TableCell>
                                <TableCell style={{ fontSize: 15, textAlign: 'center' }}>
                                  <>
                                    <Tooltip title={t('View')}>
                                      <IconButton
                                        size='small'
                                        component={Link}
                                        sx={{ color: 'text.secondary', fontSize: 22, mx: 2 }}
                                        href={`//apps/quiz/quizExam/${router.query.id}?studentId=${user.id}`}
                                        onClick={() => {
                                          dispatch(updateData(
                                            {
                                              title: user.name,
                                              url: `//apps/quiz/quizExam/${router.query.id}`
                                            }
                                          ))
                                        }}
                                      >
                                        <Icon icon='tabler:eye' />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Box>
                      </Table>
                      <TablePagination
                        rowsPerPageOptions={[{ label: 'All', value: -1 }]}
                        count={listScore.length || 1}
                        rowsPerPage={paginationModel.pageSize}
                        page={paginationModel.page}
                        component="div"
                        onPageChange={handleChangePageScore}
                        onRowsPerPageChange={handleChangeRowsPerPageScore}
                      />
                    </TableContainer>
                  ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                      <Table aria-label='custom pagination table'>
                        <Box>
                          <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                            <TableRow>
                              <TableCell sx={{ width: '20%' }}>
                                {t('Full Name')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Total Exam')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, width: '20%', textAlign: 'center' }}>
                                {t('Total Score All Questions')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Total Select Answer')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Max Score')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Ten Point Scale')}
                              </TableCell>
                              <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                {t('Num True Answer')}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                {t('Actions')}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                        </Box>
                      </Table>
                      <Box sx={{ textAlign: 'center', padding: 5 }}>
                        {t('No rows')}
                      </Box>
                    </TableContainer>
                  )}
                </div>
              </Paper>
            </>
          )}
        </TabPanel>
      </TabContext >
    </>
  )
}

DetailQuiz.acl = {
  action: 'read',
  subject: 'teacher-page'
}