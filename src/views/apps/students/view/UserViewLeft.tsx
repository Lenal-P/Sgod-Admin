// ** React Imports
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserSuspendDialog from 'src/views/apps/students/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/students/view/UserSubscriptionDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { UserDataType } from 'src/context/types'
import AxiosInstance from 'src/configs/axios'
import getDataById from 'src/pages/apps/action/ActionsUser'
import toast from 'react-hot-toast'
interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  admin: 'warning',
  student: 'success',
  teacher: 'info'
}

const statusColors: ColorsType = {
  active: 'success',
  inactive: 'secondary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: 0,
  left: -10,
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')(({ theme }) => ({
  alignSelf: 'flex-end',
  color: theme.palette.text.disabled,
  fontSize: theme.typography.body1.fontSize
}))

const UserViewLeft = () => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openPlans, setOpenPlans] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserDataType | null>(null);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)

  //Translate
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData) {
          const response = await AxiosInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${userData._id}`);
          setUserData(response.data);
        }
      } catch (error: any) {
        if (error && error.response) {
          toast.error(error.response.data.message)
        }
      }
    };

    fetchData()
  }, [userData?._id])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {userData?.avatar ? (
              <CustomAvatar
                src={userData?.avatar}
                variant='rounded'
                alt={userData?.name?.first_name}
                sx={{ width: 100, height: 100, mb: 4 }}
              />
            ) : (
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={userData?.avatar as ThemeColor}
                sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
              >
                {/* {getInitials(userData?.username)} */}
              </CustomAvatar>
            )}
            <Typography variant='h4' sx={{ mb: 3 }}>
              {userData ? userData.name?.first_name : ''}
            </Typography>
            <CustomChip
              rounded
              skin='light'
              size='small'
              label={userData?.role}
              sx={{ textTransform: 'capitalize' }}
            />
          </CardContent>

          <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
                <CustomAvatar skin='light' variant='rounded' sx={{ width: 38, height: 38 }}>
                  <Icon fontSize='1.75rem' icon='tabler:checkbox' />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>
                    {t('Courses')} {t('Done')}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>30</Typography>
                </div>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
                <CustomAvatar skin='light' variant='rounded' sx={{ width: 38, height: 38 }}>
                  <Icon fontSize='1.75rem' icon='tabler:checkbox' />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>
                    {t('Quiz')} {t('Done')}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>23</Typography>
                </div>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
                <CustomAvatar skin='light' variant='rounded' sx={{ width: 38, height: 38 }}>
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
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Full Name')}:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{userData?.fullName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Birthday')}:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {userData?.birthday instanceof Date || typeof userData?.birthday === 'string'
                    ? new Date(userData?.birthday).toISOString().slice(0, 10) // Chuyển đổi sang Date trước khi gọi toISOString()
                    : ''}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Phone Number')}:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{userData?.phone_number}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Username')}:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{userData?.username}</Typography>
              </Box>
              {/* -------------------------------------- */}
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Email')}:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{userData?.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Role')}:</Typography>
                <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{userData?.role}</Typography>
              </Box>
            </Box>
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
              {t('Edit')}
            </Button>
            <Button color='error' variant='tonal' onClick={() => setSuspendDialogOpen(true)}>
              {t('Suspend')}
            </Button>
          </CardActions>

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
              <form>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label={t('Full Name')}
                      placeholder='John Doe'
                      defaultValue={userData?.name?.first_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label={t('Username')}
                      placeholder='John.Doe'
                      defaultValue={userData?.username}
                      InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label={t('Birthday')}
                      placeholder='month-day-year'
                      defaultValue={userData?.birthday}
                      InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField fullWidth label={t('Courses')} defaultValue='8894' placeholder='Tax-8894' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label={t('Phone Number')}
                      placeholder='723-348-2344'
                      defaultValue={`+1 ${userData?.phone_number}`}
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClose}>
                {t('Submit')}
              </Button>
              <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                {t('Cancel')}
              </Button>
            </DialogActions>
          </Dialog>

          <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
          <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewLeft
