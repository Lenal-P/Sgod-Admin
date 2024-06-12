// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Typography from '@mui/material/Typography'

// ** Third Party Components
import AxiosInstance from 'src/configs/axios'

// ** Custom Table Components Imports
import adminPathName from 'src/configs/endpoints/admin';
import { useRouter } from 'next/router'
import { QuizAnswer, QuizOnlineData } from 'src/context/types'
import { TableHead } from '@mui/material'
import toast from 'react-hot-toast'
import TableHeaderDetail from 'src/views/apps/quizOnline/TableHeaderDetail';
import { socket } from 'src/socket';

export default function QuizOlineDetail() {
    const router = useRouter();
    const { t } = useTranslation();
    const [dataList, setDataList] = useState<QuizOnlineData[]>([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 });

    const fetchDataList = async () => {
        try {
            const response = await AxiosInstance.get(`${adminPathName.getDetailQuizOnlineEndpoint}/${router.query.id}`);
            setDataList(response.data.questions);
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    };

    useEffect(() => {
        socket.connect();
        fetchDataList();
    }, []);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPaginationModel((prev) => ({ ...prev, page: newPage }));
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setPaginationModel((prev) => ({ ...prev, pageSize: parseInt(event.target.value, 10), page: 0 }));
    };

    const getCorrectAnswerLabel = (answers: QuizAnswer[]) => {
        const labels = ['A', 'B', 'C', 'D'];
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].is_correct) {
                return `${labels[i]}. ${answers[i].content}`;
            }
        }

        return '';
    };

    return (
        <>
            {dataList && dataList.length ? (
                <Paper>
                    <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                        <TableHeaderDetail quizId={router.query.id as string} />
                        <Table sx={{
                            "& img": {
                                height: "100px !important", width: "auto !important"
                            }
                        }} aria-label="custom pagination table">
                            <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                                <TableRow>
                                    <TableCell >
                                        {t('Question')}
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        {t('Level')}
                                    </TableCell>
                                    <TableCell >
                                        {t('Correct Answer')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {dataList.map((quiz: QuizOnlineData) => (
                                    <Fragment key={quiz._id}>
                                        <TableRow>
                                            <TableCell>
                                                {quiz && (
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                                                        <Typography
                                                            noWrap
                                                            sx={{
                                                                fontWeight: 500,
                                                                textDecoration: 'none',
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            <div dangerouslySetInnerHTML={{ __html: quiz.question }}></div>

                                                        </Typography>
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 15, textAlign: 'center' }}>
                                                {quiz.level}
                                            </TableCell>
                                            <TableCell>
                                                {quiz && (
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                                                        <Typography
                                                            noWrap
                                                            sx={{
                                                                fontWeight: 500,
                                                                textDecoration: 'none',
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: '100%',
                                                                    display: 'flex',
                                                                    flexDirection: 'row',
                                                                    gap: '8px',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }} dangerouslySetInnerHTML={{ __html: getCorrectAnswerLabel(quiz.answers) }}></div>

                                                        </Typography>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[{ label: 'All', value: -1 }]}
                        count={dataList.length || 1}
                        rowsPerPage={paginationModel.pageSize}
                        page={paginationModel.page}
                        component="div"
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            ) : (
                <Paper>
                    <TableContainer component={Paper}>
                        <TableHeaderDetail quizId={router.query.id as string} />
                        <Table aria-label="custom pagination table">
                            <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                                <TableRow>
                                    <TableCell style={{ width: '50%' }}>
                                        {t('Question')}
                                    </TableCell>
                                    <TableCell style={{ width: '20%', textAlign: 'center' }}>
                                        {t('Level')}
                                    </TableCell>
                                    <TableCell style={{ width: '30%', textAlign: 'center' }}>
                                        {t('Correct Answer')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                    <Box sx={{ textAlign: 'center', padding: 5 }}>
                        {t('No rows')}
                    </Box>
                </Paper>
            )}
        </>
    );
}

QuizOlineDetail.acl = {
    action: 'read',
    subject: 'teacher-page'
}