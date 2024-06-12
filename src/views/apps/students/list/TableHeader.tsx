// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { MenuItem } from '@mui/material'

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
  const { handleFilter, toggle, value } = props
  const { t } = useTranslation()

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
      <Typography variant='h5' flex={1} left={0}>
        {t('Students')}
      </Typography>

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
          <MenuItem value="username">{t('Username')}</MenuItem>
          <MenuItem value="email">{t('Email')}</MenuItem>
          <MenuItem value="birthday">{t('Birthday')}</MenuItem>
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
          placeholder={`${t('Search')} ${t('Student')}` ?? ''}
          onChange={e => handleFilter(e.target.value)}
        />

        <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          {t('Add New')}
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
