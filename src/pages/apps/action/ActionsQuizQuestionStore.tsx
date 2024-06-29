import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { IconButton, MenuItem, Select, Tooltip } from '@mui/material';
import Icon from 'src/@core/components/icon'
import { QuizQuestionStore } from 'src/context/types';
import toast from 'react-hot-toast';
import AxiosInstance from 'src/configs/axios';
import adminPathName from 'src/configs/endpoints/admin';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material'
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { updateData } from 'src/store/apps/breadcrumbs'

interface DeleteUserProps {
  row: QuizQuestionStore;
  setDataQuizQuestionStore: React.Dispatch<React.SetStateAction<QuizQuestionStore[]>>;
  setSelectedQuizStoreName?: React.Dispatch<React.SetStateAction<string>>;
  selectedQuizStoreName: string
}

const Actions: React.FC<DeleteUserProps & { fetchDataList: () => void }> = ({ row, setDataQuizQuestionStore, setSelectedQuizStoreName }) => {
  const { t } = useTranslation()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedData, setEditedData] = useState(row);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`${adminPathName.deleteQuizStoreEndpoint}/${row._id}`, {
        data: {
          id: row._id
        }
      });
      toast.success('Delete Successfully')
      setDataQuizQuestionStore(prevData => prevData.filter(user => {
        return user._id !== row._id
      }))
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  const handleEditButtonClick = () => {
    setIsEditDialogOpen(true);
  };

  const saveEditedData = async (row: QuizQuestionStore) => {
    const filteredData = {
      id: row._id,
      is_share: Boolean(Number(row.is_share)),
      owner: row.owner,
      owner_name: row.owner_name,
      title: row.title,
      createAt: row.createAt,
    };
    try {
      await AxiosInstance.put(`${adminPathName.editQuizStoreEndpoint}`, filteredData);
      setDataQuizQuestionStore(prevData => prevData.map(user => user._id === row._id ? { ...user, ...row } : user));
      toast.success('Update Successfully')
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  const user = localStorage.getItem('userData')
  const userData = user ? JSON.parse(user) : null
  const dispatch = useDispatch()

  return (
    <>
      <Tooltip title={t('View')}>
        <IconButton
          size='small'
          component={Link}
          sx={{ color: 'text.secondary' }}
          href={`/apps/storeQuizQuestion/${row._id}`}
          onClick={() => {
            if (setSelectedQuizStoreName) {
              setSelectedQuizStoreName(row.title);
            }
            dispatch(updateData(
              {
                title: row.title,
                url: `/apps/storeQuizQuestion/${row._id}`
              }
            ))
          }}
        >
          <Icon icon='tabler:eye' />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('Edit')}>
        <>
          <IconButton disabled={userData._id !== editedData?.owner} size='small' onClick={handleEditButtonClick} sx={{ color: 'text.secondary' }}>
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
            disabled={userData._id !== editedData?.owner}
          >
            <Icon icon='tabler:trash' />
          </IconButton>
        </>
      </Tooltip>

      {/* Edit */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
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
          {t('Edit Quiz Question')}
          <IconButton
            size='small'
            onClick={() => setIsEditDialogOpen(false)}
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
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
            {t('Updating store details will receive a privacy audit.')}
          </DialogContentText>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  name="title"
                  label={t("Title")}
                  fullWidth
                  value={editedData?.title || ''}
                  onChange={(e) => {
                    setEditedData(prev => ({
                      ...prev,
                      title: e.target.value
                    }) as QuizQuestionStore
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ marginTop: 2 }}>
                  <Select
                    defaultValue={row.is_share}
                    value={editedData?.is_share || false}
                    onChange={(e) => {
                      setEditedData(prev => ({
                        ...prev,
                        is_share: e.target.value
                      }) as QuizQuestionStore
                      )
                    }}
                    inputProps={{
                      name: 'is_share',
                      id: 'is_share',
                    }}
                  >
                    <MenuItem value='' disabled>{t('Select Status Share')}</MenuItem>
                    <MenuItem value={'1'}>{t('Public')}</MenuItem>
                    <MenuItem value={'0'}>{t('Private')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <DialogActions
              sx={{
                justifyContent: 'center',
                marginTop: 8,
                gap: 2,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' type='submit' onClick={() => {
                saveEditedData(editedData);
                setIsEditDialogOpen(false);
              }}>
                {t('Save')}
              </Button>

              <Button variant='tonal' color='secondary' onClick={() => setIsEditDialogOpen(false)}>
                {t('Cancel')}
              </Button>
            </DialogActions>
          </DialogContent>
        </DialogContent>
      </Dialog >

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
      </Dialog >
    </>
  );
};

export default Actions;
