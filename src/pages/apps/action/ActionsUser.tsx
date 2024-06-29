import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next'
import { CardContent, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import Icon from 'src/@core/components/icon'
import { UserDataType } from 'src/context/types';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Card from '@mui/material/Card'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { ThemeColor } from 'src/@core/layouts/types';
import Box from '@mui/material/Box'
import { AbilityContext } from 'src/layouts/components/acl/Can'

interface DeleteUserProps {
  row: UserDataType;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType[]>>;
}

const Actions: React.FC<DeleteUserProps & { fetchDataList: () => void }> = ({ row, setUserData }) => {
  const { t } = useTranslation()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editedData, setEditedData] = useState(row);
  const ability = useContext(AbilityContext)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`${adminPathName.deleteUserEndpoint}`, {
        data: {
          id: row._id
        }
      });

      toast.success('Delete Successfully')
      setUserData(prevData => prevData.filter(user => {
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

  const handleViewButtonClick = () => {
    setIsViewDialogOpen(true);
  };

  const handleViewDeleteButtonClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const saveEditedData = async (row: UserDataType) => {
    const filteredData = {
      _id: row._id,
      name: {
        first_name: row.name?.first_name,
        last_name: row.name?.last_name
      },
      phone_number: row.phone_number,
      username: row.username,
      birthday: row.birthday,
      role: row.role
    };
    try {
      await AxiosInstance.put(`${adminPathName.editUserEndpoint}`, filteredData);
      setUserData(prevData => prevData.map(user => user._id === row._id ? { ...user, ...row } : user));
      toast.success('Update Successfully')
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  return (
    <>
      <Tooltip title={t('View')}>
        <IconButton size='small' onClick={handleViewButtonClick} sx={{ color: 'text.secondary' }}>
          <Icon icon='tabler:eye' />
        </IconButton>
      </Tooltip>
      {ability?.can('manage', 'all') ? (
        <>
          <Tooltip title={t('Edit')}>
            <IconButton size='small' onClick={handleEditButtonClick} sx={{ color: 'text.secondary' }}>
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <IconButton
              size='small'
              onClick={() => setIsDeleteDialogOpen(true)}
              sx={{ color: 'text.secondary' }}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </>
      ) :
        <>
          <Tooltip title={t('Edit')}>
            <>
              <IconButton disabled={row.role === 'teacher'} size='small' onClick={handleEditButtonClick} sx={{ color: 'text.secondary' }}>
                <Icon icon='tabler:edit' />
              </IconButton>
            </>
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <>
              <IconButton
                size='small'
                disabled={row.role === 'teacher'}
                onClick={() => setIsDeleteDialogOpen(false)}
                sx={{ color: 'text.secondary' }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </>
          </Tooltip>
        </>
      }

      {/* View */}
      <Dialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        aria-labelledby='user-view-edit'
        aria-describedby='user-view-edit-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}>
        <DialogTitle
          id='user-view-edit'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >{t('User Information')}
          <IconButton
            size='small'
            onClick={() => setIsViewDialogOpen(false)}
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
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Card>
                  <CardContent
                    sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                  >
                    {row?.avatar ? (
                      <CustomAvatar
                        src={row?.avatar}
                        variant='rounded'
                        alt={row?.name?.first_name}
                        sx={{ width: 100, height: 100, mb: 4 }}
                      />
                    ) : (
                      <CustomAvatar
                        skin='light'
                        variant='rounded'
                        color={row?.avatar as ThemeColor}
                        sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                      >
                      </CustomAvatar>
                    )}
                    <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
                      <Typography variant='h4' sx={{ mt: 3, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        {[row?.name?.first_name, row?.name?.last_name].filter(Boolean).join(' ') || 'No Name'}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, width: '100%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', width: '30%' }}>
                        <CustomAvatar skin='light' variant='rounded' sx={{ width: 35, height: 35 }}>
                          <Icon fontSize='1.75rem' icon='tabler:checkbox' />
                        </CustomAvatar>
                        <div>
                          <Typography variant='body2'>
                            {t('Courses')} {t('Done')}
                          </Typography>
                          <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>30</Typography>
                        </div>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', width: '30%' }}>
                        <CustomAvatar skin='light' variant='rounded' sx={{ width: 35, height: 35 }}>
                          <Icon fontSize='1.75rem' icon='tabler:checkbox' />
                        </CustomAvatar>
                        <div>
                          <Typography variant='body2'>
                            {t('Quiz')} {t('Done')}
                          </Typography>
                          <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>23</Typography>
                        </div>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', width: '30%' }}>
                        <CustomAvatar skin='light' variant='rounded' sx={{ width: 35, height: 35 }}>
                          <Icon fontSize='1.75rem' icon='tabler:briefcase' />
                        </CustomAvatar>
                        <div>
                          <Typography variant='body2'>
                            {t('Essay Exam')} {t('Done')}
                          </Typography>
                          <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>10</Typography>
                        </div>
                      </Box>
                    </Box>
                  </CardContent>

                  <Divider sx={{ my: '0 !important', mx: 6 }} />

                  <CardContent sx={{ pb: 4 }}>
                    <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                      {t('Detail')}
                    </Typography>
                    <Box sx={{ pt: 4 }}>
                      <Box sx={{ display: 'flex', mb: 3 }}>
                        <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Birthday')}:</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                          {row?.birthday instanceof Date || typeof row?.birthday === 'string'
                            ? new Date(row?.birthday).toISOString().slice(0, 10) // Chuyển đổi sang Date trước khi gọi toISOString()
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mb: 3 }}>
                        <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Phone Number')}:</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{row?.phone_number || 'None'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mb: 3 }}>
                        <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Username')}:</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{row?.username || 'Null'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mb: 3 }}>
                        <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Email')}:</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{row?.email || 'Null'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mb: 3 }}>
                        <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Role')}:</Typography>
                        <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{row?.role}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
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

              {ability?.can('manage', 'all') ? (
                <>
                  <Button color='error' variant='tonal' onClick={() => { handleViewDeleteButtonClick() }}>
                    {t('Delete')}
                  </Button>
                  <Button variant='tonal' color='secondary' onClick={() => setIsViewDialogOpen(false)}>
                    {t('Cancel')}
                  </Button>
                </>
              ) :
                <>
                  <Button
                    color='error'
                    variant='tonal'
                    disabled={row.role === 'teacher'}
                    onClick={() => { handleViewDeleteButtonClick() }}>
                    {t('Delete')}
                  </Button>
                  <Button variant='tonal' color='secondary' onClick={() => setIsViewDialogOpen(false)}>
                    {t('Cancel')}
                  </Button>
                </>
              }

            </DialogActions>
          </DialogContent>
        </DialogContent>
      </Dialog>

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
          {t('Edit User Information')}
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
            {t('Updating user details will receive a privacy audit.')}
          </DialogContentText>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="firstName"
                  name="firstName"
                  label={t("First Name")}
                  fullWidth
                  value={editedData?.name?.first_name || ''}
                  onChange={(e) => {
                    setEditedData(prev => ({
                      ...prev,
                      name: {
                        ...prev.name,
                        first_name: e.target.value
                      }
                    }) as UserDataType
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="lastName"
                  name="lastName"
                  label={t("Last Name")}
                  fullWidth
                  value={editedData?.name?.last_name || ''}
                  onChange={(e) => {
                    setEditedData(prev => ({
                      ...prev,
                      name: {
                        ...prev.name,
                        last_name: e.target.value
                      }
                    }) as UserDataType
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="username"
                  name="username"
                  label={t("Username")}
                  fullWidth
                  value={editedData?.username || ''}
                  onChange={(e) => {
                    setEditedData(prev => ({
                      ...prev,
                      username: e.target.value
                    }) as UserDataType
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ top: '8px' }}>
                  <DatePicker
                    label={t('Birthday')}
                    value={editedData?.birthday ? dayjs(editedData.birthday) : null}
                    onChange={(newValue) => {
                      if (newValue && typeof newValue.isValid === 'function') {
                        setEditedData({
                          ...editedData,
                          birthday: newValue.toISOString()
                        });
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="phone_number"
                  name="phone_number"
                  label={t("Phone Number")}
                  fullWidth
                  value={editedData?.phone_number || ''}
                  onChange={(e) => {
                    setEditedData(prev => ({
                      ...prev,
                      phone_number: e.target.value
                    }) as UserDataType
                    )
                  }}
                />
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
