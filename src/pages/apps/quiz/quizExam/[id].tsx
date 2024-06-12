// ** React Imports
import { ChangeEvent, useEffect, useState } from "react";

// ** MUI Imports
import {
    Box,
    Card,
    CardContent,
    Grid,
    Paper,
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

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// ** Custom Component Imports
import CustomTextField from "src/@core/components/mui/text-field";
import TableHeaderQuizExamDetail from 'src/views/apps/courses/list/TableHeaderBreadcrumb';

// ** Config
import dayjs from "dayjs";
import AxiosInstance from "src/configs/axios";
import adminPathName from 'src/configs/endpoints/admin';

// ** Utils
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { QuizExamDetail } from "src/context/types";
import toast from "react-hot-toast";

export default function DetailQuizExam() {
    const router = useRouter();
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [quizExamDetail, setQuizExamDetail] = useState<QuizExamDetail>();
    const [studentName, setStudentName] = useState<any>();

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const [quizExamDetailResponse, studentNameResponse] = await Promise.all([
                    AxiosInstance.post(adminPathName.getDetailQuizExamEndpoint, {
                        student_id: router.query.studentId,
                        quiz_id: router.query.id
                    }),
                    AxiosInstance.post(adminPathName.getIdQuizScoreEndpoint, { quiz_id: router.query.id })
                ]);
                const quizExamData: QuizExamDetail = quizExamDetailResponse.data.res;
                const studentNameData = studentNameResponse.data;
                setQuizExamDetail(quizExamData);
                setStudentName(studentNameData.filter((x: any) => x.id === router.query.studentId).map((x: any) => ({
                    name: x.name,
                    total_score_all_questions: x.dataScore.total_score_all_questions
                }))[0]);
            } catch (error: any) {
                if (error && error.response) {
                    toast.error(error.response.data.message);
                }
            }
        }
        fetchData();
    }, [router.query.studentId, router.query.id]);

    return (
        <>
            <Card>
                <TableHeaderQuizExamDetail />
                <CardContent>
                    <Grid container sx={{ alignItems: "center" }} spacing={4}>
                        <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                            <Grid item xs={2.5}>
                                {t('Name')}
                            </Grid>
                            <Grid item xs={9.5}>
                                <CustomTextField value={studentName?.name || ""} disabled fullWidth placeholder='' />
                            </Grid>
                        </Grid>
                        <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                            <Grid item xs={2.5}>
                                {t('Start Date')}
                            </Grid>
                            <Grid item xs={9.5}>
                                <DateTimePicker
                                    value={dayjs(quizExamDetail?.createdAt)}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                            <Grid item xs={2.5}>
                                {t('End Date')}
                            </Grid>
                            <Grid item xs={9.5}>
                                <DateTimePicker
                                    value={dayjs(quizExamDetail?.updatedAt)}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                            <Grid item xs={2.5}>
                                {t('Total Question')}
                            </Grid>
                            <Grid item xs={9.5}>
                                <TextField
                                    disabled
                                    sx={{
                                        width: '56px',
                                        padding: '8px 0px',
                                        textAlign: 'center',
                                    }}
                                    value={studentName?.total_score_all_questions || ""}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                        <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                            <Grid item xs={2.5}>
                                {t('Total Score')}
                            </Grid>
                            <Grid item xs={9.5}>
                                <TextField
                                    disabled
                                    sx={{
                                        width: '56px',
                                        padding: '8px 0px',
                                        textAlign: 'center',
                                    }}
                                    value={quizExamDetail?.total_score || ""}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
                <Grid container item sx={{ mt: "1.5rem" }}>
                    {quizExamDetail?.answers.length ? (
                        <Box sx={{ width: "100%" }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: 15, width: '5%', textAlign: 'center' }}>
                                                {t('STT')}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 15 }}>
                                                {t("Answer Selected")}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 15 }}>
                                                {t("Correct Answer")}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                                {t("Score")}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {quizExamDetail?.answers.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((row, index) => {
                                            const correctAnswer = row.question.answer.find(x => x.score === 1)?.content || "";
                                            let contentAnswerSelect = "Not Select";
                                            let answerScore = 0;

                                            if (typeof row.answer_select === "number") {
                                                contentAnswerSelect = row.question.answer[row.answer_select].content;
                                                answerScore = row.question.answer[row.answer_select].score;
                                            }

                                            return (
                                                <TableRow key={row.question._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                                                        <Typography>
                                                            {index + 1}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ fontSize: 15 }} dangerouslySetInnerHTML={{ __html: contentAnswerSelect }} />
                                                    </TableCell>
                                                    <TableCell sx={{ "& img": { height: "100px !important", width: "100px !important" } }}>
                                                        <Box sx={{ fontSize: 15 }} dangerouslySetInnerHTML={{ __html: correctAnswer }} />
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        <Typography>
                                                            {answerScore}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[1, rowsPerPage, quizExamDetail?.answers.length]}
                                component="div"
                                count={quizExamDetail?.answers.length || 0}
                                rowsPerPage={rowsPerPage}
                                page={currentPage}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Box>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table aria-label="custom pagination table">
                                <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                                    <TableRow>
                                        <TableCell sx={{ width: '5%', textAlign: 'center' }}>
                                            {t('STT')}
                                        </TableCell>
                                        <TableCell>
                                            {t("Answer Selected")}
                                        </TableCell>
                                        <TableCell>
                                            {t("Correct Answer")}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {t("Score")}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                            <Box sx={{ textAlign: 'center', padding: 5 }}>
                                <Typography>
                                    <>
                                        {t('No rows')}
                                    </>
                                </Typography>
                            </Box>
                        </TableContainer>
                    )}
                </Grid>
            </Card>
        </>
    );
}

DetailQuizExam.acl = {
    action: 'read',
    subject: 'teacher-page'
};
