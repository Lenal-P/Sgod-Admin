// ** React Imports
import {
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from "react";

// ** Next
import { useRouter } from "next/router";

// ** MUI Imports
import { TabContext, TabList, TabListProps, TabPanel } from '@mui/lab';
import { Box, Button, Card, CardContent, Divider, Grid, MenuItem, SelectChangeEvent, styled, Tab, Theme, Typography, useMediaQuery } from "@mui/material";

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
import { deleteFile } from "src/services/deleteFile";
import { uploadSingleFile } from "src/services/uploadFile";

// ** Utils
import { htmlToDraftBlocks } from "src/utils/draft";

// ** Third Party Components
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

// ** Types
import { IQuizStore, IState, ITab } from "src/types/quiz/types";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

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
    minHeight: 38,
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



export default function UpdateQuizPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const fetchQuizDetail = async () => {
    const id = router.query.id
    const res = await AxiosInstance.get(`${teacherConfig.getDetailQuizEndpoint}/${id}`)
    const { question, answer } = res.data

    setState(() => ({
      ...res.data,
      question: question,
      answer: answer.map((x: ITab, i: number) => ({
        ...x,
        _id: i.toString(),
        editorState: htmlToDraftBlocks(x.content),
        content: x.content
      }))
    }))

    setEditorQuestionStates(htmlToDraftBlocks(question))
  }

  useEffect(() => {
    fetchQuizDetail()
  }, [])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const urlImgStored = useRef<string[]>([])
  const [quizStore, setQuizStore] = useState<IQuizStore[]>([])
  const [editorQuestionStates, setEditorQuestionStates] = useState<EditorState>(EditorState.createEmpty());
  const [state, setState] = useState<IState>({
    quiz_store_id: null,
    level: null,
    question: null,
    answer: [
      { _id: "0", content: null, score: 1, editorState: EditorState.createEmpty() },
      { _id: "1", content: null, score: 0, editorState: EditorState.createEmpty() },
    ]
  });

  const getIdAnswer = (data: ITab[]) => {
    return data.filter(x => x.score === 1 && x._id)[0]._id
  }

  const [activeTab, setActiveTab] = useState<string>(getIdAnswer(state.answer))
  const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const handleChangeTab = async (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  const uploadCallback = (file: any) => {
    return new Promise((resolve, reject) => {
      const buttonWrapper = document.querySelector(".rdw-image-modal-btn-section")

      const reader = new FileReader();
      reader.onloadend = async () => {
        const form_data = new FormData();
        form_data.append("file", file);

        // setValue(URL.createObjectURL(form_data.get("file")));

        const { url } = await uploadSingleFile(form_data);
        if (url) {
          urlImgStored.current.push(url)
        }
        if (buttonWrapper) {
          const cancelButton = buttonWrapper.querySelectorAll(".rdw-image-modal-btn")
          cancelButton[1].addEventListener('click', async () => {
            if (url) {
              await deleteFile(url)
            }
          });
        }

        // setValue("thumbnail", res.data);
        // resolve({ data: { link: process.env.REACT_APP_API + res.data } });

        resolve({ data: { link: url } });
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

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
      uploadCallback: uploadCallback,
      previewImage: true,
      inputAccept: 'image/jpeg,image/jpg,image/png,image/svg',
      alt: { present: true, mandatory: false },
      defaultSize: {
        height: 'auto',
        width: 'auto',
      },
    },
  }

  useEffect(() => {
    const fetchQuizStore = async () => {
      const res = await AxiosInstance.get(`${teacherConfig.getAllQuizQuestionStore}`)
      const result: IQuizStore[] = res.data.res
      setQuizStore(result)
    }
    fetchQuizStore()
  }, []);

  useEffect(() => {
    return () => {
      urlImgStored.current = [];
    }
  }, []);

  const handleAnswerCheckedChange = (event: SelectChangeEvent<unknown>) => {
    const target = event.target.value

    setState(prevState => ({
      ...prevState, answer: prevState.answer.map((x, i) => {
        if (i === target) {
          return { ...x, score: 1 };
        } else {
          return { ...x, score: 0 };
        }
      })
    }))
  }

  const handlelevelChange = (event: SelectChangeEvent<unknown>) => {
    setState(prev => ({ ...prev, level: event.target.value as "easy" | "middle" | "hard" }))
  }

  const handleQuestionStoreChange = (event: SelectChangeEvent<unknown>) => {
    setState(prev => ({ ...prev, quiz_store_id: event.target.value as string }))
  }

  const updateQuestionValue = async (contentState: EditorState) => {
    const rawState = convertToRaw(contentState.getCurrentContent())
    const markup = draftToHtml(rawState);

    setEditorQuestionStates(contentState);
    setState(prevState => ({
      ...prevState,
      question: markup
    }));
  };

  const updateAnswerValue = async (contentState: EditorState) => {
    const rawState = convertToRaw(contentState.getCurrentContent())
    const markup = draftToHtml(rawState);

    setState(prev => ({
      ...prev, answer: prev.answer.map(item => {
        if (item._id === activeTab) {
          return { ...item, content: markup, editorState: contentState };
        } else {
          return item;
        }
      })
    }))
  };

  const renderTabLabel = (label: string, id: number) => (
    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& > svg': { mr: 2 } }) }}>
      <Icon fontSize='1.25rem' icon='solar:question-square-linear' />
      {!hideText && label}
      <Box onClick={(event) => {
        event.stopPropagation();
        handleDeleteAnswer(id)
      }}
        className="remove-answer"
        sx={{
          backgroundColor: "#CE4A4B",
          borderWidth: "1px",
          borderColor: "#ccc",
          borderRadius: "0.25rem",
          display: "none",
          position: "absolute",
          top: 0, right: 0, transform: 'translate(25%,-25%)'
        }}>
        <Icon fontSize='1rem' icon='material-symbols:close-small' />
      </Box>
    </Box>
  );

  const handleAddAnswer = (): void => {
    setState(prev => ({
      ...prev, answer: [...prev.answer, {
        _id: (state.answer.length).toString(),
        content: null,
        score: 0,
        editorState: EditorState.createEmpty()
      }]
    }))
  }

  const handleDeleteAnswer = (id: number): void => {
    setState(prev => {
      if (prev.answer.length > 1) {
        const removeId = prev.answer.filter(item => item._id !== id);
        const updateNewAnswer = removeId.map((item, index) => {
          item._id = index.toString()
          if (index === 0) {
            return {
              ...item,
              score: 1,
            };
          }

          return item;
        });
        setActiveTab(getIdAnswer(updateNewAnswer))

        return { ...prev, answer: updateNewAnswer };
      } else {
        return prev
      }
    });

  }

  const getIndexAnswer = (data: ITab[]) => {
    return data
      .map((x, i) => ({ ...x, key: i }))
      .filter(x => x.score === 1)[0].key.toString();
  };

  const getEditorStateAnswer = (data: ITab[]) => {
    if (data) {
      const answerTab = data.find(x => x._id === activeTab)
      if (answerTab) {
        return answerTab.editorState
      } else {
        return EditorState.createEmpty()
      }
    }
  }

  const handleSubmit = async () => {
    const { answer, ...rest } = state;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedAnswer: ITab[] = answer.map(({ _id, editorState, ...rest }) => rest); // remove index
    const updateNewData = { ...rest, id: router.query.id, answer: updatedAnswer }
    setIsLoading(true)
    try {
      await AxiosInstance.put("https://e-learming-be.onrender.com/quiz-question/put", updateNewData)
      toast.success('Cập nhật câu hỏi thành công!')
    } catch (error) {
      toast.error('Cập nhật câu hỏi thất bại!')
    }
    setIsLoading(false)
  }

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
                select
                fullWidth
                defaultValue=""
                SelectProps={{
                  MenuProps: {
                    sx: { maxHeight: "300px" },
                  },
                  value: state.quiz_store_id || "",
                  displayEmpty: true,
                  onChange: event => handleQuestionStoreChange(event)
                }}
              >
                <MenuItem value="">{t('Chọn ngân hàng đề')}</MenuItem>
                {quizStore.map((x, i) => {
                  return <MenuItem key={i} value={x._id}>{x.title}</MenuItem>
                })}

              </CustomTextField>
            </Grid>
            <Grid item sm={4} xs={12}>
              <CustomTextField
                select
                fullWidth
                defaultValue=''
                SelectProps={{
                  value: state.level || "",
                  displayEmpty: true,
                  onChange: event => handlelevelChange(event)
                }}
              >
                <MenuItem value=''>{t('Chọn độ khó của câu hỏi')}</MenuItem>
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
                onEditorStateChange={(contentState) => updateQuestionValue(contentState)}
                placeholder={`${t('Enter Question')}`}
                toolbar={toolbarOptions}
              />
            </EditorWrapper>
          </Box>
          <TabContext value={activeTab || getIdAnswer(state.answer)}>
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
                      <Tab sx={{ position: "relative" }}
                        className={`${x.score === 1 && "checked"}`} key={x._id} value={x._id} label={renderTabLabel(`${t('Option')} ${i + 1}`, x._id)} />
                    ))}
                    {state.answer.length < 4 && <Tab onClick={handleAddAnswer} value={getIdAnswer(state.answer)} className="plus" label={<Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>+</Box>} />}
                  </TabListStyled>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TabPanel sx={{ p: 0 }} value={activeTab || getIdAnswer(state.answer)}>
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
                      editorState={getEditorStateAnswer(state.answer)}
                      onEditorStateChange={(contentState) => updateAnswerValue(contentState)}
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
                  select
                  fullWidth
                  defaultValue=''
                  SelectProps={{
                    value: getIndexAnswer(state.answer) || "",
                    displayEmpty: true,
                    onChange: event => handleAnswerCheckedChange(event)
                  }}
                >
                  <MenuItem disabled value=''>{t('Select Correct Answer')}</MenuItem>
                  {state.answer.map((x, i) => (<MenuItem key={i} value={i}>{t('Option')} {i + 1}</MenuItem>))}
                </CustomTextField>
              </Grid>
            </Box>
          </TabContext>
        </Box>
        <Box sx={{ mt: "0rem", mr: '1.5rem', pb: "3rem", textAlign: "right" }}>
          <Button onClick={handleSubmit} disabled={isLoading} variant='contained'>{isLoading ? t("Loading...") : t("Save")}</Button>
        </Box>
      </Card>
    </>
  )
}

