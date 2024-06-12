// ** React Imports
import { ChangeEvent, useEffect, useState } from "react";

// ** Socket
import { socket } from 'src/socket';


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
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material";


// ** Custom Component Imports
import CustomTextField from "src/@core/components/mui/text-field";

// ** Config
import teacherConfig from "src/configs/endpoints/teacher";

// ** Next
import { useRouter } from "next/router"


// ** Styled Component
import AxiosInstance from "src/configs/axios";

// ** Utils
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import { handleAxiosError } from "src/utils/errorHandler";
import { allPropertiesExist } from "src/utils/validationUtils";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { generateRandom } from "src/utils/math";

interface IQuestionStoreList {
  _id: string;
  title: string;
  owner: string;
  is_share: boolean;
  createAt: string;
}

interface IAnswer {
  content: string;
  is_correct: boolean;
  score?: number
}



interface IQuizQuestionStore {
  _id: string;
  quiz_store_id: string;
  level: "easy" | "middle" | "hard";
  question: string;
  createAt: Date;
  isChecked?: boolean;
}

interface IQuestionStoreList {
  title: string,
  _id: string
}


interface IListDetailQuestion {
  _id: string;
  title?: string,
  quiz_store_id: string;
  question: string;
  level: "easy" | "middle" | "hard"; // Adjust as needed
  answers: IAnswer[];
}

interface IQuestion {
  _id: string;
  title: string;
  owner: string;
  is_share: boolean;
  createAt: string;
}

