// src/view/pages/apps/students/view/account/index.tsx
import React from 'react'
import Grid from '@mui/material/Grid'
import UserViewLeft from 'src/views/apps/students/view/UserViewLeft'
import UserViewRight from 'src/views/apps/students/view/UserViewRight'
import { UserDataType } from 'src/context/types'

type Props = {
  tab: string
  invoiceData: UserDataType[]
}

const UserView = ({ tab, invoiceData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        {/* <UserViewRight tab={tab} invoiceData={invoiceData} /> */}
      </Grid>
    </Grid>
  )
}

export default UserView
