// ** MUI Imports
import Box from '@mui/material/Box'

// ** Custom Component Import
import BreadcrumbRouter from 'src/pages/components/Breadcrumb'

// ** Icon Imports
import { useSelector } from 'react-redux'

const TableHeaderBreadcrumb = () => {
  // ** Props
  const breacumbData = useSelector((state: any) => state.breadcrumbsData.data)

  return (
    <Box
      sx={{
        padding: 6,
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

export default TableHeaderBreadcrumb
