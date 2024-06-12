// ** React Imports
import { ChangeEvent, Fragment, SyntheticEvent, useEffect, useState } from "react";

// ** MUI Imports
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Card, CardContent, CircularProgress, Grid, IconButton, MenuItem, Paper, SelectChangeEvent, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// ** Custom Component Imports
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Imports
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { CSVLink } from 'react-csv';

// ** Styled Component Imports
import ReactDraftWysiwyg from "src/@core/components/react-draft-wysiwyg";
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';

// ** Dayjs
import { createDate } from "src/utils/dateTime";

// ** Config
import { useDispatch } from "react-redux";
import teacherConfig from "src/configs/endpoints/teacher";

// ** Styled Component
import dayjs from "dayjs";
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import AxiosInstance from "src/configs/axios";

// ** Utils
import { htmlToDraftBlocks } from "src/utils/draft";

// ** Next
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import adminPathName from 'src/configs/endpoints/admin';
import { EssayData } from "src/context/types";
import { ICourse } from "src/types/quiz/types";
import { TimeState } from "src/types/timeTypes";
import TableHeaderBreadcrumb from "src/views/apps/courses/list/TableHeaderBreadcrumb";
import ChartEssayScore from '../../courses/chart/ChartEssayScore';
import { updateData } from 'src/store/apps/breadcrumbs'



interface EssayExam {
  _id: string;
  teacher_id: string;
  course_id: string;
  total_time: number;
  time_start: string;
  time_end: string;
  max_score: number;
  title: string;
  content: string;
  files: string[];
  createAt: string;
}

