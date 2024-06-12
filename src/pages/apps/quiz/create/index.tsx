// ** React Imports
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

// ** MUI Imports
import { TabContext, TabList, TabListProps, TabPanel } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  MenuItem,
  Modal,
  Paper,
  SelectChangeEvent,
  Stack,
  styled,
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

// ** Axios

// ** Config
import teacherConfig from "src/configs/endpoints/teacher";

// ** Icon Imports


// ** Styled Component
import dayjs from "dayjs";
import AxiosInstance from "src/configs/axios";
import { removeDuplicates } from "src/utils/array";
import { ICourse } from "../../../../types/quiz/types";

// ** Utils
import toast from "react-hot-toast";
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
import { TimeState } from "src/types/timeTypes";
import { createDate } from "src/utils/dateTime";
import { handleAxiosError } from "src/utils/errorHandler";
import { allPropertiesExist } from "src/utils/validationUtils";
import { useTranslation } from "react-i18next";

interface IQuestionStore {
  title: string,
  _id: string,
  total_level_hard: number,
  total_level_middle: number,
  total_level_easy: number,
  select_level_hard?: number,
  select_level_middle?: number,
  select_level_easy?: number
}
interface ITotalLevel {
  easy: number | string | null
  middle: number | string | null
  hard: number | string | null
}
interface IListQuestion {
  _id: string;
  level: string
}


interface IListDetailQuestion {
  _id: string;
  title: string;
  quiz_store_id: string;
  level: string;
  question: string;
  createAt: string;
  isChecked?: boolean;
}

interface IQuestionStoreList {
  _id: string;
  title: string
  createAt?: string;
  is_share?: boolean;
  owner?: string;
}


// ** Styled Custom
const TabListStyled = styled(TabList)<TabListProps>(({ theme }) => ({
  border: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '&, & .MuiTabs-flexContainer': {
    gap: "1rem"
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    overflow: "unset",
    minWidth: 65,
    minHeight: 42,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    },
    '&:hover .remove-answer': {
      display: 'block'
    },
    '&:not(.plus):hover': {
      color: theme.palette.primary.main
    }
  },
  '& .MuiTab-root.checked': {
    backgroundColor: "#388e3c"
  },
  '& .MuiTab-root.plus': {
    backgroundColor: "rgba(255,255,255,0.15)",
    transitionDuration: "150ms",
    '&:hover': {
      backgroundColor: "rgba(255,255,255,0.25)"
    }
  },
}))


