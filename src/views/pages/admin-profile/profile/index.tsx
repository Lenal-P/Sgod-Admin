// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Types
import AboutOverview from 'src/views/pages/admin-profile/profile/AboutOverivew'

const ProfileTab = () => {
  return (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverview />
      </Grid>
    </Grid>
  )
}

export default ProfileTab
