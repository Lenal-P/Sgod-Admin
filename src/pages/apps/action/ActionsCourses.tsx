import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next'
import { IconButton, MenuItem, Select, Tooltip } from '@mui/material';
import Icon from 'src/@core/components/icon'
import { Category, Courses } from 'src/context/types';
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
import { AbilityContext } from 'src/layouts/components/acl/Can'
import ButtonsFab from 'src/views/pages/admin-profile/components/ButtonsFab';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { updateData } from 'src/store/apps/breadcrumbs'

interface DeleteUserProps {
  row: Courses;
  setDataCourses: React.Dispatch<React.SetStateAction<Courses[]>>;
}

interface ActionsProps extends DeleteUserProps {
  fetchDataList: () => void;
  fetchCategories: () => void;
  categories: Category[];
  selectedCourseName: string;
  setSelectedCourseName?: React.Dispatch<React.SetStateAction<string>>;
}

const Actions: React.FC<ActionsProps> = ({ row, setDataCourses, fetchDataList, categories, setSelectedCourseName }) => {
  const { t } = useTranslation()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedData, setEditedData] = useState(row);
  const ability = useContext(AbilityContext)
  const { control, setValue } = useForm()
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await AxiosInstance.delete(`${adminPathName.deleteCoursesEndpoint}`, {
        data: {
          id: row._id
        }
      });

      toast.success('Delete Successfully')
      setDataCourses(prevData => prevData.filter(courses => {
        return courses._id !== row._id
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

  const saveEditedData = async (data: Courses, file: File) => {
    try {
      const formData = new FormData();

      formData.append('file', file);

      // Thêm dữ liệu của category vào formData
      formData.append('id', data._id);
      formData.append('name', data.name);
      formData.append('category_id', data.category_id);
      formData.append('status', data.status);

      await AxiosInstance.put(`${adminPathName.editCoursesEndpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      fetchDataList()
      setDataCourses(prevData => prevData.map(courses => courses._id === row._id ? { ...courses, ...row } : courses));
      toast.success('Update Successfully')
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  // Icon
  const handleChooseFile = async () => {
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.click();
      fileInput.addEventListener('change', async event => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const binaryString = event.target?.result as string;
            setValue('icon', binaryString);
            setSelectedFile(file);
          };
          reader.readAsDataURL(file);
        }
      });
    } catch (error) {
      console.error('Error choosing file:', error);
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
          href={`/apps/courses/list/${row._id}`}
          onClick={() => {
            if (setSelectedCourseName) {
              setSelectedCourseName(row.name);
            }
            dispatch(updateData(
              {
                title: row.name,
                url: `/apps/courses/list/${row._id}`
              }
            ))
          }}
        >
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
              <IconButton disabled={userData.role === 'teacher'} size='small' onClick={handleEditButtonClick} sx={{ color: 'text.secondary' }}>
                <Icon icon='tabler:edit' />
              </IconButton>
            </>
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <>
              <IconButton
                size='small'
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={userData.role === 'teacher'}
                sx={{ color: 'text.secondary' }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </>
          </Tooltip>
        </>
      }

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
          {t('Edit Courses Information')}
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
            {t('Updating courses details will receive a privacy audit.')}
          </DialogContentText>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  name="name"
                  label={t("Name")}
                  fullWidth
                  value={editedData?.name || ''}
                  onChange={(e) => {
                    setEditedData(prev => ({
                      ...prev,
                      name: e.target.value
                    }) as Courses
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='icon'
                  control={control}
                  defaultValue={editedData?.icon || ''}
                  render={({ field }) => (
                    <Grid
                      container
                      alignItems='end'
                      spacing={2}
                      sx={{ display: 'flex', gap: 1 }}
                    >
                      <Grid item sx={{ position: 'relative', flex: 1 }} >
                        <TextField
                          fullWidth
                          label={t('Icon')}
                          placeholder='/images/'
                          value={field.value}
                          onChange={e => {
                            field.onChange(e)
                            setValue('icon', e.target.value)
                          }}
                          sx={{ mt: 2 }}
                        />
                        <Grid item className='buttonAvatar' onClick={handleChooseFile}
                          sx={{ position: 'absolute', top: '35%', right: 3 }}
                        >
                          <ButtonsFab />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    value={editedData?.category_id || ''}
                    onChange={(e) => {
                      setEditedData(prev => ({
                        ...prev,
                        category_id: e.target.value
                      }) as Courses
                      )
                    }}
                    inputProps={{
                      name: 'category_id',
                      id: 'category',
                    }}
                  >
                    <MenuItem value='' disabled>{t('Select Category')}</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    value={editedData?.status || ''}
                    onChange={(e) => {
                      setEditedData(prev => ({
                        ...prev,
                        status: e.target.value
                      }) as Courses
                      )
                    }}
                    inputProps={{
                      name: 'status',
                      id: 'status',
                    }}
                  >
                    <MenuItem value='' disabled>{t('Select Status')}</MenuItem>
                    <MenuItem value="open">{t('open')}</MenuItem>
                    <MenuItem value="close">{t('close')}</MenuItem>
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
                saveEditedData(editedData, selectedFile!);
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
          <p>{t('Are you sure you want to delete this courses?')}</p>
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
