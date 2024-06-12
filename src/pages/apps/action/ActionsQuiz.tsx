import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { IconButton, Tooltip } from '@mui/material';
import Icon from 'src/@core/components/icon'
import { QuizList } from 'src/context/types';
import toast from 'react-hot-toast';
import AxiosInstance from 'src/configs/axios';
import adminPathName from 'src/configs/endpoints/admin';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { updateData } from 'src/store/apps/breadcrumbs'

interface DeleteUserProps {
  row: QuizList;
  setDataQuiz: React.Dispatch<React.SetStateAction<QuizList[]>>;
  setSelectedQuizName?: React.Dispatch<React.SetStateAction<string>>;
}

const Actions: React.FC<DeleteUserProps & { fetchDataList: () => void }> = ({ row, setDataQuiz, setSelectedQuizName }) => {
  const { t } = useTranslation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`${adminPathName.deleteQuizEndpoint}/${row.quiz._id}`, {
        data: {
          id: row.quiz._id
        }
      });
      toast.success('Delete Successfully');
      setDataQuiz(prevData => prevData.filter(user => user.quiz._id !== row.quiz._id));
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const userData = JSON.parse(localStorage.getItem('userData')!);
  const dispatch = useDispatch()

  return (
    <>
      <Tooltip title={t('View')}>
        <IconButton
          size='small'
          component={Link}
          sx={{ color: 'text.secondary' }}
          href={`/apps/quiz/detail/${row.quiz._id}?teacherID=${row.quiz.teacher_id}`}
          onClick={() => {
            if (setSelectedQuizName) {
              setSelectedQuizName(row.quiz.title);
            }
            dispatch(updateData(
              {
                title: row.quiz.title,
                url: `/apps/quiz/detail/${row.quiz._id}`
              }
            ))
          }}
        >
          <Icon icon='tabler:eye' />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('Edit')}>
        <>
          <IconButton
            disabled={userData._id !== row.quiz.teacher_id}
            size='small'
            component={Link}
            href={`/apps/quiz/update/${row.quiz._id}`}
            onClick={() => {
              if (setSelectedQuizName) {
                setSelectedQuizName(row.quiz.title);
              }
              dispatch(updateData(
                {
                  title: row.quiz.title,
                  url: `/apps/quiz/update/${row.quiz._id}`
                }
              ))
            }}
            sx={{ color: 'text.secondary' }}>
            <Icon icon='tabler:edit' />
          </IconButton>
        </>
      </Tooltip>
      <Tooltip title={t('Delete')}>
        <>
          <IconButton
            size='small'
            onClick={() => setIsDeleteDialogOpen(true)}
            sx={{ color: 'text.secondary' }}
            disabled={userData._id !== row.quiz.teacher_id}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </>
      </Tooltip>

      {/* Delete */}
      < Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle
          id='delete'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {t('Confirm Deletion')}
          <IconButton
            size='small'
            onClick={() => setIsDeleteDialogOpen(false)}
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
          <p>{t('Are you sure you want to delete this category?')}</p>
        </DialogContent>
        <DialogActions>
          <>
            <Button variant='tonal' color='secondary' onClick={() => setIsDeleteDialogOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button color='error' variant='tonal' onClick={() => { handleDelete(); setIsDeleteDialogOpen(false); }}>
              {t('Delete')}
            </Button>
          </>
        </DialogActions>
      </Dialog >
    </>
  );
};

export default Actions;
