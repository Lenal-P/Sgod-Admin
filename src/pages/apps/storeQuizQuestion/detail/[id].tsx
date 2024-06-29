// ** React Imports
import {
  SyntheticEvent,
  useEffect,
  useState
} from "react";

// ** Next

// ** MUI Imports
import { TabContext, TabList, TabListProps, TabPanel } from '@mui/lab';
import { Box, Button, Card, CardContent, Divider, Grid, MenuItem, styled, Tab, Theme, Typography, useMediaQuery } from "@mui/material";

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Config
import teacherConfig from "src/configs/endpoints/teacher";

// ** Custom Component Imports
import CustomTextField from "src/@core/components/mui/text-field";

// ** Styled Component Imports
import ReactDraftWysiwyg from "src/@core/components/react-draft-wysiwyg";
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';

// ** Axios Instance
import AxiosInstance from "src/configs/axios";

// ** Services

// ** Utils
import { htmlToDraftBlocks } from "src/utils/draft";

// ** Types
import { IQuizStore, IState, ITab } from "src/types/quiz/types";

// ** Next
import { useRouter } from "next/router";

// ** Third Party Components
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useTranslation } from "react-i18next";

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
    minWidth: 65,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    },
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  '& .MuiTab-root.checked': {
    backgroundColor: "#388e3c"
  },
}))

