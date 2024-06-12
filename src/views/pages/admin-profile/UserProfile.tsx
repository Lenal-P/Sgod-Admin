// ** React Imports
import { useState, useEffect, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI Components
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import CircularProgress from '@mui/material/CircularProgress'

// ** Type Import
import {
  TeamsTabType,
  ProfileTabType,
  ProjectsTabType,
  ConnectionsTabType,
  UserProfileActiveTab
} from 'src/@fake-db/types'

// ** Demo Components
import Teams from 'src/views/pages/admin-profile/teams'
import Profile from 'src/views/pages/admin-profile/profile'
import Projects from 'src/views/pages/admin-profile/projects'
import Connections from 'src/views/pages/admin-profile/connections'
import UserProfileHeader from 'src/views/pages/admin-profile/UserProfileHeader'

const UserProfile = ({ tab, data }: { tab: string; data: UserProfileActiveTab }) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const storedUserData = localStorage.getItem('userData')
  const userData = storedUserData ? JSON.parse(storedUserData) : null
  const { t } = useTranslation()

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const tabContentList: { [key: string]: ReactElement } = {
    profile: <Profile data={userData as ProfileTabType} />,
    teams: <Teams data={data as TeamsTabType[]} />,
    projects: <Projects data={data as ProjectsTabType[]} />,
    connections: <Connections data={data as ConnectionsTabType[]} />
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                {isLoading ? (
                  <div>
                    <CircularProgress />
                    <p>{t('Loading')}...</p>
                  </div>
                ) : (
                  <TabPanel value={activeTab}>{tabContentList[activeTab]}</TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
    </Grid>
  )
}

export default UserProfile
