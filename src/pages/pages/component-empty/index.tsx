// ** React Imports
import { ChangeEvent, forwardRef, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

interface State {
  password: string
  showPassword: boolean
}

interface FormInputs {
  dob: DateType
  email: string
  radio: string
  select: string
  lastName: string
  password: string
  textarea: string
  checkbox: boolean
  title: string
  total_time: number
}

interface CustomInputProps {
  value: DateType
  label: string
  error: boolean
  onChange: (event: ChangeEvent) => void
}

const defaultValues = {
  dob: null,
  email: '',
  radio: '',
  select: '',
  lastName: '',
  password: '',
  textarea: '',
  title: '',
  total_time: 0,
  checkbox: false
}

const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
  return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const FormValidationBasic = () => {
  // ** States
  const [state, setState] = useState<State>({
    password: '',
    showPassword: false
  })

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }

  const onSubmit = () => toast.success('Form Submitted')

  return (
    <Card sx={{ border: "1px solid red" }} >
      <CardHeader title='Basic' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={12}>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Tiêu đề'
                    onChange={onChange}
                    placeholder='Nhập tiêu đề'
                    error={Boolean(errors.title)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.title && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='total_time'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Total Time'
                    type="number"
                    onChange={onChange}
                    placeholder='Nhập số phút...'
                    error={Boolean(errors.total_time)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.total_time && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Last Name'
                    onChange={onChange}
                    placeholder='Carter'
                    error={Boolean(errors.lastName)}
                    aria-describedby='validation-basic-last-name'
                    {...(errors.lastName && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='email'
                    value={value}
                    label='Email'
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='carterleonard@gmail.com'
                    aria-describedby='validation-basic-email'
                    {...(errors.email && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Password'
                    onChange={onChange}
                    id='validation-basic-password'
                    error={Boolean(errors.password)}
                    type={state.showPassword ? 'text' : 'password'}
                    {...(errors.password && { helperText: 'This field is required' })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon fontSize='1.25rem' icon={state.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='dob'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    selected={value}
                    showYearDropdown
                    showMonthDropdown
                    onChange={e => onChange(e)}
                    placeholderText='MM/DD/YYYY'
                    customInput={
                      <CustomInput
                        value={value}
                        onChange={onChange}
                        label='Date of Birth'
                        error={Boolean(errors.dob)}
                        aria-describedby='validation-basic-dob'
                        {...(errors.dob && { helperText: 'This field is required' })}
                      />
                    }
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='select'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label='Country'
                    SelectProps={{
                      value: value,
                      onChange: e => onChange(e)
                    }}
                    id='validation-basic-select'
                    error={Boolean(errors.select)}
                    aria-describedby='validation-basic-select'
                    {...(errors.select && { helperText: 'This field is required' })}
                  >
                    <MenuItem value='UK'>UK</MenuItem>
                    <MenuItem value='USA'>USA</MenuItem>
                    <MenuItem value='Australia'>Australia</MenuItem>
                    <MenuItem value='Germany'>Germany</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='textarea'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    rows={4}
                    fullWidth
                    multiline
                    {...field}
                    label='Bio'
                    error={Boolean(errors.textarea)}
                    aria-describedby='validation-basic-textarea'
                    {...(errors.textarea && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl error={Boolean(errors.radio)}>
                <FormLabel>Gender</FormLabel>
                <Controller
                  name='radio'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label='gender' name='validation-basic-radio'>
                      <FormControlLabel
                        value='female'
                        label='Female'
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value='male'
                        label='Male'
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value='other'
                        label='Other'
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.radio && (
                  <FormHelperText
                    id='validation-basic-radio'
                    sx={{ mx: 0, color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}
                  >
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
              <FormControl>
                <Controller
                  name='checkbox'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControlLabel
                      label='Agree to our terms and conditions'
                      sx={errors.checkbox ? { color: 'error.main' } : null}
                      control={
                        <Checkbox
                          {...field}
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
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormValidationBasic
