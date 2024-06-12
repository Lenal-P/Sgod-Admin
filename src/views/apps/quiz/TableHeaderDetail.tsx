// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import BreadcrumbRouter from 'src/pages/components/Breadcrumb'

interface TableHeaderDetailProps {
  value: string;
  handleFilter: (val: string) => void;
  selectedQuizStoreName: string;
  setSelectedQuizStoreName: (name: string) => void;
  toggleAdd: () => void
  toggleDelete: () => void
  idOwner: string;
  deleteCount: number
}

const TableHeaderDetail = (props: TableHeaderDetailProps) => {
  // ** Props
  const { handleFilter, value, toggleDelete, idOwner, deleteCount } = props;
  const { t } = useTranslation()
  const breacumbData = useSelector((state: any) => state.breadcrumbsData.data)

  const user = localStorage.getItem('userData')
  const userData = user ? JSON.parse(user) : null

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'end',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbRouter
          breacumbData={breacumbData}
        />
      </Box>
      <Box sx={{ gap: 4, rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 3 }}
          placeholder={`${t('Search')} ${t('Students')}` ?? ''}
          onChange={e => handleFilter(e.target.value)}
        />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Link href={`/apps/storeQuizQuestion/create`} passHref>
            <Button component="a" variant="contained" color="primary">
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              {t('Add New')}
            </Button>
          </Link>
          <Button disabled={userData._id !== idOwner || deleteCount < 1} onClick={toggleDelete} variant='contained' sx={{ '& svg': { mx: 1 } }}>
            <Icon fontSize='1.125rem' icon='tabler:trash' />
            {t('Delete')}: {deleteCount}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default TableHeaderDetail
