// ** React Imports
import { useContext } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { AuthContext } from 'src/context/AuthContext'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UserProfileHeader = () => {
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)

  return (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        src='/images/pages/profile-banner.png'
        sx={{
          height: { xs: 150, md: 250 }
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <ProfilePicture src={user?.avatar || '/images/avatars/1.png'} alt='profile-picture'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = '/images/avatars/6.png';
          }} />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2.5 }}>
              {[user?.name?.first_name, user?.name?.last_name].filter(Boolean).join(' ')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Icon fontSize='1.25rem' icon='grommet-icons:user-admin' />
              <Box
                sx={{
                  mr: 4,
                  display: 'flex',
                  mx: 2,
                  alignItems: 'center',
                  '& svg': { mr: 1.5, color: 'text.secondary' }
                }}
              >
                {user?.role ? `${t(user?.role.charAt(0).toUpperCase() + user?.role.slice(1))}` : ''}
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader

