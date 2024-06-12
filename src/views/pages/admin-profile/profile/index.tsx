// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Types
import { ProfileTabType } from 'src/@fake-db/types'
import AboutOverview from 'src/views/pages/admin-profile/profile/AboutOverivew'

const ProfileTab = ({ data }: { data: ProfileTabType }) => {

  return data && Object.values(data).length ? (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverview />
      </Grid>
    </Grid>
  ) : null
}

export default ProfileTab
