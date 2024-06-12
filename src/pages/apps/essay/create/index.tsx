// ** React Imports
import { ChangeEvent, useEffect, useState } from "react";

// ** MUI Imports
import { Box, Button, Card, CardContent, CardHeader, Grid, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
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

// ** Utils
import { createDate } from "src/utils/dateTime";

// ** Config
import teacherConfig from "src/configs/endpoints/teacher";

// ** Styled Component
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import AxiosInstance from "src/configs/axios";
import { TimeState } from "src/types/timeTypes";
import { ICourse } from "../../../../types/quiz/types";

interface IFileProp {
  name: string
  type: string
  size: number
}

export default function CreateEssayPage() {
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
  const [courseList, setCourseList] = useState<ICourse[]>([])
  const isLoading = false
  const [courseId, setCourseId] = useState<string>("");
  const { t } = useTranslation();

  const [files, setFiles] = useState<File[]>([])
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      // 'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
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

  const [timeLimit, setTimeLimit] = useState<number>(60);

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

  const [maxScore, setMaxScore] = useState<number>(10);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  function handleChangeContent(contentState: EditorState) {
    const rawState = convertToRaw(contentState.getCurrentContent())
    const markup = draftToHtml(rawState);
    setContent(markup)
    setEditorState(contentState)
  }

  function handleChangeMaxScore(event: SelectChangeEvent<unknown>) {
    const currentMaxScore = event.target.value as number
    setMaxScore(currentMaxScore)
  }

  function handleCourseChange(event: SelectChangeEvent<unknown>) {
    setCourseId(event.target.value as string)
  }

  useEffect(() => {
    const fetchQuizStore = async () => {
      const res = await AxiosInstance.get(`${teacherConfig.getAllCourse}`)
      const result: ICourse[] = res.data

      setCourseList(result)
    }
    fetchQuizStore()
  }, []);


  async function handleSubmit() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", files[0]);
    formData.append("content", content);
    formData.append("course_id", courseId);

    formData.append("max_score", maxScore.toString());
    formData.append("total_time", (timeLimit).toString());
    formData.append("time_start", createDate(timeStart)?.toISOString() || "");
    formData.append("time_end", createDate(timeEnd)?.toISOString() || "");
    formData.append("teacher_id", JSON.parse(localStorage.getItem("userData")!)._id);

    const res = await AxiosInstance.post("https://e-learming-be.onrender.com/essay-exam", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
    )
    if (res.status === 201) {
      toast.success("Successfully!")
    }
    else {
      toast.error("Error from server")
    }
  }


  return (
    <>
      <Card>
        <CardHeader sx={{ mb: 8 }} title={`${t('Create')} ${t('Essay')}`} />
        <CardContent>
          <Grid container sx={{ alignItems: "center" }} spacing={4}>
            <Grid container item sx={{ alignItems: "center" }} spacing={6}>
              <Grid item xs={2.5}>
                {t('Title')}
              </Grid>
              <Grid item xs={9.5}>
                <CustomTextField onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  const value = event.target.value
                  setTitle(value)

                }} fullWidth placeholder={t('Enter Title') ?? ''} />
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
                    onEditorStateChange={handleChangeContent}
                    placeholder={`${t('Enter Description')}`}
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

                  // value={timeLimit}
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
                    value: maxScore,
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
                          {t('Drop Files Here Or Click To Upload')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </DropzoneWrapper>
              </Grid>
            </Grid>
            <Grid container item sx={{ px: "0rem", alignItems: "center", justifyContent: "flex-end", pb: "1.5rem" }}>
              <Box sx={{ mt: "0rem", pt: "3rem", textAlign: "right" }}>
                <Button onClick={handleSubmit} disabled={isLoading} variant='contained'>{isLoading ? t("Loading...") : t("Create")}</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

CreateEssayPage.acl = {
  action: 'read',
  subject: 'teacher-page'
}