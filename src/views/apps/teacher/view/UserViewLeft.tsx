// ** React Imports
import { useState } from 'react'
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
import UserSuspendDialog from 'src/views/apps/teacher/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/teacher/view/UserSubscriptionDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

interface ColorsType {
  [key: string]: ThemeColor
}

let data: UsersType = {
  firstName: 'Giao',
  lastName: 'Vien',
  birthDay: new Date('10-10-2000'),
  codeAccount: 'gtvtk20',
  contact: '(479) 232-9151',
  email: 'gslixby0@abc.net.au',
  username: 'gslixby0',
  avatarColor: 'primary',
  role: 'teacher',
  id: 1,
  status: 'active',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  billing: 'Manual - Cash',
  currentPlan: 'enterprise',
  fullName: '',
  avatar: '/images/avatars/14.png'
}

// Update FullName
data.fullName = `${data.firstName} ${data.lastName}`

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
  
  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)
  
  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)
  
  //Translate
  const { t } = useTranslation()

  const testObject = [{}]

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {data.avatar ? (
                <CustomAvatar
                  src={data.avatar}
                  variant='rounded'
                  alt={data.fullName}
                  sx={{ width: 100, height: 100, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor as ThemeColor}
                  sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(data.fullName)}
                </CustomAvatar>
              )}
              <Typography variant='h4' sx={{ mb: 3 }}>
                {data.fullName}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={data.role}
                color={roleColors[data.role]}
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
                  <Typography sx={{ color: 'text.secondary' }}>{data.fullName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Birthday')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {data.birthDay ? data.birthDay.toLocaleDateString() : t('N/A')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Courses')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>8888</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Phone Number')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>+1 {data.contact}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Username')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>@{data.username}</Typography>
                </Box>
                {/* -------------------------------------- */}
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Email')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Status')}:</Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={data.status}
                    color={statusColors[data.status]}
                    sx={{
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Role')}:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{data.role}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Language')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>English</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('Country')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data.country}</Typography>
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
                        defaultValue={data.fullName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label={t('Username')}
                        placeholder='John.Doe'
                        defaultValue={data.username}
                        InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label={t('Birthday')}
                        placeholder='month-day-year'
                        defaultValue={data.birthDay}
                        InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField select fullWidth label={t('Status')} defaultValue={data.status}>
                        <MenuItem value='active'>{t('Active')}</MenuItem>
                        <MenuItem value='inactive'>{t('Inactive')}</MenuItem>
                      </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField fullWidth label={t('Courses')} defaultValue='8894' placeholder='Tax-8894' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label={t('Phone Number')}
                        placeholder='723-348-2344'
                        defaultValue={`+1 ${data.contact}`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField select fullWidth label={t('Language')} defaultValue='English'>
                        <MenuItem value='English'>English</MenuItem>
                        <MenuItem value='Vietnam'>Vietnam</MenuItem>
                        <MenuItem value='Spanish'>Spanish</MenuItem>
                        <MenuItem value='Portuguese'>Portuguese</MenuItem>
                        <MenuItem value='Russian'>Russian</MenuItem>
                        <MenuItem value='French'>French</MenuItem>
                        <MenuItem value='German'>German</MenuItem>
                      </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField select fullWidth label={t('Country')} defaultValue='USA'>
                        <MenuItem value='USA'>USA</MenuItem>
                        <MenuItem value='Vietnam'>Vietnam</MenuItem>
                        <MenuItem value='UK'>UK</MenuItem>
                        <MenuItem value='Spain'>Spain</MenuItem>
                        <MenuItem value='Russia'>Russia</MenuItem>
                        <MenuItem value='France'>France</MenuItem>
                        <MenuItem value='Germany'>Germany</MenuItem>
                      </CustomTextField>
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
  } else {
    return null
  }
}

export default UserViewLeft
