// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Component Imports
import UsersInvoiceListTable from 'src/views/apps/teacher/view/UsersInvoiceListTable'

interface Props {
  invoiceData: InvoiceType[]
}

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root:before': {
    display: 'none'
  }
})

const UserViewAccount = ({ invoiceData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UsersInvoiceListTable invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default UserViewAccount