export default function QuizDetail() {
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchQuizDetail = async () => {
      const id = router.query.id
      const res = await AxiosInstance.get(`${teacherConfig.getDetailQuizEndpoint}/${id}`)
      setState(res.data)

      const newEditorAnswer = res.data.answer.map((x: any) => (htmlToDraftBlocks(x.content)))
      setEditorAnswerStates(newEditorAnswer);
      setEditorQuestionStates(htmlToDraftBlocks(res.data.question))
      setActiveTab(getIndexAnswer(res.data.answer))
    }
    fetchQuizDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toolbarOptions = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
    inline: {
      inDropdown: false,
      options: ['bold', 'italic', 'underline']
    },
    list: {
      inDropdown: false,
      options: ['unordered', 'ordered']
    },
    link: {
      inDropdown: false,
      options: ['link']
    },
    image: {
      urlEnabled: true,
      uploadEnabled: true,
      alignmentEnabled: true,
      previewImage: true,
      inputAccept: 'image/jpeg,image/jpg,image/png,image/svg',
      alt: { present: true, mandatory: false },
      defaultSize: {
        height: 'auto',
        width: 'auto',
      },
    },
  }


  const [quizStore, setQuizStore] = useState<IQuizStore[]>([])
  const [editorAnswerStates, setEditorAnswerStates] = useState<EditorState[]>([
    EditorState.createEmpty(),
    EditorState.createEmpty(),
    EditorState.createEmpty(),
    EditorState.createEmpty(),
  ]);
  const [editorQuestionStates, setEditorQuestionStates] = useState<EditorState>(EditorState.createEmpty());
  const [state, setState] = useState<IState>({
    quiz_store_id: null,
    level: null,
    question: null,
    answer: [
      { content: null, score: 1 },
      { content: null, score: 0 },
      { content: null, score: 0 },
      { content: null, score: 0 },
    ]
  });

  const [activeTab, setActiveTab] = useState<string | null>(null)

  const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const handleChangeTab = async (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const fetchQuizStore = async () => {
      const res = await AxiosInstance.get(`${teacherConfig.getAllQuizQuestionStore}`)
      const result: IQuizStore[] = res.data.res
      setQuizStore(result)
    }
    fetchQuizStore()
  }, []);

  const renderTabLabel = (label: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
      <Icon fontSize='1.25rem' icon='solar:question-square-linear' />
      {!hideText && label}
    </Box>
  );

  const getIndexAnswer = (data: ITab[]) => {
    return data
      .map((x, i) => ({ ...x, key: i }))
      .filter(x => x.score === 1)[0].key.toString();
  };

  const handleSubmit = () => {
    router.push(`${router.query.id}`);
  };

  return (
    <>
      <Card>
        <Typography variant='h4' sx={{ margin: "1.25rem", fontWeight: 500, color: 'text.secondary' }}>
          {t('Settings')}
        </Typography>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item sm={4} xs={12}>
              <CustomTextField
                disabled
                select
                fullWidth
                SelectProps={{
                  MenuProps: {
                    sx: { maxHeight: "300px" },
                  },
                  value: state.quiz_store_id || "",
                  displayEmpty: true,
                }}
              >
                {quizStore.map((x, i) => {
                  return <MenuItem key={i} value={x._id}>{x.title}</MenuItem>
                })}

              </CustomTextField>
            </Grid>
            <Grid item sm={4} xs={12}>
              <CustomTextField
                select
                fullWidth
                disabled
                SelectProps={{
                  value: state.level || "",
                  displayEmpty: true,
                }}
              >
                <MenuItem value='easy'>{t('Easy')}</MenuItem>
                <MenuItem value='middle'>{t('Middle')}</MenuItem>
                <MenuItem value='hard'>{t('Hard')}</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>
        <Box sx={{ px: "1.5rem", pb: "3rem" }}>
          <Box sx={{ pb: "3rem" }}>
            <Typography variant='h4' sx={{ mt: "1.5rem", fontWeight: 500, color: 'text.secondary' }}>
              {t('Question')}
            </Typography>
            <Divider sx={{ pt: "1.25rem", m: '0 !important' }} />
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
                wrapperClassName={`editor-question`}
                editorState={editorQuestionStates}
                placeholder={`${t('Enter Question')}`}
                toolbar={toolbarOptions}
              />
            </EditorWrapper>
          </Box>
          <TabContext value={activeTab || '0'}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Box>
                  <Typography variant='h4' sx={{ mb: "1.25rem", fontWeight: 500, color: 'text.secondary' }}>
                    {t('Answer')}
                  </Typography>
                  <TabListStyled
                    variant='scrollable'
                    scrollButtons='auto'
                    onChange={handleChangeTab}
                  >
                    {state.answer.map((x, i) => (
                      <Tab
                        className={`${x.score === 1 && "checked"}`} key={i} value={i.toString()} label={renderTabLabel(`${t('Option')} ${i + 1}`)} />
                    ))}
                  </TabListStyled>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TabPanel sx={{ p: 0 }} value={activeTab || '0'}>
                  <Divider sx={{ m: '0 !important' }} />
                  <EditorWrapper
                    sx={{
                      '&': { minHeight: "260px", flex: "1", border: "1px solid rgba(208, 212, 241, 0.16)" },
                      '& .rdw-editor-wrapper .rdw-editor-main': { px: 5 },
                      '& .rdw-editor-wrapper, & .rdw-option-wrapper': { border: 0 },
                      '& .rdw-editor-wrapper .rdw-editor-toolbar .rdw-image-modal': { transform: 'translateX(-50%)' },
                      '& .rdw-editor-wrapper .rdw-editor-toolbar .rdw-image-modal .rdw-image-modal-header-label': { border: 0 },
                      '& .rdw-editor-wrapper .rdw-editor-toolbar .rdw-image-modal .rdw-image-modal-header-option:has(.rdw-image-modal-header-label-highlighted)': { fontWeight: 700 },
                    }}
                  >
                    <ReactDraftWysiwyg
                      wrapperClassName={`editor-answer`}
                      editorState={editorAnswerStates[Number(activeTab)]}
                      placeholder={`${t('Enter Answer')}`}
                      toolbar={toolbarOptions}
                    />
                  </EditorWrapper>
                </TabPanel>
              </Grid>
            </Grid>
            <Box>
              <Typography variant='h4' sx={{ mt: "1.5rem", mb: "1.25rem", fontWeight: 500, color: 'text.secondary' }}>
                {t('Correct Answer')}
              </Typography>
              <Grid item>
                <CustomTextField
                  sx={{ width: 250 }}
                  disabled
                  select
                  fullWidth
                  SelectProps={{
                    value: getIndexAnswer(state.answer) || "",
                  }}
                >
                  {state.answer.map((x, i) => (<MenuItem key={i} value={i}>{t('Option')} {i + 1}</MenuItem>))}
                </CustomTextField>
              </Grid>
            </Box>
          </TabContext>
        </Box>
        <Box sx={{ mt: "0rem", mr: '1.5rem', pb: "3rem", textAlign: "right" }}>
          <Button onClick={handleSubmit} variant='contained'>{t("Edit")}</Button>
        </Box>
      </Card>
    </>
  )
}

