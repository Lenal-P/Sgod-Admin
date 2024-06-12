// ** React Imports
import { ChangeEvent, Fragment, useEffect, useState } from "react";

// ** MUI Imports
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Paper, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";

// ** Custom Component Imports
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports

// ** Third Party Imports
import { EditorState, convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDropzone } from 'react-dropzone';

// ** Styled Component Imports
import ReactDraftWysiwyg from "src/@core/components/react-draft-wysiwyg";
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';

// ** Dayjs

// ** Config
import adminPathName from 'src/configs/endpoints/admin';
import teacherConfig from "src/configs/endpoints/teacher";

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import AxiosInstance from "src/configs/axios";

// ** Utils
import { htmlToDraftBlocks } from "src/utils/draft";

// ** Next
import draftToHtml from "draftjs-to-html";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CheckPlagiarism, EssayData } from "src/context/types";
import { TimeState } from "src/types/timeTypes";
import TableHeaderDetail from "src/views/apps/essay/TableHeaderDetail";
import { Icon } from "@iconify/react";

interface IFileProp {
  name: string
  type: string
  size: number
}

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

interface MarkEssayExam {
  essay_exam_id: string,
  essay_exam_answer_id: string,
  score: number;
  comment: string
}

export default function CreateEssayPage() {
  const router = useRouter()
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
    max_score: 10,
    title: "",
    content: "",
    files: [],
    createAt: ""
  })

  const [markState, setMarkState] = useState<MarkEssayExam>({
    essay_exam_id: '',
    essay_exam_answer_id: '',
    score: 0,
    comment: ''
  });

  const [score, setScore] = useState<number | ''>('');
  const [essayAnswer, setEssayAnswer] = useState<EssayData>();
  const [files, setFiles] = useState<File[]>([])
  const { t } = useTranslation();
  const [plagiarismData, setPlagiarismData] = useState<CheckPlagiarism[] | null>(null);
  const [checkDialog, setCheckDialog] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 });
  const isLoading = false

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      // 'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
    }
  })
  const img = files.map((file: IFileProp) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={file.name}
      alt={file.name}
      className="single-file-image"
      src={URL.createObjectURL(file as any)}
    />
  ));

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
  const [commentEditorState, setCommentEditorState] = useState<EditorState>(htmlToDraftBlocks(""));

  const handleChangeMaxScore = (event: SelectChangeEvent<unknown>) => { // Thay đổi unknown thành number
    const currentMaxScore = event.target.value as number;
    if (!isNaN(currentMaxScore)) {
      setState((prevState: EssayExam) => ({
        ...prevState,
        max_score: currentMaxScore
      }));
    }
  };

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

  useEffect(() => {
    const fetchAnswer = async () => {
      const response = await AxiosInstance.get(`${adminPathName.getAnswerEssayExamEndpoint}/${router.query.essayAnswerId}`);
      setEssayAnswer(response.data)
    }
    fetchAnswer()
  }, []);

  useEffect(() => {
    const fetchScore = async () => {
      const response = await AxiosInstance.get(`${adminPathName.getEssayScoreEndpoint}/${router.query.essayAnswerId}`);
      setScore(response.data.data.score)
      setCommentEditorState(htmlToDraftBlocks(response.data.data.comment))
    }
    fetchScore()
  }, []);

  const checkPlagiarism = async () => {
    try {
      const response = await AxiosInstance.post(`${adminPathName.checkPlagiarismEndpoint}/${router.query.essayAnswerId}`)
      console.log(response.data)
      setPlagiarismData(response.data.data);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  async function handleSubmit() {
    const commentContent = draftToHtml(convertToRaw(commentEditorState.getCurrentContent()));
    const commentWithoutPTags = commentContent.replace(/<\/?p>|[\r\n]/g, '');

    try {
      // Lấy dữ liệu cần thiết từ state
      const data = {
        essay_exam_id: router.query.id,
        essay_exam_answer_id: router.query.essayAnswerId,
        score: markState.score,
        comment: commentWithoutPTags
      };

      // Gọi API để gửi dữ liệu
      await AxiosInstance.post(`${adminPathName.markEssayExamEndpoint}`, data);

      toast.success("Results have been sent successfully!");
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  // Hàm xử lý sự kiện khi thay đổi nội dung comment
  const handleChangeComment = (newEditorState: EditorState) => {

    setCommentEditorState(newEditorState);
  };

  const handleMarkScore = (event: ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(event.target.value);

    // Kiểm tra xem giá trị nhập vào là số và không vượt quá max_score
    if (!isNaN(newScore) && newScore >= 0 && newScore <= state.max_score) {
      setScore(newScore);
      setMarkState(prevState => ({
        ...prevState,
        score: newScore
      }));
    } else {
      // Nếu giá trị nhập vào không hợp lệ, bạn có thể thực hiện một số hành động, ví dụ như hiển thị một thông báo lỗi
      console.log('Invalid input or exceeds max_score');
      setScore('');
    }
  };

  return (
    <>
      <Card>
        <TableHeaderDetail />
        {state && <CardContent>
          <Grid container sx={{ alignItems: "center" }} spacing={4}>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('Essay Name')}
              </Grid>
              <Grid item xs={9.5}>
                <CustomTextField type="text" value={state.title} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value as string
                  setState(prev => ({ ...prev, title: value }))

                }} disabled fullWidth placeholder={t('Essay Name') ?? ''} />
              </Grid>
            </Grid>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5} sx={{ alignSelf: "flex-start" }}>
                {t('Content')}
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
                    placeholder={''}
                    toolbar={toolbarOptions}
                  />
                </EditorWrapper>
              </Grid>
            </Grid>
            <Grid container item sx={{ alignItems: "center", mt: 4 }} spacing={6}>
              <Grid item xs={2.5} sx={{ alignSelf: "flex-start" }}>
                {t('File')} {t('Essay')}
              </Grid>
              <Grid item xs={9.5}>
                <DropzoneWrapper>
                  <Box className='dropzone'>
                    {files.length ? (
                      img[0].key
                    ) : state.files.length ? (
                      <Box onClick={(event) => {
                        event.stopPropagation()
                        window.open(state.files[0]);
                      }} sx={{ color: theme => `${theme.palette.text.primary}`, }}>
                        {state.files[0]}
                      </Box>

                    ) : (
                      <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Typography variant='h4' sx={{ mb: 2.5 }}>
                          {t('There Are No Essay File')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </DropzoneWrapper>
              </Grid>
            </Grid>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('Point Ladder')}
              </Grid>
              <Grid item xs={9.5}>
                <CustomTextField
                  type="text"
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
                    value: state.max_score || 0,
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
          </Grid>
        </CardContent>}
      </Card>

      {/* Answer */}
      <Card sx={{ mt: 8 }}>
        <CardHeader sx={{ mb: 0 }} title={`${t('Detail')} ${t('Answer')}`} />
        <CardContent>
          <Grid container item sx={{ alignItems: "center", mt: 4 }} spacing={6}>
            <Grid item xs={2.5}>
              {t('Student')}
            </Grid>
            <Grid item xs={9.5}>
              {essayAnswer && <CustomTextField type="text" value={essayAnswer.student_name} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value as string
                setEssayAnswer((prev: any) => ({ ...prev, student_name: value }))
              }} disabled fullWidth />}
            </Grid>
          </Grid>
          <Grid container item sx={{ alignItems: "center", mt: 4 }} spacing={6}>
            <Grid item xs={2.5} sx={{ alignSelf: "flex-start" }}>
              {t('File')} {t('Answer')}
            </Grid>
            <Grid item xs={9.5}>
              <DropzoneWrapper>
                <Box className='dropzone'>
                  {files.length ? (
                    img[0].key
                  ) : (
                    essayAnswer && essayAnswer.data.file_upload.length ? (
                      <Box onClick={(event) => {
                        event.stopPropagation();
                        const fileUrl = essayAnswer.data.file_upload.join(', ');
                        window.open(fileUrl);
                      }} sx={{ color: theme => `${theme.palette.text.primary}` }}>
                        {essayAnswer.data.file_upload.map((file, index) => (
                          <div key={index}>{file}</div>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Typography variant='h4' sx={{ mb: 2.5 }}>
                          {t('There Are No Answer File')}
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>
              </DropzoneWrapper>
            </Grid>
          </Grid>
          <Grid container item sx={{ alignItems: "center", mt: 4 }} spacing={6}>
            <Grid item xs={2.5} sx={{ alignSelf: "flex-start" }}>
              {t('Answer')}
            </Grid>
            <Grid item xs={9.5}>
              <Box
                sx={{
                  padding: 6,
                  '&': { minHeight: "300px", border: "1px solid rgba(208, 212, 241, 0.16)" },
                  '& .rdw-editor-wrapper .rdw-editor-main': { px: 5 },
                  '& .rdw-editor-wrapper, & .rdw-option-wrapper': { border: 0 },
                  '& .rdw-editor-wrapper .rdw-editor-toolbar .rdw-image-modal': { transform: 'translateX(-50%)' },
                  '& .rdw-editor-wrapper .rdw-editor-toolbar .rdw-image-modal .rdw-image-modal-header-label': { border: 0 },
                  '& .rdw-editor-wrapper .rdw-editor-toolbar .rdw-image-modal .rdw-image-modal-header-option:has(.rdw-image-modal-header-label-highlighted)': { fontWeight: 700 },
                }}
              >
                {essayAnswer?.data.content_answers}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mark */}
      <Card sx={{ mt: 8 }}>
        <CardHeader sx={{ mb: 8 }} title={t('Mark')} />
        <CardContent>
          <Grid container sx={{ alignItems: "center" }} spacing={4}>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5} sx={{ alignSelf: "flex-start" }}>
                {t('Comment')}
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
                    wrapperClassName={`comment-essay`}
                    editorState={commentEditorState}
                    onEditorStateChange={handleChangeComment}
                    placeholder={t('Comment...') ?? ''}
                    toolbar={toolbarOptions}
                  />
                </EditorWrapper>
              </Grid>
            </Grid>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('Score')}
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
                    value={score}
                    onChange={handleMarkScore}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 4, mt: "0rem", py: 4, px: "0rem", textAlign: "right", justifyContent: 'right' }}>
            <Button onClick={() => { checkPlagiarism(); setCheckDialog(true) }} disabled={isLoading} variant='contained'>
              {isLoading ? t('Loading...') : t('Check Plagiarism')}
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} variant='contained'>
              {isLoading ? t('Loading...') : t('Complete')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Check Plagiarism */}
      <Dialog
        open={checkDialog}
        onClose={() => setCheckDialog(false)}
        aria-labelledby='user-view-edit'
        aria-describedby='user-view-edit-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
      >
        <DialogTitle
          id='user-view-edit'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {t('Check Plagiarism')}
          <IconButton
            size='small'
            onClick={() => setCheckDialog(false)}
            sx={{
              p: '0.438rem',
              borderRadius: 1,
              color: 'text.primary',
              top: '5%',
              position: 'absolute',
              right: '5%',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <DialogContent>
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
                        {t('Note')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {plagiarismData?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell >
                          {item.student_name}
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          {item.note}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[{ label: 'All', value: -1 }]}
                count={plagiarismData?.length || 1}
                rowsPerPage={paginationModel.pageSize}
                page={paginationModel.page}
                component="div"
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
            <DialogActions
              sx={{
                justifyContent: 'center',
                marginTop: 8,
                gap: 2,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='tonal' color='secondary' onClick={() => setCheckDialog(false)}>
                {t('Cancel')}
              </Button>
            </DialogActions>
          </DialogContent>
        </DialogContent>
      </Dialog >
    </>
  )
}