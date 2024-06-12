// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const VerifyEmailV1 = () => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src='/images/LogoFull.svg' alt='Logo' style={{ width: '10vw' }} />

              <Typography variant='h3' sx={{ ml: 2.5, fontWeight: 700 }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h4' sx={{ mb: 1.5 }}>
                Verify your email ✉️
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Account activation link sent to your email address: hello@example.com Please follow the link inside to
                continue.
              </Typography>
            </Box>
            <Button fullWidth variant='contained'>
              Skip for now
            </Button>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>Didn't get the mail?</Typography>
              <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
                Resend
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

VerifyEmailV1.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default VerifyEmailV1
