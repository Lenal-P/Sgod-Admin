// ** React Imports
import { ChangeEvent, useEffect, useState } from "react";

// ** MUI Imports
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Grid,
  MenuItem,
  Modal,
  Paper,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  IconButton
} from "@mui/material";

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

import toast from "react-hot-toast";
import { handleAxiosError } from "src/utils/errorHandler";

// ** Custom Component Imports
import CustomTextField from "src/@core/components/mui/text-field";

// ** Config
import teacherConfig from "src/configs/endpoints/teacher";

// ** Styled Component
import dayjs from "dayjs";
import AxiosInstance from "src/configs/axios";
import { ICourse, IQuizDetail } from "../../../../types/quiz/types";
import TableHeaderQuizDetail from 'src/views/apps/courses/list/TableHeaderBreadcrumb';

// ** Utils
import { useRouter } from "next/router";
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import { TimeState } from "src/types/timeTypes";
import { createDate } from "src/utils/dateTime";
import { useTranslation } from "react-i18next";

interface IQuizQuestion {
  _id: string;
  title: string;
  owner: string;
  is_share: boolean;
}

export default function CreateEssayPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [quizDetail, setQuizDetail] = useState<Partial<IQuizDetail>>({});
  const [listDetailQuestion, setListDetailQuestion] = useState<any>([]);
  const [listDetailQuestionStore, setListDetailQuestionStore] = useState<any>([]);
  const [courseList, setCourseList] = useState<ICourse[]>([])
  const [questionStoreList, setQuestionStoreList] = useState<any[]>([{
    title: "",
    _id: ""
  }])
  const isLoading = false
  const [timeStart, setTimeStart] = useState<TimeState | null>(null)
  const [timeEnd, setTimeEnd] = useState<TimeState | null>(null)
  const totalListDetailQuestionEasy = listDetailQuestion?.filter((x: any) => x.level === "easy").length
  const totalListDetailQuestionMiddle = listDetailQuestion?.filter((x: any) => x.level === "middle").length
  const totalListDetailQuestionHard = listDetailQuestion?.filter((x: any) => x.level === "hard").length
  const { t } = useTranslation()

  function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };


  function handleChangePage(event: unknown, newPage: number) {
    setCurrentPage(newPage);
  };


  function handleChangeTotalLevel(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, level: "easy" | "middle" | "hard") {
    const value = Number(event.target.value)

    if (value >= 0 && value < 1000) {
      setQuizDetail(prev => ({ ...prev, ['total_question_' + level]: value }))
    }
  }


  async function fetchDetailQuestionStore(id: string) {
    const res = await AxiosInstance.get(`${teacherConfig.getDetailQuestionStore}/${id}`)
    const result = res.data.response.res.dataQuestion

    return result
  }


  async function handleChangeListQuestion(newValue: any) {
    let dataQuestion = []
    if (newValue) {
      dataQuestion = await fetchDetailQuestionStore(newValue?._id)
      setListDetailQuestionStore(dataQuestion.map((x: any) => ({ ...x, isChecked: false })))

    } else {
      setListDetailQuestionStore([])
    }
  }


  function isTimeEndLessThanTimeStart(): boolean {
    if (quizDetail.time_begin && quizDetail.time_end && timeStart && timeEnd) {

      return createDate(timeStart).getTime() < createDate(timeEnd).getTime()
    }

    return false
  }


  function checkEqualQuestion(): boolean {

    return totalListDetailQuestionMiddle === quizDetail.total_question_middle &&
      totalListDetailQuestionHard === quizDetail.total_question_hard
  }


  function settingsQuizValid(): boolean {

    return !isTimeEndLessThanTimeStart() || !checkEqualQuestion()
  }


  function handleCheckQuestionList(question: any) {
    setListDetailQuestion((prev: any) => {
      const updatedList = [...prev];
      const index = updatedList.findIndex(x => x._id === question._id);

      if (index === -1) {
        updatedList.push(question);
      } else {
        updatedList.splice(index, 1);
      }

      return updatedList;
    });
  }

  console.log(listDetailQuestion)

  function handleChangeMaxScore(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const currentMaxScore = Number(event.target.value)
    if (currentMaxScore < 1000) {
      setQuizDetail(prev => ({
        ...prev, max_score: currentMaxScore
      }))
    }
  }


  function handleChangeTotalTime(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const currentValue = Number(event.target.value)
    if (currentValue > -1 && currentValue < 1000 && !/^00.*$/.test(currentValue.toString())) {
      setQuizDetail(prev => ({
        ...prev, total_time: currentValue
      }))
    }
  }

  function handleChangeCourse(event: SelectChangeEvent<unknown>) {
    const value = event.target.value as string
    setQuizDetail(prev => ({
      ...prev, course_id: value
    }))
  }

  function checkSelectValidQuestion(a: number, b: number): string {
    if (a < b) {
      return "text.primary"
    } else if (a === b) {
      return "success.main"
    } else {
      return "error.main"
    }
  }




  function handleChangeTitle(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const value = event.target.value as string
    setQuizDetail(prev => ({
      ...prev, title: value
    }))
  }


  async function fetchListQuizQuestion(id: string) {
    const res = await AxiosInstance.get(`${teacherConfig.getQuestionQuizDetail}/${id}`)
    const listQuizQuestionData = res.data.res
    setListDetailQuestion(listQuizQuestionData)
  }


  useEffect(() => {
    async function fetchData() {
      try {
        const [courseListRes, questionRes, quizDetailRes] = await Promise.all([
          AxiosInstance.get(`${teacherConfig.getAllCourse}`),
          AxiosInstance.get(`${teacherConfig.getAllQuizQuestionStore}`),
          AxiosInstance.get(`${teacherConfig.getDetailQuiz}/${router.query.id}`),
        ]);
        const courseListData: ICourse[] = courseListRes.data
        const questionData: IQuizQuestion[] = questionRes.data.res
        const quizDetailData: IQuizDetail = quizDetailRes.data
        setQuizDetail(quizDetailData)
        setTimeStart({
          days: new Date(quizDetailData.time_begin).getDate(),
          months: new Date(quizDetailData.time_begin).getMonth() + 1,
          years: new Date(quizDetailData.time_begin).getFullYear(),
          hours: new Date(quizDetailData.time_begin).getHours(),
          minutes: new Date(quizDetailData.time_begin).getMinutes()
        })
        setTimeEnd({
          days: new Date(quizDetailData.time_end).getDate(),
          months: new Date(quizDetailData.time_end).getMonth() + 1,
          years: new Date(quizDetailData.time_end).getFullYear(),
          hours: new Date(quizDetailData.time_end).getHours(),
          minutes: new Date(quizDetailData.time_end).getMinutes()
        })
        fetchListQuizQuestion(quizDetailData._id)
        setQuestionStoreList(prev => [...prev, ...questionData.map((x: { title: any; _id: any; }) => ({ title: x.title, _id: x._id }))])
        setQuizDetail(quizDetailData)
        setCourseList(courseListData)
      } catch (error) {
        console.log(error)
      }

    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    const data = {
      id: router.query.id,
      title: quizDetail.title,
      course_id: quizDetail.course_id,
      total_question_easy: quizDetail.total_question_easy,
      total_question_middle: quizDetail.total_question_middle,
      total_question_hard: quizDetail.total_question_hard,
      total_time: quizDetail.total_time,
      max_score: quizDetail.max_score,
      time_begin: timeStart ? createDate(timeStart).toISOString() : null,
      time_end: timeEnd ? createDate(timeEnd).toISOString() : null,
      list_questions: listDetailQuestion.map((x: any) => x._id),
    }
    try {
      await AxiosInstance.put("https://e-learming-be.onrender.com/quiz/put", data)
      toast.success("Update successfully!")

    } catch (error) {
      handleAxiosError(error)
    }

  }

  return (
    <>
      <Card>
        <TableHeaderQuizDetail />
        <CardContent>
          <Grid container sx={{ alignItems: "center" }} spacing={4}>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('Title')}
              </Grid>
              <Grid item xs={9.5}>
                <CustomTextField value={quizDetail.title || ""} onChange={handleChangeTitle} fullWidth placeholder='Nhập tên...' />
              </Grid>
            </Grid>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('Select Course')}
              </Grid>
              <Grid item xs={9.5}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue=""
                  SelectProps={{
                    MenuProps: {
                      sx: { maxHeight: "300px" },
                    },
                    value: quizDetail.course_id || "",
                    displayEmpty: true,
                    onChange: event => handleChangeCourse(event)
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
                  value={dayjs(quizDetail.time_begin)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setTimeStart({
                        days: newValue.date(),
                        months: newValue.month() + 1,
                        years: newValue.year(),
                        minutes: newValue.minute(),
                        hours: newValue.hour()
                      })
                    }
                  }} />
              </Grid>
            </Grid>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('End Date')}
              </Grid>
              <Grid item xs={9.5}>
                <Grid item xs={9.5}>
                  <Tooltip
                    arrow
                    open={!isTimeEndLessThanTimeStart()}
                    title={t("The End Time Must Be Greater Than The Start Time")}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontWeight: 400,
                          color: "#000",
                          backgroundColor: 'secondary.main',
                        },
                      },
                    }}
                    placement="bottom">
                    <Box>
                      <DateTimePicker
                        value={dayjs(quizDetail.time_end)}
                        onChange={(newValue) => {
                          if (newValue) {
                            setTimeEnd({
                              days: newValue.date(),
                              months: newValue.month() + 1,
                              years: newValue.year(),
                              minutes: newValue.minute(),
                              hours: newValue.hour()
                            })
                          }
                        }} />
                    </Box>
                  </Tooltip>
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
                    value={quizDetail.total_time || 0}
                    onChange={handleChangeTotalTime}
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
                  sx={{
                    width: '56px',
                    padding: '8px 0px',
                    textAlign: 'center',
                  }}
                  onChange={(event) => handleChangeMaxScore(event)}
                  value={quizDetail.max_score || ""}
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
                  onChange={(event) => handleChangeTotalLevel(event, "easy")}
                  value={quizDetail.total_question_easy || 0}
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
                  onChange={(event) => handleChangeTotalLevel(event, "middle")}
                  value={quizDetail.total_question_middle || 0}
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
                  onChange={(event) => handleChangeTotalLevel(event, "hard")}
                  value={quizDetail.total_question_hard || 0}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <Stack sx={{ px: "1.5rem", mt: "1.5rem", border: "1px solid text.primary", justifyContent: "space-between", width: "100%" }} direction="row" spacing={4}>
          <Stack direction="row" spacing={4}>
            <Box>{t('Total Question Easy')}:{" "}
              <Typography
                variant="caption"
                color={checkSelectValidQuestion(totalListDetailQuestionEasy, quizDetail.total_question_easy || 0)}
                sx={{
                  fontSize: 15
                }}>
                {totalListDetailQuestionEasy}
              </Typography>{" / "}
              <Typography
                variant="caption"
                sx={{
                  fontSize: 15
                }}>
                {quizDetail.total_question_easy}
              </Typography>
            </Box>
            <Box>{t('Total Question Normal')}:{" "}
              <Typography
                variant="caption"
                color={checkSelectValidQuestion(totalListDetailQuestionMiddle, quizDetail.total_question_middle || 0)}
                sx={{
                  fontSize: 15
                }}>
                {totalListDetailQuestionMiddle}
              </Typography>{" / "}
              <Typography variant="caption" sx={{
                fontSize: 15
              }}>
                {quizDetail.total_question_middle}
              </Typography>
            </Box>
            <Box>{t('Total Question Hard')}:{" "}
              <Typography
                variant="caption"
                color={checkSelectValidQuestion(totalListDetailQuestionHard, quizDetail.total_question_hard || 0)}
                sx={{
                  fontSize: 15
                }}>
                {totalListDetailQuestionHard}
              </Typography>{" / "}
              <Typography variant="caption" sx={{
                fontSize: 15
              }}>
                {quizDetail.total_question_hard}
              </Typography>
            </Box>
          </Stack>

          <Box>
            <Button onClick={handleOpenModal} variant='contained'>{t('Add Question')}</Button>
          </Box>
        </Stack>
        <Grid container item sx={{ mt: "1.5rem" }}>
          {listDetailQuestion.length ?
            <Box sx={{ width: "100%" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                    <TableRow>
                      <TableCell>{t('No')}</TableCell>
                      <TableCell>{t('Quiz Question Store')}</TableCell>
                      <TableCell>{t('Question')}</TableCell>
                      <TableCell>{t('Level')}</TableCell>
                      <TableCell align='center'>{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listDetailQuestion.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((row: any, index: any) => {
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
                          <TableCell align="center">...</TableCell>
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
        <Box sx={{ px: "1.5rem", py: "2rem", textAlign: "left" }}>
          <Button onClick={handleSubmit} disabled={settingsQuizValid()} variant='contained'>{isLoading ? t("Loading...") : t("Update")}</Button>
        </Box>
      </Card>
      <Modal onClose={handleCloseModal} open={openModal}>
        <Box
          sx={{
            outline: "none",
            backgroundColor: "background.paper",
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: 1200,
          }}>
          <Box
            sx={{
              height: 600,
              overflowY: "scroll",
              overflowX: "hidden",
              px: "1rem",
              '&::-webkit-scrollbar': {
                width: 6
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: 20,
                background: theme => hexToRGBA(theme.palette.mode === 'light' ? '#B0ACB5' : '#575468', 0.6)
              },
              '&::-webkit-scrollbar-track': {
                borderRadius: 20,
                background: 'transparent'
              },
            }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}>
              <IconButton onClick={handleCloseModal}>
                <Icon icon='material-symbols:close' />
              </IconButton>
            </Box>
            <CardHeader sx={{ px: 0, mt: 8, mb: 4 }} title={t('Select Quiz Question Store')} />
            <CardContent sx={{ px: "1rem" }}>
              <Grid container sx={{ alignItems: "center" }} spacing={4}>
                <Stack sx={{ width: "100%" }} spacing={4}>
                  <Stack direction="row" spacing={4} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Autocomplete
                      onChange={(_event, newValue) => handleChangeListQuestion(newValue)}
                      options={questionStoreList}
                      isOptionEqualToValue={(option, newValue) => option.title === newValue.title}
                      getOptionLabel={option => option.title || ''}
                      renderOption={(props, option) => option.title !== "" ? (<Box component="li" {...props} key={option._id}>
                        {option.title}
                      </Box>) : null
                      }
                      sx={{ width: 250 }}
                      renderInput={params => <TextField {...params} label={t('Select Quiz Question Store')} />}
                    />
                    <Stack sx={{ px: "1.5rem", mt: "1.5rem", border: "1px solid text.primary" }} direction="row" spacing={4}>
                      <Box>{t('Total Question Easy')}:{" "}
                        <Typography
                          variant="caption"
                          color={checkSelectValidQuestion(totalListDetailQuestionEasy, quizDetail.total_question_easy || 0)}
                          sx={{
                            fontSize: 15
                          }}>
                          {totalListDetailQuestionEasy}
                        </Typography>{" / "}
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 15
                          }}>
                          {quizDetail.total_question_easy}
                        </Typography>
                      </Box>
                      <Box>{t('Total Question Normal')}:{" "}
                        <Typography
                          variant="caption"
                          color={checkSelectValidQuestion(totalListDetailQuestionMiddle, quizDetail.total_question_middle || 0)}
                          sx={{
                            fontSize: 15
                          }}>
                          {totalListDetailQuestionMiddle}
                        </Typography>{" / "}
                        <Typography variant="caption" sx={{
                          fontSize: 15
                        }}>
                          {quizDetail.total_question_middle}
                        </Typography>
                      </Box>
                      <Box>{t('Total Question Hard')}:{" "}
                        <Typography
                          variant="caption"
                          color={checkSelectValidQuestion(totalListDetailQuestionHard, quizDetail.total_question_hard || 0)}
                          sx={{
                            fontSize: 15
                          }}>
                          {totalListDetailQuestionHard}
                        </Typography>{" / "}
                        <Typography variant="caption" sx={{
                          fontSize: 15
                        }}>
                          {quizDetail.total_question_hard}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                  {listDetailQuestionStore.length ? <Box>
                    <TableContainer sx={{ height: 338.5 }} component={Paper}>
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                          <TableRow>
                            <TableCell>{t('No')}</TableCell>
                            <TableCell>{t('Question')}</TableCell>
                            <TableCell>{t('Level')}</TableCell>
                            <TableCell align="center">{t('Select Question')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listDetailQuestionStore.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((row: any, index: number) => (
                            <TableRow
                              key={row._id}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <Box dangerouslySetInnerHTML={{ __html: row.question }} />
                              </TableCell>
                              <TableCell>{row.level}</TableCell>
                              <TableCell align="center">
                                <>
                                  <Checkbox disabled={isLoading}
                                    checked={listDetailQuestion.some((x: any) => x._id === row._id)}
                                    onClick={() => handleCheckQuestionList(row)} />
                                </>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[1, rowsPerPage, listDetailQuestionStore.length]}
                      component="div"
                      count={listDetailQuestionStore.length}
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
                </Stack>
              </Grid>
              <Box sx={{ mt: "0rem", textAlign: "right" }}>
                <Button onClick={handleCloseModal} variant='contained'>{isLoading ? t("Loading...") : t("Save")}</Button>
              </Box>
            </CardContent>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
