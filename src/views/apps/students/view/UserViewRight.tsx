// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTab, { TabProps } from '@mui/material/Tab'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import UserViewAccount from 'src/views/apps/students/view/UserViewAccount'
import UserViewSecurity from 'src/views/apps/students/view/UserViewSecurity'
// import UserViewConnection from 'src/views/apps/students/view/UserViewConnection'
// import UserViewNotification from 'src/views/apps/students/view/UserViewNotification'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

interface Props {
  tab: string
  invoiceData: InvoiceType[]
}

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5)
  }
}))

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const UserViewRight = ({ tab, invoiceData }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // ** Hooks
  const router = useRouter()

  //Translate
  const { t } = useTranslation()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/apps/students/view/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  useEffect(() => {
    if (invoiceData) {
      setIsLoading(false)
    }
  }, [invoiceData])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='account' label={t('Account')} icon={<Icon fontSize='1.125rem' icon='tabler:user-check' />} />
        <Tab value='security' label={t('Security')} icon={<Icon fontSize='1.125rem' icon='tabler:lock' />} />
        {/* <Tab value='notification' label={t('Notifications')} icon={<Icon fontSize='1.125rem' icon='tabler:bell' />} />
        <Tab value='connection' label={t('Connection')} icon={<Icon fontSize='1.125rem' icon='tabler:link' />} /> */}
      </TabList>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>{t('Loading')}...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value='account'>
              <UserViewAccount invoiceData={invoiceData} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='security'>
              <UserViewSecurity />
            </TabPanel>
            {/* <TabPanel sx={{ p: 0 }} value='notification'>
              <UserViewNotification />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='connection'>
              <UserViewConnection />
            </TabPanel> */}
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default UserViewRight