export default function EssayDetail() {
  const toolbarOptions = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'emoji', 'remove', 'history'],
    inline: {
      inDropdown: false,
      options: ['bold', 'italic', 'underline']
    },
    list: {
      inDropdown: false,
      options: ['unordered', 'ordered']
    }
  }

  const [state, setState] = useState<EssayExam>({
    _id: "",
    teacher_id: "",
    course_id: "",
    total_time: 0,
    time_start: "",
    time_end: "",
    max_score: 0,
    title: "",
    content: "",
    files: [],
    createAt: ""
  })
  const [courseList, setCourseList] = useState<ICourse[]>([])
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('1')
  const dispatch = useDispatch()
  const isLoading = false
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }



  const [timeStart, setTimeStart] = useState<TimeState>({
    days: new Date().getDate(),
    months: new Date().getMonth() + 1,
    years: new Date().getFullYear(),
    hours: new Date().getHours(),
    minutes: new Date().getMinutes()
  })

  const [timeEnd, setTimeEnd] = useState<TimeState>({
    days: new Date().getDate(),
    months: new Date().getMonth() + 1,
    years: new Date().getFullYear(),
    hours: new Date().getHours(),
    minutes: new Date().getMinutes()
  })

  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  function handleChangeMaxScore(event: SelectChangeEvent<unknown>) {
    const currentMaxScore = event.target.value as number
    setState(prev => ({
      ...prev, max_score: currentMaxScore
    }))
  }

  function handleCourseChange(event: SelectChangeEvent<unknown>) {
    const value = event.target.value as string
    setState(prev => ({
      ...prev, course_id: value
    }))
  }

  useEffect(() => {
    const fetchQuizStore = async () => {
      const res = await AxiosInstance.get(`${teacherConfig.getAllCourse}`)
      const result: ICourse[] = res.data

      setCourseList(result)
    }
    fetchQuizStore()
  }, []);

  useEffect(() => {
    const fetchQuizStore = async () => {
      const res = await AxiosInstance.get(`${teacherConfig.getExamDetail}/${router.query.id}`)
      const result = res.data.data.data

      setEditorState(htmlToDraftBlocks(result.content))
      setState(result)
      setTimeStart({
        days: new Date(result.time_start).getDate(),
        months: new Date(result.time_start).getMonth() + 1,
        years: new Date(result.time_start).getFullYear(),
        hours: new Date(result.time_start).getHours(),
        minutes: new Date(result.time_start).getMinutes()
      })
      setTimeEnd({
        days: new Date(result.time_end).getDate(),
        months: new Date(result.time_end).getMonth() + 1,
        years: new Date(result.time_end).getFullYear(),
        hours: new Date(result.time_end).getHours(),
        minutes: new Date(result.time_end).getMinutes()
      })
    }
    fetchQuizStore()
  }, []);


  const user = localStorage.getItem('userData')
  const userData = user ? JSON.parse(user) : null

  const router = useRouter();
  const [dataList, setDataList] = useState<EssayData[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 });

  const fetchDataList = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.getIdEssayExamEndpoint}/${router.query.id}`);
      const essayData = response.data.map((x: any) => ({
        student_name: x.student_name,
        score: x.score,
        data: x.data
      }))
      setDataList(essayData);
    } catch (error: any) {
      if (error) {
        toast.error(error.response.data.message)
      }
    }
  };

  useEffect(() => {
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

  const generateCsvData = () => {
    return dataList.map(essay => ({
      student_name: essay.student_name,
      status: essay.data.status,
      time_start: essay.data.createAt?.toString().slice(0, 19).replace("T", " "),
      time_out: essay.data.time_out?.toString().slice(0, 19).replace("T", " "),
    }));
  };

  return (
    <>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='customized tabs example'>
          <Tab value='1' label={`${t('Detail')} ${t('Essay')}`} />
          <Tab value='2' label={t('Essay Score')} />
        </TabList>
        <TabPanel value='1' sx={{ px: 0 }}>
          <Card>
            <TableHeaderBreadcrumb />
            {state && <CardContent>
              <Grid container sx={{ alignItems: "center" }} spacing={4}>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5}>
                    {t('Title')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <CustomTextField value={state.title} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const value = event.target.value as string
                      setState(prev => ({ ...prev, title: value }))

                    }} disabled fullWidth placeholder='' />
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center" }} spacing={6}>
                  <Grid item xs={2.5} sx={{ alignSelf: "flex-start" }}>
                    {t('Description')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <EditorWrapper
                      sx={{
                        '&': { minHeight: "300px", border: "1px solid rgba(208, 212, 241, 0.16)" },
                        '& .rdw-editor-wrapper .rdw-editor-main': { px: 5 },
                        '& .rdw-editor-wrapper, & .rdw-option-wrapper': { border: 0 },
                        '& .rdw-editor-wrapper .rdw-editor-toolbar .rdw-image-modal': { transform: 'translateX(-50%)' },
                        '& .rdw-editor-wrapper .rdw-editor-toolbar .rdw-image-modal .rdw-image-modal-header-label': { border: 0 },
                        '& .rdw-editor-wrapper .rdw-editor-toolbar .rdw-image-modal .rdw-image-modal-header-option:has(.rdw-image-modal-header-label-highlighted)': { fontWeight: 700 },
                      }}
                    >
                      <ReactDraftWysiwyg
                        wrapperClassName={`editor-essay`}
                        editorState={editorState}
                        placeholder=''
                        toolbar={toolbarOptions}
                      />
                    </EditorWrapper>
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
                        value: state.course_id || "",
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
                      disabled
                      value={dayjs(createDate(timeStart)?.toISOString())}
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
                      <DateTimePicker
                        disabled
                        value={dayjs(createDate(timeEnd)?.toISOString())}
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
                        disabled
                        sx={{
                          '& > .MuiInputBase-root': { width: "66px !important", },
                          '& input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0
                          }

                        }}
                        type="number"
                        value={state.total_time}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const currentValue = Number(event.target.value)
                          if (currentValue > -1 && currentValue < 1000 && !/^00.*$/.test(currentValue.toString())) {
                            setState(prev => ({
                              ...prev, total_time: currentValue
                            }))
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
                    <CustomTextField
                      disabled
                      sx={{ '& > .MuiInputBase-root': { width: "fit-content !important", }, }}
                      select
                      SelectProps={{
                        MenuProps: {
                          sx: {
                            maxHeight: "200px",
                            '& > .MuiPaper-root': { minWidth: "125px !important", },
                            '& > .MuiPaper-root::-webkit-scrollbar': { width: "0.25rem" },
                            '& > .MuiPaper-root::-webkit-scrollbar-thumb': {
                              background: theme => `${theme.palette.text.primary}`,
                              borderRadius: '10px',
                              WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)'
                            },
                          },
                        },
                        value: state.max_score || 4,
                        displayEmpty: true,
                        onChange: handleChangeMaxScore
                      }}
                    >
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </CustomTextField>
                  </Grid>
                </Grid>
                <Grid container item sx={{ alignItems: "center", mt: 4 }} spacing={6}>
                  <Grid item xs={2.5} sx={{ alignSelf: "flex-start" }}>
                    {t('Download File')}
                  </Grid>
                  <Grid item xs={9.5}>
                    <DropzoneWrapper>
                      <Box className='dropzone'>
                        <Box onClick={(event) => {
                          event.stopPropagation()
                          window.open(state.files[0]);
                        }} sx={{ color: theme => `${theme.palette.text.primary}`, }}>
                          {state.files[0]}
                        </Box>
                      </Box>
                    </DropzoneWrapper>
                  </Grid>
                </Grid>
                <Grid container item sx={{ pb: "2rem", alignItems: "center", mt: 12 }}>
                  <Box sx={{ mt: "0rem", px: "2rem", textAlign: "right" }}>
                    <Link href={`/apps/essay/update/${router.query.id}`} passHref>
                      <Button
                        disabled={userData._id !== state.teacher_id}
                        variant='contained'>
                        {isLoading ? t("Loading...") : t("Edit")}
                      </Button>
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>}
          </Card>
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
                <ChartEssayScore />
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
                    filename={`essay_scores_${router.query.id}.csv`}
                    className="btn btn-primary"
                  >
                    <Button
                      variant='contained'>
                      {t('Export')} {t('CSV')}
                    </Button>
                  </CSVLink>
                </Box>
                {/* Existing table content */}
                {dataList && dataList.length ? (
                  <Paper>
                    <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                      <Table sx={{
                        "& img": {
                          height: "100px !important", width: "auto !important"
                        }
                      }} aria-label="custom pagination table">
                        <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                          <TableRow>
                            <TableCell >
                              {t('Student')}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {t('Status')}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {t('Time Start')}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {t('Time Out')}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {t('Score')}
                            </TableCell>
                            <TableCell style={{ width: '20%', textAlign: 'center' }}>
                              {t('Actions')}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody >
                          {dataList.map((essay: EssayData) => (
                            <Fragment key={essay.data._id}>
                              <TableRow >
                                <TableCell sx={{ fontSize: 15, }}>
                                  <Typography>
                                    {essay.student_name}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Typography>
                                    {essay.data.status}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Typography sx={{ fontSize: 15, fontWeight: 300 }}>{essay.data.createAt?.toString().slice(11, 19)}</Typography>
                                  <Typography sx={{ fontSize: 15, fontWeight: 300 }}>{essay.data.createAt?.toString().slice(0, 10)}</Typography>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Typography sx={{ fontSize: 15, fontWeight: 300 }}>{essay.data.time_out.toString().slice(11, 19)}</Typography>
                                  <Typography sx={{ fontSize: 15, fontWeight: 300 }}>{essay.data.time_out.toString().slice(0, 10)}</Typography>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Typography sx={{ fontSize: 15, fontWeight: 300 }}>
                                    {essay.score ? essay.score : 'Not Mark Yet'}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                                  <>
                                    <Tooltip title={t('View')}>
                                      <IconButton
                                        size='small'
                                        component={Link}
                                        sx={{ color: 'text.secondary', fontSize: 22, mx: 2 }}
                                        href={`/apps/essay/mark/${essay.data.essay_exam_id}?essayAnswerId=${essay.data._id}`}
                                        onClick={() => {
                                          dispatch(updateData(
                                            {
                                              title: essay.student_name,
                                              url: `/apps/essay/mark/${router.query.id}`
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
                      <TableHeaderBreadcrumb />
                      <Table aria-label="custom pagination table">
                        <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                          <TableRow>
                            <TableCell >
                              {t('Student')}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {t('Status')}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {t('Created At')}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {t('Time Out')}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {t('Score')}
                            </TableCell>
                            <TableCell style={{ width: '20%', textAlign: 'center' }}>
                              {t('Actions')}
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
              </Paper>
            </>
          )}
        </TabPanel>
      </TabContext>
    </>
  )
}

EssayDetail.acl = {
  action: 'read',
  subject: 'teacher-page'
}