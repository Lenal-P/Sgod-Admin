import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Quiz } from 'src/context/types';
import { IconButton, Box } from '@mui/material';
import { useTranslation } from 'react-i18next'
import AxiosInstance from 'src/configs/axios';
import adminPathName from 'src/configs/endpoints/admin';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { updateData } from 'src/store/apps/breadcrumbs'


interface CardInfluencerProps {
  quiz: Quiz;
  fetchQuizzes: () => void;
}

const CardInfluencer = (props: CardInfluencerProps) => {
  const { quiz, fetchQuizzes } = props;
  const { t } = useTranslation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const dispatch = useDispatch()

  const handleDeleteQuiz = async () => {
    try {
      await AxiosInstance.delete(`${adminPathName.deleteQuizEndpoint}/${quiz._id}`);
      fetchQuizzes()
      toast.success(`Delete Successfully`);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  const user = localStorage.getItem('userData')
  const userData = user ? JSON.parse(user) : null

  return (
    <>
      <Card>
        <CardHeader title={`Quiz: ${quiz.title}`} />
        <CardContent>
          <Typography sx={{ mb: 1, color: 'text.secondary' }}>
            {`Time begin: ${quiz.time_begin.toString().slice(0, 10)}`}
          </Typography>
          <Typography sx={{ mb: 1, color: 'text.secondary' }}>
            {`Time end: ${quiz.time_end.toString().slice(0, 10)}`}
          </Typography>
          <Typography sx={{ mb: 1, color: 'text.secondary' }}>
            {`Total time: ${quiz.total_time}`}
          </Typography>
          <Typography sx={{ mb: 1, color: 'text.secondary' }}>
            {`Max score: ${quiz.max_score}`}
          </Typography>
          <Typography sx={{ mb: 1, color: 'text.secondary' }}>
            {`Owner: ${quiz.teacher_name}`}
          </Typography>
        </CardContent>
        <CardActions className='card-action-dense' sx={{ display: 'flex', gap: 3, mb: 2 }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', gap: 3 }}>
            <Box sx={{ width: '100%' }}>
              <Link href={`/apps/quiz/detail/${quiz._id}`} passHref>
                <Button
                  variant='contained'
                  sx={{ py: 2, width: '100%' }}
                  onClick={() => {
                    dispatch(updateData(
                      {
                        title: `${quiz.title}`,
                        url: `/apps/quiz/detail/${quiz._id}`
                      }
                    ))
                  }}
                >
                  <Icon icon='majesticons:checkbox-list-detail-line' fontSize={20}>{t('Detail')}</Icon>
                </Button>
              </Link>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Link href={`/apps/quiz/update/${quiz._id}`} passHref>
                <Button
                  variant='contained'
                  sx={{ py: 2, width: '100%' }}
                  onClick={() => {
                    dispatch(updateData(
                      {
                        title: `${quiz.title}`,
                        url: `/apps/quiz/update/${quiz._id}`
                      }
                    ))
                  }}
                >
                  <Icon icon='tabler:edit' fontSize={20}>{t('Edit')}</Icon>
                </Button>
              </Link>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Button
                variant='contained'
                sx={{ py: 2, width: '100%' }}
                disabled={userData._id !== quiz.teacher_id}
                onClick={() => setIsDeleteDialogOpen(true)}>
                <Icon icon='tabler:trash' fontSize={20}>{t('Delete')}</Icon>
              </Button>
            </Box>
          </Box>
        </CardActions>

        {/* Delete */}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
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
            <p>{t('Are you sure you want to delete?')}</p>
          </DialogContent>
          <DialogActions>
            <>
              <Button variant='tonal' color='secondary' onClick={() => setIsDeleteDialogOpen(false)}>
                {t('Cancel')}
              </Button>
              <Button color='error' variant='tonal' onClick={() => { handleDeleteQuiz(); setIsDeleteDialogOpen(false); }}>
                {t('Delete')}
              </Button>
            </>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  );
}

export default CardInfluencer;
