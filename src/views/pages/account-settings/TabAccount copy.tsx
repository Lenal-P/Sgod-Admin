// ** React Imports
import { useState, ElementType, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Button, { ButtonProps } from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { UserDataType } from 'src/context/types'

interface Data {
  fullName: string;
  avatar: string;
  id: string;
  role: string;
  email: string;
  last_name: string;
  first_name: string;
  username: string;
  password: string;
  birthday: Date | null;
  phone_number: string;
}


const initialData: Data = {
  fullName: 'string',
  avatar: 'string',
  id: 'string',
  role: 'string',
  email: 'string',
  last_name: 'string',
  first_name: 'string',
  username: 'string',
  password: 'string',
  birthday: new Date('2000-10-10'),
  phone_number: 'string'
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

const TabAccount = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<Data>(initialData)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/15.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  const [birthDay, setBirthDay] = useState(new Date())

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { checkbox: false, birthday: null } // Thêm trường birthday vào defaultValues
  });

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const onSubmit = () => setOpen(true)

  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/15.png')
  }

  let handleDateChange = (date: Date) => {
    setBirthDay(date)
  }

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    if (field === 'birthday') {
      if (typeof value === 'string') {
        setBirthDay(new Date(value));
      } else {
        setBirthDay(new Date(''));
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };



  const { t } = useTranslation()

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        {/* Account Details Card */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Profile Details' />
            <form>
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={imgSrc} alt='Profile Pic' />
                  <div>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      Upload New Photo
                      <input
                        hidden
                        type='file'
                        value={inputValue}
                        accept='image/png, image/jpeg'
                        onChange={handleInputImageChange}
                        id='account-settings-upload-image'
                      />
                    </ButtonStyled>
                    <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                      Reset
                    </ResetButtonStyled>
                    <Typography sx={{ mt: 4, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
                  </div>
                </Box>
              </CardContent>
              <Divider />
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='First Name'
                      placeholder='John'
                      value={formData.first_name}
                      onChange={e => handleFormChange('first_name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Last Name'
                      placeholder='Doe'
                      value={formData.last_name}
                      onChange={e => handleFormChange('last_name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      type='email'
                      label='Email'
                      value={formData.email}
                      placeholder='john.doe@example.com'
                      onChange={e => handleFormChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      label='Phone Number'
                      value={formData.phone_number}
                      placeholder='202 555 0111'
                      onChange={e => handleFormChange('phone_number', e.target.value)}
                      InputProps={{ startAdornment: <InputAdornment position='start'>US (+1)</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <label htmlFor='birthDayController' style={{ fontSize: '13px' }}>
                        {t('Birthday')}
                      </label>
                      <Controller
                        name='birthday'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            selected={value}
                            onChange={onChange}
                            dateFormat='MM/dd/yyyy'
                            className='birthDayForm'
                            aria-labelledby='birthDayController'
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                    <Button variant='contained' sx={{ mr: 4 }}>
                      Save Changes
                    </Button>
                    <Button type='reset' variant='tonal' color='secondary' onClick={() => setFormData(initialData)}>
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </form>
          </Card>
        </Grid>

        {/* Delete Account Card */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Delete Account' />
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 4 }}>
                  <FormControl>
                    <Controller
                      name='checkbox'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControlLabel
                          label='I confirm my account deactivation'
                          sx={{ '& .MuiTypography-root': { color: errors.checkbox ? 'error.main' : 'text.secondary' } }}
                          control={
                            <Checkbox
                              {...field}
                              size='small'
                              name='validation-basic-checkbox'
                              sx={errors.checkbox ? { color: 'error.main' } : null}
                            />
                          }
                        />
                      )}
                    />
                    {errors.checkbox && (
                      <FormHelperText
                        id='validation-basic-checkbox'
                        sx={{ mx: 0, color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}
                      >
                        Please confirm you want to delete account
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <Button variant='contained' color='error' type='submit' disabled={errors.checkbox !== undefined}>
                  Deactivate Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Deactivate Account Dialogs */}
        <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(6)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Box
              sx={{
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                '& svg': { mb: 6, color: 'warning.main' }
              }}
            >
              <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
              <Typography>Are you sure you would like to cancel your subscription?</Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
              Yes
            </Button>
            <Button variant='tonal' color='secondary' onClick={() => handleConfirmation('cancel')}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(6)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                '& svg': {
                  mb: 8,
                  color: userInput === 'yes' ? 'success.main' : 'error.main'
                }
              }}
            >
              <Icon fontSize='5.5rem' icon={userInput === 'yes' ? 'tabler:circle-check' : 'tabler:circle-x'} />
              <Typography variant='h4' sx={{ mb: 5 }}>
                {userInput === 'yes' ? 'Deleted!' : 'Cancelled'}
              </Typography>
              <Typography>
                {userInput === 'yes' ? 'Your subscription cancelled successfully.' : 'Unsubscription Cancelled!!'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </DatePickerWrapper>
  )
}

export default TabAccount
