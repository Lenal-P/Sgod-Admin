import { useState, useEffect, useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import { useForm, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import CardActions from '@mui/material/CardActions'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import ButtonsFab from 'src/views/pages/admin-profile/components/ButtonsFab'
import { ProfileTabCommonType } from 'src/@fake-db/types'
import { UserDataType } from 'src/context/types'
import { CardHeader, Alert, AlertTitle, IconButton, FormControl } from '@mui/material'
import toast from 'react-hot-toast'
import AxiosInstance from 'src/configs/axios'
import adminPathName from 'src/configs/endpoints/admin';

interface State {
  newPassword: string
  showOldPassword: boolean
  showNewPassword: boolean
  confirmNewPassword: string
  showConfirmNewPassword: boolean
}

const renderList = (arr: ProfileTabCommonType[]) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 3 },
            '& svg': { color: 'text.secondary' },
            width: '100vw'
          }}
        >
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Icon fontSize='1.25rem' icon={item.icon} />
          </Box>

          <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {item.property.charAt(0).toUpperCase() + item.property.slice(1)}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
            </Typography>
          </Box>
        </Box>
      )
    })
  } else {
    return null
  }
}

const AboutOverview = () => {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const { t } = useTranslation()
  const [editedUserData, setEditedUserData] = useState<Partial<UserDataType> | null>(null);
  const { control, handleSubmit, setValue } = useForm()
  const [avatarUpdated, setAvatarUpdated] = useState(false);

  const { user, setUser } = useContext(AuthContext)

  const handleEditClickOpen = () => {
    setOpenEdit(true)
    const savedUserData = localStorage.getItem('userData')
    if (savedUserData) {
      setEditedUserData(JSON.parse(savedUserData))
    }
  }

  const handleEditClose = () => {
    setOpenEdit(false)
  }

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData()

      formData.append('file', file);

      await AxiosInstance.post(`${adminPathName.changeImageAdminEndpoint}`,
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      setAvatarUpdated(true);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  const handleChooseFile = async () => {
    try {
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.click()
      fileInput.addEventListener('change', async event => {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const binaryString = event.target?.result as string;
            setEditedUserData(prevUserData => ({
              ...prevUserData!,
              avatar: binaryString
            }));
            setValue('avatar', binaryString);
          };
          reader.readAsDataURL(file);
          await uploadAvatar(file)
        }
      })
    } catch (error) {
      console.error('Error choosing file:', error)
    }
  }


  const updateUserProfile = async (data: any) => {
    const filteredData = {
      name: {
        first_name: data.first_name,
        last_name: data.last_name
      },
      birthday: data.birthday,
      phone_number: data.phone_number,
      username: data.username
    };
    try {
      await AxiosInstance.put(`${adminPathName.putAdminEndpoint}`, filteredData);
      toast.success('Update Successfully')
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }

  }

  const onSubmit = async (data: any) => {
    if (data) {
      try {
        const updatedName = {
          first_name: data.first_name,
          last_name: data.last_name
        };
        const updatedBirthday = {
          birthday: editedUserData?.birthday
        };
        const updatedUser = {
          ...user,
          name: updatedName,
          ...data,
          ...updatedBirthday
        } as UserDataType;
        if (avatarUpdated) {
          toast.success('Avatar changed successfully!');
        }

        // Reset state
        setAvatarUpdated(false);
        setUser(updatedUser)
        handleEditClose()
        localStorage.setItem('userData', JSON.stringify(updatedUser))
        await updateUserProfile(updatedUser)

      } catch (error: any) {
        if (error && error.response) {
          toast.error(error.response.data.message)
        }
      }
    }
  }

  const onSubmitChangePassword = async (data: any) => {
    if (data) {
      const filteredData = {
        newPassword: data.newPassword,
        password: data.password,
        confirmNewPassword: data.confirmNewPassword
      };
      try {
        await AxiosInstance.post(
          `${adminPathName.changePassAdminEndpoint}`, filteredData)

        toast.success('Password changed successfully!')
      } catch (error: any) {
        if (error && error.response) {
          toast.error(error.response.data.message)
        }
      }
    }
  }

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData')
    if (savedUserData) {
      setEditedUserData(JSON.parse(savedUserData))
      setUser(JSON.parse(savedUserData))
    }
  }, [openEdit])

  // Password
  const [values, setValues] = useState<State>({
    newPassword: '',
    showOldPassword: false,
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false
  })
  const handleClickShowOldPassword = () => {
    setValues({ ...values, showOldPassword: !values.showOldPassword })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  return (
    <Grid container spacing={6}>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' },
          gap: 6,
          width: '100%'
        }}
      >
        <Grid item xs={12} sm={3}>
          <Card sx={{ height: '90%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant='body2' sx={{ mb: 3, color: 'text.disabled', textTransform: 'uppercase' }}>
                  {t('About')}
                </Typography>
                {renderList([
                  {
                    icon: 'mdi:person',
                    property: 'Full Name',
                    value:
                      `${editedUserData?.name?.first_name || t('Not Available')} ${editedUserData?.name?.last_name || ''}`
                  },
                  { icon: 'mdi:email', property: 'Email', value: editedUserData?.email || '' },
                  { icon: 'mdi:user-check', property: 'Username', value: editedUserData?.username || '' },
                  { icon: 'gridicons:phone', property: 'Phone Number', value: editedUserData?.phone_number || '' },
                  {
                    icon: 'mingcute:birthday-2-fill',
                    property: 'Birthday',
                    value: editedUserData?.birthday
                      ? typeof editedUserData.birthday === 'string'
                        ? editedUserData.birthday.slice(0, 10)
                        : editedUserData.birthday.toISOString().slice(0, 10)
                      : ''
                  },
                  { icon: 'eos-icons:cluster-role', property: 'Role', value: editedUserData?.role || '' }
                ])}
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button variant='contained' onClick={() => handleEditClickOpen()}>
                    {t('Edit')}
                  </Button>
                </CardActions>
              </Box>
            </CardContent>
          </Card>
          <Dialog
            open={openEdit}
            onClose={handleEditClose}
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
                onClick={handleEditClose}
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={8}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='first_name'
                      control={control}
                      defaultValue={user?.name?.first_name || ''}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label={t('First Name')}
                          placeholder='John Doe'
                          value={field.value}
                          onChange={e => {
                            field.onChange(e)
                            setValue('first_name', e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='last_name'
                      control={control}
                      defaultValue={user?.name?.last_name || ''}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label={t('Last Name')}
                          placeholder='John Doe'
                          value={field.value}
                          onChange={e => {
                            field.onChange(e)
                            setValue('last_name', e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='username'
                      control={control}
                      defaultValue={user?.username || ''}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label={t('Username')}
                          placeholder='John.Doe'
                          value={field.value}
                          onChange={e => {
                            field.onChange(e)
                            setValue('username', e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Controller
                        name='birthday'
                        control={control}
                        defaultValue={user?.birthday ? dayjs(user.birthday) : null}
                        render={() => (
                          <DatePicker
                            sx={{ height: '3.5rem' }}
                            label={t('Birthday')}
                            value={user?.birthday ? dayjs(user.birthday) : null}
                            onChange={(newValue) => {
                              if (newValue && typeof newValue.isValid === 'function') {
                                setEditedUserData({
                                  ...editedUserData,
                                  birthday: newValue.toISOString()
                                });
                              }
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='phone_number'
                      control={control}
                      defaultValue={user?.phone_number || ''}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label={t('Phone Number')}
                          placeholder='723-348-2344'
                          value={field.value}
                          onChange={e => {
                            field.onChange(e)

                            setValue('phone_number', e.target.value)
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='avatar'
                      control={control}
                      defaultValue={user?.avatar || ''}
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
                              label={t('Avatar')}
                              placeholder='/images/'
                              value={field.value}
                              onChange={e => {
                                field.onChange(e)
                                setValue('avatar', e.target.value)
                              }}
                            />
                            <Grid item className='buttonAvatar' onClick={handleChooseFile}
                              sx={{ position: 'absolute', top: 17, right: 0 }}
                            >
                              <ButtonsFab />
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
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
                  <Button variant='contained' type='submit'>
                    {t('Submit')}
                  </Button>
                  <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                    {t('Cancel')}
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Card sx={{ height: '90%' }}>
            <CardHeader title={t('Change Password')} />
            <CardContent>
              <Alert icon={false} severity='warning' sx={{ mb: 3 }}>
                <AlertTitle
                  sx={{ fontWeight: 500, fontSize: '1.125rem', mb: theme => `${theme.spacing(2.5)} !important` }}
                >
                  {t('Ensure That These Requirements Are Met')}
                </AlertTitle>
                {t('Minimum 8 Characters Long, Uppercase & Symbol')}
              </Alert>

              <form onSubmit={handleSubmit(onSubmitChangePassword)}>
                <Grid container spacing={6} sx={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
                  <Grid item xs={12} sm={12} sx={{ marginBottom: 0 }}>
                    <Controller
                      name='password'
                      control={control}
                      defaultValue=''
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label={t('Password')}
                          placeholder='············'
                          value={field.value}
                          onChange={field.onChange}
                          type={values.showOldPassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end' sx={{ suggested: 'current-password' }}>
                                <IconButton
                                  edge='end'
                                  onClick={handleClickShowOldPassword}
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                >
                                  <Icon
                                    fontSize='1.25rem'
                                    icon={values.showOldPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                  />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          sx={{ width: '100%' }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} sx={{ display: 'flex', gap: 3, marginBottom: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='newPassword'
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            label={t('New Password')}
                            placeholder='············'
                            value={field.value}
                            onChange={field.onChange}
                            type={values.showNewPassword ? 'text' : 'password'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end' sx={{ suggested: 'new-password' }}>
                                  <IconButton
                                    edge='end'
                                    onClick={handleClickShowNewPassword}
                                    onMouseDown={e => e.preventDefault()}
                                    aria-label='toggle password visibility'
                                  >
                                    <Icon
                                      fontSize='1.25rem'
                                      icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                    />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            sx={{ width: '100%' }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='confirmNewPassword'
                        control={control}
                        defaultValue={values.confirmNewPassword}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            placeholder='············'
                            label={`${t('Confirm')} ${t('New Password')}`}
                            value={field.value}
                            onChange={field.onChange}
                            type={values.showConfirmNewPassword ? 'text' : 'password'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end' sx={{ suggested: 'new-password' }}>
                                  <IconButton
                                    edge='end'
                                    onMouseDown={e => e.preventDefault()}
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowConfirmNewPassword}
                                  >
                                    <Icon
                                      fontSize='1.25rem'
                                      icon={values.showConfirmNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                    />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            sx={{ width: '100%' }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button type='submit' variant='contained'>
                      {t('Change Password')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AboutOverview
