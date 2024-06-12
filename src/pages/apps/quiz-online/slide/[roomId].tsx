// ** Nextjs Component
import Image from "next/image";

// ** React Imports
import { Fragment, ReactNode, useEffect, useState } from 'react';

// ** Socket
import { socket } from 'src/socket';

// ** MUI
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material/';
import { useTheme } from '@mui/material/styles';

// ** Icon Imports
import { useRouter } from "next/router";
import Icon from 'src/@core/components/icon';
import BlankLayout from "src/@core/layouts/BlankLayout";
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
import toast from "react-hot-toast";

interface ICurrentListQuestion {
  question: string;
  answers: string[];
}

interface IQuizState {
  questions: ICurrentListQuestion | null;
  timeLeft: number | null;
}
interface IAnswerCorrect {
  correctAnswerIndex: number | null
}

interface IScoreboard {
  personalScore: number | null
  top5: { name: string; score: number }[]
}
const QuizOnlineSlidePage = () => {
  const router = useRouter()
  const theme = useTheme()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [answerCorrect, setAnswerCorrect] = useState<IAnswerCorrect>({ correctAnswerIndex: null })
  const [questionLength, setQuestionLength] = useState<number>(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [timeUpdate, setTimeUpdate] = useState<number>(0)
  const [quizState, setQuizState] = useState<IQuizState>({
    questions: null,
    timeLeft: null
  })
  const [scoreboard, setScoreboard] = useState<IScoreboard>({
    personalScore: null,
    top5: []
  })

  const [errors, setErrors] = useState<{ [key: string]: string | null; }>({
    hostRoom: null,
    startQuiz: null,
    quiz: null,
    answer: null
  })

  function getButtonStyle(index = 3, opacity: number): { icon: JSX.Element, backgroundColor: string, name: typeof nameColors[number] } {
    const nameColors = ['error', 'info', 'warning', 'success'] as const
    const iconNames = ["mdi:triangle", 'mdi:rhombus', 'material-symbols:circle', 'material-symbols:square'] as const

    const buttonStyles = {
      name: nameColors[index],
      icon: <Icon icon={iconNames[index]} />,
      backgroundColor: hexToRGBA(theme.palette[nameColors[index]].main, opacity)
    }

    return buttonStyles
  }


  function renderEndIcon(index: number): JSX.Element {
    const styles = { height: 25, width: 25 }
    const icons = [
      <Icon key="tick" icon='subway:tick' style={styles} />,
      <Icon key="close" icon='iconamoon:close-bold' style={styles} />
    ]
    const correctIndex = answerCorrect.correctAnswerIndex;
    if (correctIndex !== null && correctIndex < 4 && correctIndex === index) {
      return icons[0]; // Tick icon
    } else if (correctIndex !== null && correctIndex < 4 && correctIndex !== index) {
      return icons[1]; // Close icon
    } else return <Fragment />;
  }

  useEffect(() => {
    socket.connect();

    socket.on("quizStarted", (questionLength) => {
      setQuestionLength(questionLength)
    })

    socket.on("quizEnd", ({ personalScore, top5 }) => {
      setScoreboard({ personalScore, top5 });
    })

    socket.on("newQuestion", ({ questions, timeLeft }) => {
      setTimeUpdate(timeLeft)
      setAnswerCorrect(({ correctAnswerIndex: null }))
      setQuizState({ questions, timeLeft });
      setCurrentQuestionIndex(prev => prev + 1)
    })

    socket.on("timeUp", ({ correctAnswerIndex }) => {
      setAnswerCorrect({ correctAnswerIndex });
    })

    socket.on("countdown", (countdown) => {
      setCountdown(countdown);
    })

    socket.on("timeUpdate", (timeLeft) => {
      setTimeUpdate(timeLeft);
    })

    // Error
    socket.on("hostRoomError", (error) => {
      setErrors(prev => ({ ...prev, hostRoom: error }));
    })

    socket.on("startQuizError", (error) => {
      setErrors(prev => ({ ...prev, startQuiz: error }));
    })

    socket.on("quizError", (error) => {
      setErrors(prev => ({ ...prev, quiz: error }));
    })

    socket.on("answerError", (error) => {
      setErrors(prev => ({ ...prev, answer: error }));
    })

    // StartQuiz
    socket.emit("startQuiz", router.query.roomId);

    return () => {
      // socket.off('roomCreated');
      // socket.off('joinedRoom');
      // socket.off('receiveClient');
      // socket.off('quizStarted');
      // socket.off('quizEnd');
      // socket.off('timeUp');
      // socket.off('countdown');
      // socket.off('timeUpdate');
      // socket.off('newQuestion');

      // socket.off('hostRoomError');
      // socket.off('startQuizError');
      // socket.off('quizError');
      // socket.off('answerError');

      // socket.close();
    };

  }, [])


  // const calculator = Math.floor(countCurrentAnswers * 4 / totalAnswers) + 1


  function renderCountdown() {
    if (countdown! > 0) {
      return <Box sx={{ fontSize: 24, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%" }}>{countdown}</Box>
    }

    return <></>
  }

  function renderQuizSlide() {
    if (countdown === 0 && scoreboard.top5.length === 0) {
      return <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Card sx={{ borderRadius: 0 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4">{quizState?.questions?.question}</Typography>
          </CardContent>
        </Card>
        <Box sx={{ px: "0.5rem", display: "flex", justifyContent: "space-between", py: "1rem" }}>
          <Box sx={{ my: "auto" }}>
            <Avatar sx={{ fontWeight: "bold", fontSize: 20, width: "66px", height: "66px" }}>
              {timeUpdate}
            </Avatar>
          </Box>
          <Box>
            {true && <Image src="https:kahoot.com/files/2022/03/KKids_skills-02-2-1.png" alt="Question image" width={440} height={280} style={{ borderRadius: "1rem" }} />}
            {false && <Stack sx={{ height: 280 }} direction="row" spacing={4}>
              {[1, 2, 3, 4].map((x, i) => {
                const { name, backgroundColor, icon } = getButtonStyle(i, 1)

                return (
                  <Stack
                    key={i}
                    spacing={0.75}>
                    <Typography sx={{ color: theme.palette[name].main, textAlign: "center", fontWeight: 'bold' }}
                      variant="h2">
                      9
                    </Typography>
                    <Box sx={{ width: 160, height: 90 / 2, backgroundColor }}></Box>
                    <Button
                      disableRipple
                      color={name}
                      variant="contained"
                      sx={{
                        '&': {
                          borderRadius: 0
                        },
                        '&:hover': {
                          backgroundColor
                        },
                        '&:active': {
                          transform: 'scale(1) !important',
                        },
                      }}>{icon}</Button>
                  </Stack>
                )
              })}
            </Stack>}
          </Box>
          {false && <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button variant="contained">Skip</Button>
            <Box sx={{ textAlign: "center", my: "auto" }}>
              <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>0</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>Answers</Typography>
            </Box>
          </Box>}
          <Box></Box>
        </Box>
        <Box sx={{ mt: "auto" }}>
          <Box sx={{ px: "0.5rem", width: "100%" }}>
            <Grid container spacing={2}>
              {quizState?.questions?.answers?.map((answer, index) => {

                const correctIndex = answerCorrect.correctAnswerIndex;
                const opacity = index === correctIndex ? 1 : 0.4
                const { icon, backgroundColor } = getButtonStyle(index, correctIndex === null ? 1 : opacity)

                return <Grid key={index} item xs={6} >
                  <Button
                    disableRipple
                    variant="contained"
                    startIcon={icon}
                    endIcon={renderEndIcon(index)}
                    sx={{
                      '&': {
                        color: hexToRGBA(theme.palette.common.white, correctIndex === null ? 1 : opacity),
                        backgroundColor,
                        fontSize: 20,
                        borderRadius: "0.25rem",
                        p: "1.5rem",
                        justifyContent: "flex-start",
                        width: "100%"
                      },
                      '&:hover': {
                        backgroundColor
                      },
                      '&:active': {
                        transform: 'scale(1) !important',
                      },
                      '& .MuiButton-endIcon': {
                        marginLeft: "auto"
                      }
                    }}>{answer}</Button>
                </Grid>
              })}
            </Grid>
          </Box>
          <Card sx={{ mt: 2, borderRadius: 0 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>{currentQuestionIndex}/{questionLength}</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Typography sx={{ fontSize: 16 }}>Game PIN:</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>8886660</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

      </Box>
    }

    return <></>
  }

  function renderTableScoreBoard() {
    if (scoreboard.top5.length > 0) {
      return <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
        <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>RANK</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>SCORE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                // '& tr:nth-child(even)': { backgroundColor: "text.secondary.dark" },
              }}>
              {scoreboard.top5.length > 0 && scoreboard.top5.map((x, i) => (
                <TableRow
                  key={i}
                  sx={{
                    // '&:last-child td, &:last-child th': { border: 0 },
                    // '&:nth-child(even)': { color: 'red !important' }
                  }}>
                  <TableCell>
                    {i + 1}
                  </TableCell>
                  <TableCell>{x.name}</TableCell>
                  <TableCell>{x.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    }

    return <></>

  }

  useEffect(() => {
    const error = errors.hostRoom || errors.startQuiz || errors.quiz || errors.answer;

    if (error) {
      router.back();
      toast.error(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);


  return (
    <>
      {renderCountdown()}
      {renderQuizSlide()}
      {renderTableScoreBoard()}
    </>
  )
}

QuizOnlineSlidePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>


export default QuizOnlineSlidePage

QuizOnlineSlidePage.acl = {
  action: 'read',
  subject: 'teacher-page'
}