import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Icon from 'src/@core/components/icon';
import { QuizOnline } from 'src/context/types';
import toast from 'react-hot-toast';
import AxiosInstance from 'src/configs/axios';
import adminPathName from 'src/configs/endpoints/admin';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { updateData } from 'src/store/apps/breadcrumbs';

interface ActionsProps {
  row: QuizOnline;
  setDataList: React.Dispatch<React.SetStateAction<QuizOnline[]>>;
  fetchDataList: () => void;
  setSelectedName?: React.Dispatch<React.SetStateAction<string>>;
}

const Actions: React.FC<ActionsProps & { fetchDataList: () => void }> = ({ row, setDataList, setSelectedName }) => {
  const { t } = useTranslation();
  const editedData = row;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`${adminPathName.deleteQuizOnlineEndpoint}/${row._id}`, {
        data: {
          id: row._id
        }
      });
      toast.success('Delete Successfully');
      setDataList(prevData => prevData.filter(x => x._id !== row._id));
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const user = localStorage.getItem('userData');
  const userData = user ? JSON.parse(user) : null;

  return (
    <>
      <Tooltip title={t('View')}>
        <IconButton
          size='small'
          component={Link}
          href={`/apps/quiz-online/detail/${row._id}`}
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            if (setSelectedName) {
              setSelectedName(row.title);
            }
            dispatch(updateData(
              {
                title: row.title,
                url: `/apps/quiz-online/detail/${row._id}`
              }
            ));
          }}
        >
          <Icon icon='tabler:eye' />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('Delete')}>
        <>
          <IconButton
            size='small'
            onClick={() => setIsDeleteDialogOpen(true)}
            sx={{ color: 'text.secondary' }}
            disabled={userData._id !== editedData?.teacherId}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </>
      </Tooltip>

      {/* Delete Dialog */}
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
            <Button color='error' variant='tonal' onClick={() => { handleDelete(); setIsDeleteDialogOpen(false); }}>
              {t('Delete')}
            </Button>
          </>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