export default function CreateQuizOnlinePage() {
  const router = useRouter()
  const [roomId, setRoomId] = useState<string>("")
  const [title, setTitle] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(4);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [listDetailQuestion, setListDetailQuestion] = useState<IListDetailQuestion[]>([]);
  const [timePerquestion, setTimePerquestion] = useState<number | null>(null);
  const [listDetailQuestionStore, setListDetailQuestionStore] = useState<IQuizQuestionStore[]>([]);
  const [questionStoreList, setQuestionStoreList] = useState<IQuestionStoreList[]>([])
  const isLoading = false
  const [listQuestionSelect, setListQuestionSelect] = useState<IQuestion | null>(null)
  const { t } = useTranslation()

  function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };


  async function handleCheckQuestionList(id: string) {
    const quizQuestionDetailData = await fetchQuizQuestionDetail(id)
    const { answer: answers, question, _id, quiz_store_id, level } = quizQuestionDetailData // add s to answer cause database

    setListDetailQuestion(prev => {
      const updatedList = [...prev];
      const index = updatedList.findIndex(x => x._id === id);

      if (index === -1) {
        updatedList.push({
          _id,
          quiz_store_id,
          question,
          level,
          answers
        });
      } else {
        updatedList.splice(index, 1);
      }

      return updatedList;
    });
  }


  function handleChangeTotalTime(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const currentValue = Number(event.target.value)
    if (currentValue > -1 && currentValue < 1000 && !/^00.*$/.test(currentValue.toString())) {
      setTimePerquestion(currentValue)
    }
  }


  function handleChangeTitle(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const value = event.target.value as string
    setTitle(value)
  }


  function handleChangePage(_event: any, newPage: number) {
    setCurrentPage(newPage);
  };


  async function fetchDetailQuestionStore(id: string) {
    const res = await AxiosInstance.get(`${teacherConfig.getDetailQuestionStore}/${id}`)
    const result = res.data.response.res.dataQuestion

    return result
  }


  async function handleChangeListQuestion(newValue: IQuestion | null) {
    setListQuestionSelect(newValue)
    let dataQuestion = []
    if (newValue) {
      dataQuestion = await fetchDetailQuestionStore(newValue?._id)
      setListDetailQuestionStore(dataQuestion.map((x: any) => ({ ...x, isChecked: false })))

    } else {
      setListQuestionSelect(null)
      setListDetailQuestionStore([])
    }
  }


  async function fetchQuizQuestionDetail(id: string) {
    const res = await AxiosInstance.get(`${teacherConfig.getDetailQuizEndpoint}/${id}`)
    const result = res.data

    return result

  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [questionRes] = await Promise.all([
          AxiosInstance.get(`${teacherConfig.getAllQuizQuestionStore}`),
        ]);
        const questionData: IQuestionStoreList[] = questionRes.data.res
        console.log("🚀 ~ fetchData ~ questionData:", questionData)

        setQuestionStoreList(prev => [...prev, ...questionData])
      } catch (error) {
        console.log(error)
      }

    }
    fetchData()
  }, []);


  useEffect(() => {
    if (roomId) {
      router.push(`/apps/quiz-online/waitingRoom/${roomId}`)
    }
  }, [socket, roomId, socket.connected])

  async function hostRoom(roomId: string, quizId: string) {
    socket.connect()
    socket.on("connect", () => {
      console.log("connect ", socket.id);
    })
    socket.emit("hostRoom", {
      roomId,
      quizId
    })

  }

  function settingsQuizOnlineValid(): boolean {
    const data = {
      teacherId: JSON.parse(localStorage.getItem("userData")!)._id,
      time_per_question: timePerquestion,
      questions: listDetailQuestion.length < 1 ? null : listDetailQuestion
    }

    return allPropertiesExist(data)
  }


  async function handleSubmit() {
    const renameFieldListQuestion = listDetailQuestion.map(x => ({
      ...x,
      answers: x.answers.map(y => {
        const updatedAnswer = {
          ...y,
          is_correct: Boolean(y.score),
        }
        delete updatedAnswer.score;

        return updatedAnswer
      })
    }));

    const data = {
      teacherId: JSON.parse(localStorage.getItem("userData")!)._id,
      time_per_question: timePerquestion,
      questions: renameFieldListQuestion,
      title
    }
    const res = await AxiosInstance.post("https://e-learming-be.onrender.com/quiz-online/post", data)
    const quizId = res.data._id
    toast.success("Tạo đề thành công")
    const randomRoomId = generateRandom(3)
    setRoomId(randomRoomId)
    hostRoom(randomRoomId, quizId)
    try {
    } catch (error) {
      handleAxiosError(error)
    }
  }

  return (
    <>
      <Card>
        <CardHeader sx={{ mb: 8 }} title={t('Create Quiz Online')} />
        <CardContent>
          <Grid container sx={{ alignItems: "center" }} spacing={4}>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('Title')}
              </Grid>
              <Grid item xs={9.5}>
                <CustomTextField sx={{ maxWidth: 400 }} value={title} onChange={handleChangeTitle} fullWidth placeholder={t('Enter Title') ?? ''} />
              </Grid>
            </Grid>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('Time Each Question')}
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
                    value={timePerquestion || ""}
                    onChange={handleChangeTotalTime}
                  />
                  <Typography sx={{ display: "flex" }} variant='body1'>{t('seconds')}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <Box sx={{ px: "1.5rem", mt: "1.5rem", border: "1px solid text.primary", justifyContent: "space-between", width: "100%" }}>
          <Button onClick={handleOpenModal} variant='contained'>{t('Add Question')}</Button>
        </Box>
        <Grid container item sx={{ mt: "1.5rem" }}>
          <Box sx={{ px: "1.5rem", width: "100%" }}>
            <TableContainer component={Paper}>
              <Table sx={{
                "& img": {
                  height: "100px !important", width: "auto !important"
                }
              }}>
                <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                  <TableRow>
                    <TableCell>{t('No')}</TableCell>
                    <TableCell>{t('Question Store')}</TableCell>
                    <TableCell>{t('Question')}</TableCell>
                    <TableCell>{t('Level')}</TableCell>
                    <TableCell align='center'>{t('Operation')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listDetailQuestion.length ? listDetailQuestion.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((row, index) => {
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
                  }) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', padding: 5 }}>
                        {t('No rows')}
                      </TableCell>
                    </TableRow>
                  )}
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
          </Box>
        </Grid>
        <Box sx={{ px: "1.5rem", py: "2rem", textAlign: "left" }}>
          <Button onClick={handleSubmit} disabled={!settingsQuizOnlineValid()} variant='contained'>{isLoading ? t("Loading...") : t("Slideshow")}</Button>
        </Box>
      </Card>
      <Modal onClose={handleCloseModal} open={openModal}>
        <Box
          sx={{
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
            <CardHeader sx={{ px: 0, mt: 8, mb: 4 }} title={t('Select Quiz Question Store')} />
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
                  </Stack>
                  {listDetailQuestionStore.length ? (
                    <Box>
                      <TableContainer sx={{ height: 338.5 }} component={Paper}>
                        <Table sx={{
                          "& img": {
                            height: "100px !important", width: "auto !important"
                          }
                        }}>
                          <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                            <TableRow>
                              <TableCell>{t('No')}</TableCell>
                              <TableCell>{t('Question')}</TableCell>
                              <TableCell>{t('Level')}</TableCell>
                              <TableCell align="center">{t('Select Question')}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {listDetailQuestionStore.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((row, index: number) => (
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
                                      checked={listDetailQuestion.some(x => x._id === row._id)}
                                      onClick={() => handleCheckQuestionList(row._id)} />
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
                    </Box>
                  ) : (
                    <Typography sx={{ textAlign: 'center', padding: 5 }}>
                      {t('No rows')}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </CardContent>
          </Box>
          <Box sx={{ px: "1.5rem", py: "1rem", textAlign: "right" }}>
            <Button onClick={handleCloseModal} variant='contained'>{t('Save')}</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

CreateQuizOnlinePage.acl = {
  action: 'read',
  subject: 'teacher-page'
}