// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { MenuItem } from '@mui/material'
import BreadcrumbRouter from 'src/pages/components/Breadcrumb'
import { useSelector } from 'react-redux'
import Link from 'next/link'

interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
  sortValue: string;
  sortType: string;
  handleSortValueChange: (val: string) => void;
  handleSortTypeChange: (val: string) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value } = props
  const { t } = useTranslation()
  const breacumbData = useSelector((state: any) => state.breadcrumbsData.data)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilter(e.target.value)
  };

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
          <MenuItem value="title">{t('Title')}</MenuItem>
          <MenuItem value="owner">{t('Owner')}</MenuItem>
          <MenuItem value="is_share">{t('Status Share')}</MenuItem>
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
          sx={{ mr: 4 }}
          placeholder={`${t('Search')} ${t('Question Store')}` ?? ''}
          onChange={handleChange}
        />
        <Link href={`/apps/storeQuizQuestion/create`} passHref>
          <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            {t('Add New')}
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default TableHeader
