// ** MUI Imports
import Box from '@mui/material/Box'

// ** Icon Imports
import { useSelector } from 'react-redux'
import BreadcrumbRouter from 'src/pages/components/Breadcrumb'

const TableHeaderDetail = () => {
  // ** Props
  const breacumbData = useSelector((state: any) => state.breadcrumbsData.data)

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
    </Box>
  )
}

export default TableHeaderDetail
