// ** React Imports
import { useState, useEffect, MouseEvent, forwardRef, FC } from 'react'
import { useTranslation } from 'react-i18next'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteInvoice } from 'src/store/apps/breadcrumbs'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Actions Imports
import { deleteUser } from 'src/store/apps/students'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/courses/list/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Tooltip from '@mui/material/Tooltip'

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: InvoiceType
}

// ** Styled component for the link in the dataTable
export const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'tabler:circle-check' },
  Paid: { color: 'success', icon: 'tabler:circle-half-2' },
  Draft: { color: 'primary', icon: 'tabler:device-floppy' },
  'Partial Payment': { color: 'warning', icon: 'tabler:chart-pie' },
  'Past Due': { color: 'error', icon: 'tabler:alert-circle' },
  Downloaded: { color: 'info', icon: 'tabler:arrow-down-circle' }
}

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <CustomTextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()

  const handleDelete = () => {
    dispatch(deleteUser(id))
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Tooltip title={t('View')}>
        <IconButton size='small' component={Link} sx={{ color: 'text.secondary' }} href={`/apps/invoice/preview/${id}`}>
          <Icon icon='tabler:eye' />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('Edit')}>
        <IconButton size='small' component={Link} sx={{ color: 'text.secondary' }} href={`/apps/invoice/edit/${id}`}>
          <Icon icon='tabler:edit' />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('Delete')}>
        <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => dispatch(handleDelete)}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

const InvoiceList: FC<any> = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.invoice)
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        q: value,
        status: statusValue
      })
    )
  }, [dispatch, statusValue, value, dates])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const handleStatusValue = (e: SelectChangeEvent<unknown>) => {
    setStatusValue(e.target.value as string)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const columns: GridColDef[] = [
    {
      flex: 1,
      minWidth: 100,
      field: 'idCategory',
      headerName: `${t('Category Name')}`,
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {row.name}
        </Typography>
      )
    },
    {
      flex: 1,
      minWidth: 100,
      field: 'name',
      headerName: `${t('Courses Name')}`,
      renderCell: ({ row }: CellType) => {
        const { name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 1,
      minWidth: 100,
      field: 'issuedDate',
      headerName: `${t('Issued Date')}`,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.issuedDate}</Typography>
    },
    {
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: `${t('Actions')}`,
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
    }
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />
            <CardHeader title={t('Courses')} />
            <DataGrid
              autoHeight
              rowHeight={62}
              rows={store.data}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )

}

export default InvoiceList
