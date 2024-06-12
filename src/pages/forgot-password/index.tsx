// ** React Imports
import { ReactNode, useContext, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import adminPathName from 'src/configs/endpoints/admin';
import { useTranslation } from 'react-i18next'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import AxiosInstance from 'src/configs/axios';
import { useForm } from 'react-hook-form';
import type { ForgotPass } from 'src/context/types';
import { useRouter } from 'next/router';

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  // const [email, setEmail] = useState('')
  // const [otp, setOtp] = useState('')
  // const [newPassword, setNewPassword] = useState('')
  // const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [resetStep, setResetStep] = useState(1)
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { register, handleSubmit } = useForm();
  const { t } = useTranslation()

  // ** Context
  const router = useRouter()

  // ** Function to handle sending OTP
  const handleSendOTP = async (e: ForgotPass) => {
    const filteredData = {
      email: e.email,
    };
    try {
      const response = await AxiosInstance.post(`${adminPathName.forgotStep1Endpoint}`, filteredData)
      if (response.status === 201) {
        // Phản hồi thành công từ API, chuyển người dùng sang bước tiếp theo
        setResetStep(2)
      } else {
        // Xử lý phản hồi khi yêu cầu không thành công
        console.error('Failed to send OTP')
      }
    } catch (error) {
      // Xử lý lỗi mạng
      console.error('Network error:', error)
    }
  }

  // ** Function to handle verifying OTP
  const handleVerifyOTP = async (e: ForgotPass) => {
    const filteredData = {
      email: e.email,
      otp: e.otp
    };
    try {
      const response = await AxiosInstance.post(`${adminPathName.forgotStep2Endpoint}`, filteredData)
      if (response.status === 201) {
        setResetStep(3)
      } else {
        // Handle error response
        console.error('Failed to verify OTP')
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error)
    }
  }

  // ** Function to handle resetting password
  const handleResetPassword = async (e: any) => {
    const filteredData = {
      email: e.email,
      otp: e.otp,
      newPassword: e.newPassword,
      confirmNewPassword: e.confirmNewPassword
    };
    try {
      const response = await AxiosInstance.post(`${adminPathName.forgotStep3Endpoint}`, filteredData)
      if (response.status === 201) {
        // await login(e.email, e.newPassword);
        router.replace('/')
      } else {
        console.error('Failed to reset password')
      }
    } catch (error) {
      console.error('Network error:', error)
    }
  }

  const onSubmitStep1 = async (data: any) => {
    await handleSendOTP(data);
  };

  const onSubmitStep2 = async (data: any) => {
    await handleVerifyOTP(data);
  };

  const onSubmitStep3 = async (data: any) => {
    await handleResetPassword(data);
  };


  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <ForgotPasswordIllustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <img src='/images/LogoFull.svg' alt='Logo' style={{ width: '10vw' }} />

            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                {/* {resetStep === 1 ? t('Forgot Password?') 🔒 : resetStep === 2 ? {t('Verify OTP')} : {t('Reset Password')}} */}
                {resetStep === 1 ? t('Forgot Password?') : resetStep === 2 ? t('Verify OTP') : t('Reset Password')}
              </Typography>
              {resetStep === 1 ? (
                <Typography sx={{ color: 'text.secondary' }}>
                  {t('Enter your email and we will send you instructions to reset your password')}
                </Typography>
              ) : resetStep === 2 ? (
                <Typography sx={{ color: 'text.secondary' }}>{t('Enter the OTP sent to your email')}</Typography>
              ) : (
                <Typography sx={{ color: 'text.secondary' }}>{t('Enter your new password')}</Typography>
              )}
            </Box>
            {resetStep === 1 ? (
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmitStep1)}>
                <CustomTextField
                  fullWidth
                  autoFocus
                  type='email'
                  label='Email'
                  {...register('email')}
                  sx={{ display: 'flex', mb: 4 }}
                />
                <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                  {t('Send reset link')}
                </Button>
              </form>
            ) : resetStep === 2 ? (
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmitStep2)}>
                <CustomTextField
                  fullWidth
                  autoFocus
                  type='text'
                  label='OTP'
                  {...register('otp')}
                  sx={{ display: 'flex', mb: 4 }}
                />
                <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                  {t('Verify OTP')}
                </Button>
              </form>
            ) : (
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmitStep3)}>
                <CustomTextField
                  fullWidth
                  autoFocus
                  type='password'
                  label='New Password'
                  {...register('newPassword')}
                  sx={{ display: 'flex', mb: 4 }}
                />
                <CustomTextField
                  fullWidth
                  type='password'
                  label='Confirm New Password'
                  {...register('confirmNewPassword')}
                  sx={{ display: 'flex', mb: 4 }}
                />
                <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                  {t('Reset Password')}
                </Button>
              </form>
            )}
            {resetStep !== 1 && (
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>{t('Back to login')}</span>
                </LinkStyled>
              </Typography>
            )}
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPassword.guestGuard = true

export default ForgotPassword