export default function CreateQuizPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [activeTab, setActiveTab] = useState('1')
  const INIT_AUTO_QUESTION: IQuestionStore = {
    title: "",
    _id: "",
    total_level_hard: 0,
    total_level_middle: 0,
    total_level_easy: 0,
    select_level_hard: 0,
    select_level_middle: 0,
    select_level_easy: 0
  }
  const [autoQuestion, setAutoQuestion] = useState<IQuestionStore[]>([INIT_AUTO_QUESTION]);
  const [listQuestion, setListQuestion] = useState<IListQuestion[]>([]);
  const [listQuestionSelect, setListQuestionSelect] = useState<{ title: string; _id: string } | null>(null);
  const [listDetailQuestion, setListDetailQuestion] = useState<IListDetailQuestion[]>([]);
  const [courseList, setCourseList] = useState<ICourse[]>([])
  const [questionStoreList, setQuestionStoreList] = useState<IQuestionStoreList[]>([{
    title: "",
    _id: ""
  }])
  const isLoading = false
  const [totalLevel, setTotalLevel] = useState<ITotalLevel>({
    easy: "",
    middle: "",
    hard: ""
  })
  const [courseId, setCourseId] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [timeStart, setTimeStart] = useState<TimeState>({
    days: new Date().getDate(),
    months: new Date().getMonth() + 1,
    years: new Date().getFullYear(),
    hours: new Date().getHours(),
    minutes: new Date().getMinutes()
  })
  const [timeEnd, setTimeEnd] = useState<TimeState | null>(null)
  const [maxScore, setMaxScore] = useState<number>(10);
  const [title, setTitle] = useState<string>("");

  console.log("listDetailQuestion ", listDetailQuestion)

  const totalSelectLevelEasy = autoQuestion.filter(x => x.select_level_easy!)
    .reduce((acc, curr: IQuestionStore) => acc + (curr.select_level_easy || 0), 0)
  const totalSelectLevelMiddle = autoQuestion.filter(x => x.select_level_middle!)
    .reduce((acc, curr: IQuestionStore) => acc + (curr.select_level_middle || 0), 0)
  const totalSelectLevelHard = autoQuestion.filter(x => x.select_level_hard!)
    .reduce((acc, curr: IQuestionStore) => acc + (curr.select_level_hard || 0), 0)

  const totalListQuestionEasy = listQuestion.filter(x => x.level === "easy").length
  const totalListQuestionMiddle = listQuestion.filter(x => x.level === "middle").length
  const totalListQuestionHard = listQuestion.filter(x => x.level === "hard").length


  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };


  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };


  function handleChangeTab(event: SyntheticEvent, value: string) {
    setActiveTab(value)
    setAutoQuestion([INIT_AUTO_QUESTION])
    setListQuestion([])
  }


  function handleChangeTotalLevel(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, level: "easy" | "middle" | "hard") {
    const value = Number(event.target.value)

    if (value >= 0 && value < 1000) {
      setTotalLevel(prev => ({ ...prev, [level]: value }))
    }
  }


  async function fetchLevelQuestionStore(id: string) {
    const res = await AxiosInstance.get(`${teacherConfig.getLevelQuestionStore}/${id}`)
    const result = res.data.response.res

    return result
  }


  async function fetchDetailQuestionStore(id: string) {
    const res = await AxiosInstance.get(`${teacherConfig.getDetailQuestionStore}/${id}`)
    const result = res.data.response.res.dataQuestion

    return result
  }


  async function handleChangeListQuestion(newValue: { title: string; _id: string } | null) {
    setCurrentPage(0);
    let dataQuestion: IListDetailQuestion[] = []
    if (newValue) {
      setListQuestionSelect(newValue)
      dataQuestion = await fetchDetailQuestionStore(newValue?._id)

      setListDetailQuestion(dataQuestion.map((x) => ({ ...x, isChecked: false })))

    } else {
      setListQuestionSelect(null)
      setListDetailQuestion([])
    }
  }


  function isTimeEndLessThanTimeStart(): boolean {
    if (timeStart && timeEnd) {

      return createDate(timeStart).getTime() < createDate(timeEnd).getTime()
    }

    return false
  }


  function checkMinTotalLevel(): boolean {

    return Number(totalLevel.easy) > 0 || Number(totalLevel.middle) > 0 || Number(totalLevel.hard) > 0
  }

  function settingsQuizValid(): boolean {
    const data = {
      teacher_id: JSON.parse(localStorage.getItem("userData")!)._id,
      title: title || null,
      course_id: courseId || null,
      total_question_hard: totalLevel.hard === "" ? null : totalLevel.hard,
      total_question_middle: totalLevel.middle === "" ? null : totalLevel.middle,
      total_question_easy: totalLevel.easy === "" ? null : totalLevel.easy,
      total_time: timeLimit,
      max_score: maxScore,
      time_begin: createDate(timeStart).toISOString(),
      time_end: timeEnd ? createDate(timeEnd).toISOString() : null,
    }

    return !allPropertiesExist(data) || !isTimeEndLessThanTimeStart() || !checkMinTotalLevel()
  }


  async function handleChangeAutoQuestion(newValue: { title: string; _id: string } | null, index: number) {
    let _id = "";
    let title = "";
    let levelEasy = [];
    let levelMiddle = [];
    let levelHard = [];

    if (newValue) {
      _id = newValue._id
      title = newValue.title
    }
    if (_id) {
      const levels = await fetchLevelQuestionStore(_id);
      levelEasy = levels.levelEasy;
      levelMiddle = levels.levelMiddle;
      levelHard = levels.levelHard;
    }

    const newData = {
      title,
      _id,
      total_level_easy: levelEasy,
      total_level_middle: levelMiddle,
      total_level_hard: levelHard,
      select_level_hard: 0,
      select_level_middle: 0,
      select_level_easy: 0
    }

    setAutoQuestion(prev => {
      const updatedList = [...prev]

      if (newValue !== null) {
        updatedList[index] = newData;
      } else {
        updatedList[index] = INIT_AUTO_QUESTION;
      }

      const isEmptyIdExist = updatedList.some(x => x._id === "");
      if (!isEmptyIdExist) {
        updatedList.push(INIT_AUTO_QUESTION);
      }

      return removeDuplicates(updatedList)
    }
    )
  }


  function handleCheckQuestionList(question: IListQuestion, index: number, currentChecked: boolean) {
    setListDetailQuestion(prev => (prev.map((x, i) => ({
      ...x,
      isChecked: index === i ? !currentChecked : x.isChecked
    }))))
    setListQuestion(prev => prev.some(x => x._id === question._id) ? prev.filter(item => item._id !== question._id) : [...prev, {
      _id: question._id,
      level: question.level
    }]);
  }


  function handleChangeMaxScore(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const currentMaxScore = Number(event.target.value)
    if (currentMaxScore < 1000) {
      setMaxScore(currentMaxScore)
    }
  }


  function handleCourseChange(event: SelectChangeEvent<unknown>) {
    setCourseId(event.target.value as string)
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

  useEffect(() => {
    const fetchQuizStore = async () => {
      const res = await AxiosInstance.get(`${teacherConfig.getAllCourse}`)
      const result: ICourse[] = res.data

      setCourseList(result)
    }

    const fetchQuestionStore = async () => {
      const res = await AxiosInstance.get(`${teacherConfig.getAllQuizQuestionStore}`)
      const result: IQuestionStoreList[] = res.data.res

      setQuestionStoreList(prev => [...prev, ...result.map(x => ({ title: x.title, _id: x._id }))])
    }

    fetchQuizStore()
    fetchQuestionStore()
  }, []);


  function isQuestionSelectValid(): boolean {
    function isAutoQuestionSelectValid(): boolean {
      return totalSelectLevelEasy === totalLevel.easy &&
        totalSelectLevelMiddle === totalLevel.middle &&
        totalSelectLevelHard === totalLevel.hard
    }

    function isListQuestionSelectValid(): boolean {
      return totalListQuestionEasy === totalLevel.easy &&
        totalListQuestionMiddle === totalLevel.middle &&
        totalListQuestionHard === totalLevel.hard
    }

    if (activeTab === "1") {
      return isAutoQuestionSelectValid() && checkMinTotalLevel()
    } else if (activeTab === "2") {
      return isListQuestionSelectValid() && checkMinTotalLevel()
    }

    return false
  }


  async function handleSubmit() {
    if (isQuestionSelectValid()) {
      const autoQuestionUpdated = autoQuestion.filter(x => x._id !== "").map(x => ({
        quiz_question_store_id: x._id,
        total_level_hard: x.select_level_hard,
        total_level_middle: x.select_level_middle,
        total_level_easy: x.select_level_easy
      }))

      const data = {
        teacher_id: JSON.parse(localStorage.getItem("userData")!)._id,
        title,
        course_id: courseId,
        total_question_hard: totalLevel.hard,
        total_question_middle: totalLevel.middle,
        total_question_easy: totalLevel.easy,
        total_time: timeLimit,
        max_score: maxScore,
        time_begin: createDate(timeStart).toISOString(),
        time_end: timeEnd ? createDate(timeEnd).toISOString() : null,
        auto_questions: autoQuestion.length > 1 ? autoQuestionUpdated : undefined,
        list_questions: listQuestion.length > 0 ? listQuestion.map(x => x._id) : null,
      }
      handleCloseModal()
      try {
        const res = await AxiosInstance.post("https://e-learming-be.onrender.com/quiz/post", data)
        console.log(res)
        toast.success("Create Successfully!")
      } catch (error: unknown) {
        handleAxiosError(error)
      }
    }
  }


  function handleChangeSelectLevel(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, question: IQuestionStore, field: 'easy' | 'middle' | 'hard') {
    setAutoQuestion(prev => prev.map(element => ({
      ...element,
      [`select_level_${field}`]: (question._id === element._id && Number(event.target.value) <= Number(question[`total_level_${field}` as keyof IQuestionStore]))
        ? Number(event.target.value) :
        element[`select_level_${field}` as keyof IQuestionStore]
    } as IQuestionStore)))
  }


  const renderLevelAmount = (LevelLabel: string, totalLevelSelect: number, totalLevelSetting: number): JSX.Element => {

    return <Box>{LevelLabel}:{" "}
      <Typography variant="caption" color={checkSelectValidQuestion(totalLevelSelect, (totalLevelSetting) || 0)} sx={{
        fontSize: 15
      }}>
        {totalLevelSelect}
      </Typography>
      {" / "}
      <Typography variant="caption" sx={{ color: "text.primary", fontSize: 15 }}>
        {totalLevelSetting || 0}
      </Typography>
    </Box>
  }


  const renderLevelSelect = (level: "easy" | "middle" | "hard",
    LevelLabel: string,
    question: IQuestionStore): JSX.Element => {

    return <Stack spacing={2} direction="row" alignItems="center">
      <Typography>{LevelLabel}</Typography>
      <TextField
        sx={{
          width: '54px',
          padding: '8px 0px',
          textAlign: 'center',
        }}
        onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChangeSelectLevel(event, question, level)}
        value={question[`select_level_${level}` as keyof IQuestionStore] || 0}
        variant="outlined"
      />
      <Divider orientation="vertical" variant="middle" flexItem />
      <TextField
        sx={{
          width: '54px',
          padding: '8px 0px',
          textAlign: 'center',
        }}
        value={question[`total_level_${level}` as keyof IQuestionStore] || 0}
        variant="outlined"
      />
    </Stack>
  }

  const { t } = useTranslation()

  return (
    <>
      <Card>
        <CardHeader sx={{ mb: 8 }} title={t('Create Quiz')} />
        <CardContent>
          <Grid container sx={{ alignItems: "center" }} spacing={4}>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('Title')}
              </Grid>
              <Grid item xs={9.5}>
                <CustomTextField onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  const value = event.target.value as string
                  setTitle(value)

                }} fullWidth placeholder={t('Enter Title') ?? ''} />
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
                    value: courseId || "",
                    displayEmpty: true,
                    onChange: event => handleCourseChange(event)
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
                  defaultValue={dayjs()}
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
                    value={timeLimit}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                      const currentValue = Number(event.target.value)
                      if (currentValue > -1 && currentValue < 1000 && !/^00.*$/.test(currentValue.toString())) {
                        setTimeLimit(Number(event.target.value))
                      }
                    }}
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
                  value={maxScore}
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
                  value={totalLevel.easy}
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
                  value={totalLevel.middle}
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
                  value={totalLevel.hard}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <Modal onClose={handleCloseModal} open={openModal}>
          <Box sx={{
            outline: "none",
            backgroundColor: "customColors.darkPaperBg",
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
              <CardHeader sx={{ mt: 8, mb: 4 }} title={t('Select Quiz Question Store')} />
              <TabContext value={activeTab || "1"}>
                <Box sx={{ pl: "1.5rem" }}>
                  <TabListStyled onChange={handleChangeTab}>
                    <Tab label={t("Automatic Mode")} value="1" />
                    <Tab label={t("Manual Mode")} value="2" />
                  </TabListStyled>
                </Box>
                <TabPanel value="1">
                  <CardContent sx={{ pl: 0, pr: "1.5rem" }}>
                    <Stack sx={{ mb: 10 }} direction="row" spacing={4}>
                      {renderLevelAmount(t("Total Question Easy"), totalSelectLevelEasy, Number(totalLevel.easy))}
                      {renderLevelAmount(t("Total Question Normal"), totalSelectLevelMiddle, Number(totalLevel.middle))}
                      {renderLevelAmount(t("Total Question Hard"), totalSelectLevelHard, Number(totalLevel.hard))}
                    </Stack>
                    <Grid container sx={{ alignItems: "center" }} spacing={4}>
                      {autoQuestion.map((x, i) => {
                        const init_value = {
                          title: x.title,
                          _id: x._id,
                        }

                        return (
                          <Grid key={i} container item sx={{ alignItems: "center" }} spacing={6}>
                            <Grid item xs={2.5}>
                              <Autocomplete
                                value={init_value}
                                disableClearable={x._id === ""}
                                onChange={(_event, newValue) => handleChangeAutoQuestion(newValue, i)}
                                options={questionStoreList}
                                isOptionEqualToValue={(option, newValue) => option._id === newValue._id}
                                getOptionLabel={option => option.title || ''}
                                getOptionDisabled={option => !!autoQuestion.find(element => element._id === option._id)}
                                renderOption={(props, option) => option.title !== "" ? (<Box component="li" {...props} key={option._id}>
                                  {option.title}
                                </Box>) : null
                                }
                                sx={{ width: 250 }}

                                renderInput={params => <TextField {...params} label={t('Select Quiz Question Store')} />}
                              />
                            </Grid>
                            <Grid item xs={9.5}>
                              <Grid container spacing={6} justifyContent={"flex-end"}>
                                <Grid item>
                                  {renderLevelSelect("easy", t("Total Question Easy"), x)}
                                </Grid>
                                <Grid item>
                                  {renderLevelSelect("middle", t("Total Question Normal"), x)}
                                </Grid>
                                <Grid item>
                                  {renderLevelSelect("hard", t("Total Question Hard"), x)}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </CardContent>
                </TabPanel>
                <TabPanel value="2">
                  <CardContent sx={{ px: "1rem" }}>
                    <Grid container sx={{ alignItems: "center" }} spacing={4}>
                      <Stack sx={{ width: "100%" }} spacing={4}>
                        <Stack direction="row" spacing={4} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                          <Autocomplete
                            value={listQuestionSelect}
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
                          <Stack sx={{ mb: 10 }} direction="row" spacing={4}>
                            {renderLevelAmount("Total Question Easy", totalListQuestionEasy, Number(totalLevel.easy))}
                            {renderLevelAmount("Total Question Normal", totalListQuestionMiddle, Number(totalLevel.middle))}
                            {renderLevelAmount("Total Question Hard", totalListQuestionHard, Number(totalLevel.hard))}
                          </Stack>
                        </Stack>
                        {listDetailQuestion.length ? <Box>
                          <TableContainer sx={{ height: 338.5 }} component={Paper}>
                            <Table sx={{ minWidth: 650 }}>
                              <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                                <TableRow>
                                  <TableCell>{t('No')}</TableCell>
                                  <TableCell>{t('Question')}</TableCell>
                                  <TableCell>{t('Level')}</TableCell>
                                  <TableCell align="right">{t('Total Question')} </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {listDetailQuestion.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((row, index: number) => (
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
                                    <TableCell align="right">
                                      <>
                                        <Checkbox disabled={isLoading}
                                          checked={listQuestion.some(x => x._id === row._id)}
                                          onClick={() => handleCheckQuestionList(row, index, row.isChecked || false)} />
                                        {listQuestion.some(x => x._id === row._id) ?
                                          t("Selected") :
                                          t("Select")}
                                      </>
                                    </TableCell>
                                  </TableRow>
                                ))}
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
                        </Box> :
                          <>
                            <Box sx={{ textAlign: 'center', padding: 5 }}>
                              {t('No rows')}
                            </Box>
                          </>}
                      </Stack>
                    </Grid>
                  </CardContent>
                </TabPanel>
              </TabContext>
              <Grid container item sx={{ px: "1.5rem", alignItems: "center", justifyContent: "flex-end", pb: "1.5rem" }}>
                <Box sx={{ mt: "0rem", textAlign: "right" }}>
                  <Button onClick={handleSubmit} disabled={!isQuestionSelectValid()} variant='contained'>{isLoading ? t("Loading...") : t("Create")}</Button>
                </Box>
              </Grid>
            </Box>
          </Box>
        </Modal>
        <Grid container item sx={{ px: "1.5rem", pb: "2rem", alignItems: "center", justifyContent: "flex-start", mt: "3rem" }}>
          <Box sx={{ mt: "0rem", textAlign: "right" }}>
            {/* <Button disabled={settingsQuizValid()} onClick={handleOpenModal} variant='contained'>Thiết lập ngân hàng đề</Button> */}
            <Button onClick={handleOpenModal} disabled={settingsQuizValid()} variant='contained'>{t('Set Up Quiz Question Store')}</Button>
          </Box>
        </Grid>
      </Card>
    </>
  )
}

CreateQuizPage.acl = {
  action: 'read',
  subject: 'teacher-page'
}