// ** React Imports
import { ChangeEvent, useEffect, useState } from "react";

// ** MUI Imports
import { Box, Button, Card, CardContent, Grid, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// ** Custom Component Imports
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Imports
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDropzone } from 'react-dropzone';

// ** Styled Component Imports
import ReactDraftWysiwyg from "src/@core/components/react-draft-wysiwyg";
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';

// ** Dayjs
import { createDate } from "src/utils/dateTime";

// ** Config
import teacherConfig from "src/configs/endpoints/teacher";

// ** Styled Component
import dayjs from "dayjs";
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import AxiosInstance from "src/configs/axios";
import { ICourse } from "../../../../types/quiz/types";

// ** Utils
import { htmlToDraftBlocks } from "src/utils/draft";
import TableHeaderBreadcrumb from "src/views/apps/courses/list/TableHeaderBreadcrumb";

// ** Next
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { TimeState } from "src/types/timeTypes";
import { handleAxiosError } from "src/utils/errorHandler";

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
    max_score: 0,
    title: "",
    content: "",
    files: [],
    createAt: ""
  })
  const [courseList, setCourseList] = useState<ICourse[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  const { t } = useTranslation();
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      // 'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      console.log(acceptedFiles)
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

  function handleChangeContent(contentState: EditorState) {
    const rawState = convertToRaw(contentState.getCurrentContent())
    const markup = draftToHtml(rawState);
    setState(prev => ({
      ...prev, content: markup
    }))
    setEditorState(contentState)
  }

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
      try {
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
      } catch (error) {
        handleAxiosError(error)
      }
    }

    fetchQuizStore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    setIsLoading(true)
    const formData = new FormData();
    formData.append("title", state.title);
    formData.append("file", files[0]);
    formData.append("content", state.content);
    formData.append("course_id", state.course_id);
    formData.append("max_score", state.max_score.toString());
    formData.append("total_time", (state.total_time).toString());
    formData.append("time_start", createDate(timeStart)?.toISOString() || "");
    formData.append("time_end", createDate(timeEnd)?.toISOString() || "");

    try {
      await AxiosInstance.put(`https://e-learming-be.onrender.com/essay-exam/update-essay-exam/${router.query.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data", }
      })
      toast.success("Update successfully!")
    } catch (error) {
      handleAxiosError(error)
    }
    setIsLoading(false)
  }


  return (
    <>
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

                }} fullWidth placeholder='Nhập tên...' />
              </Grid>
            </Grid>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5} sx={{ alignSelf: "flex-start" }}>
                {t('Description')}
              </Grid>
              <Grid item xs={9.5}>
                <EditorWrapper
                  sx={{
                    '&': { minHeight: "300px", border: theme => `1px solid ${theme.palette.divider}` },
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
                    onEditorStateChange={handleChangeContent}
                    placeholder='Nhập mô tả...'
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
                  <Box {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    {files.length ? (
                      img[0].key
                    ) : state.files.length ? (
                      <Box onClick={(event) => {
                        event.stopPropagation()
                        window.open(state.files[0]);
                      }} sx={{ color: theme => `${theme.palette.text.primary}`, }}>
                        {state.files[0] || "No file selected"}
                      </Box>

                    ) : (
                      <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Box
                          sx={{
                            mb: 8.75,
                            width: 48,
                            height: 48,
                            display: 'flex',
                            borderRadius: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                          }}
                        >
                          <Icon icon='tabler:upload' fontSize='1.75rem' />
                        </Box>
                        <Typography variant='h4' sx={{ mb: 2.5 }}>
                          {t('Drop files here or click to upload')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </DropzoneWrapper>
              </Grid>
            </Grid>
            <Grid container item sx={{ pb: "2rem", alignItems: "center", mt: 12 }}>
              <Box sx={{ mt: "0rem", textAlign: "right" }}>
                <Button onClick={handleSubmit} disabled={isLoading} variant='contained'>{isLoading ? t("Loading...") : t("Update")}</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>}
      </Card >
    </>
  )
}
