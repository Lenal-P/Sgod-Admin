// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useContext } from 'react'
import { MenuItem } from '@mui/material'
import BreadcrumbRouter from 'src/pages/components/Breadcrumb'
import { useSelector } from 'react-redux'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
  sortValue: string;
  sortType: string;
  handleSortValueChange: (val: string) => void;
  handleSortTypeChange: (val: string) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props
  const { t } = useTranslation()
  const ability = useContext(AbilityContext)
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
        justifyContent: 'end'
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbRouter
          breacumbData={breacumbData}
        />
      </Box>
      <Box sx={{ gap: 4, rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          select
          defaultValue=''
          value={props.sortValue}
          SelectProps={{
            displayEmpty: true,
            onChange: (event) => {
              event.preventDefault();
              props.handleSortValueChange(event.target.value as string);
            }
          }}
        >
          <MenuItem disabled value=''>{('Sort Value')}</MenuItem>
          <MenuItem value="name">{t('Courses')}</MenuItem>
          <MenuItem value="status">{t('Status')}</MenuItem>
        </CustomTextField>
        <CustomTextField
          select
          defaultValue=''
          value={props.sortType}
          SelectProps={{
            displayEmpty: true,
            onChange: (event) => {
              event.preventDefault();
              props.handleSortTypeChange(event.target.value as string);
            }
          }}
        >
          <MenuItem disabled value=''>{('Sort Type')}</MenuItem>
          <MenuItem value="asc">{t('Ascending')}</MenuItem>
          <MenuItem value="desc">{t('Descending')}</MenuItem>
        </CustomTextField>
        <CustomTextField
          value={value}
          sx={{ mr: 3 }}
          placeholder={`${t('Search')} ${t('Courses')}` ?? ''}
          onChange={e => handleFilter(e.target.value)}
        />
        {ability?.can('manage', 'all') ? (
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button onClick={toggle} variant='contained' sx={{ '& svg': { mx: 1 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              {t('Add Courses')}
            </Button>
          </Box>
        ) :
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button disabled onClick={toggle} variant='contained' sx={{ '& svg': { mx: 1 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              {t('Add Courses')}
            </Button>
          </Box>
        }
      </Box>
    </Box>
  )
}

export default TableHeader
