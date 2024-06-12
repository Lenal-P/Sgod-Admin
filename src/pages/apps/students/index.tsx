// ** React Imports
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

// ** Next Imports
import { GetStaticProps } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Third Party Components
import AxiosInstance from 'src/configs/axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/students/list/TableHeader'
import AddUserDrawer from 'src/views/apps/students/list/AddUserDrawer'
import { UserDataType } from 'src/context/types'
import Actions from 'src/pages/apps/action/ActionsUser'
import adminPathName from 'src/configs/endpoints/admin';
import toast from 'react-hot-toast'

interface CellType {
  row: UserDataType
}

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 })
  const [userData, setUserData] = useState<UserDataType[]>([])
  const searchQuery = encodeURIComponent(value);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [sortValue, setSortValue] = useState<string>('email');
  const [sortType, setSortType] = useState<string>('asc');
  const fetchDataList = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.listStudentEndpoint}&page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}&search=${searchQuery}&sort=${sortValue}:${sortType}`);
      const dataWithIds = response.data.data.map((user: any, index: any) => ({
        ...user,
        id: index.toString()
      }));
      setUserData(dataWithIds)
      setTotalCategories(response.data.total);
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  };

  useEffect(() => {
    fetchDataList();
  }, [paginationModel.page, paginationModel.pageSize, searchQuery, sortValue, sortType]);

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleSortValueChange = useCallback((val: string) => {
    setSortValue(val);
  }, []);

  const handleSortTypeChange = useCallback((val: string) => {
    setSortType(val);
  }, []);

  // ** Render Action Buttons
  const RowOptions = ({ row }: { row: UserDataType }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Actions row={row} setUserData={setUserData} fetchDataList={fetchDataList} />
      </Box>
    );
  };

  const renderClient = (row: UserDataType) => {
    if (row.avatar && row.avatar.length) {
      return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return <CustomAvatar src='/' sx={{ mr: 2.5, width: 38, height: 38 }} />;
    }
  }

  const columns = (): GridColDef[] => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useTranslation()

    return [
      {
        flex: 1,
        minWidth: 100,
        field: 'fullName',
        sortable: false,
        headerName: `${t('Full Name')}`,
        renderCell: ({ row }: CellType) => {
          const { first_name, last_name } = row.name || { first_name: 'No Name', last_name: '' };
          const { email } = row;

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderClient(row)}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'text.secondary',
                  }}
                >
                  {`${first_name || 'No Name'} ${last_name || ''}`}
                </Typography>
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                  {email}
                </Typography>
              </Box>
            </Box>
          );
        }
      },
      {
        flex: 0.6,
        minWidth: 150,
        field: 'birthDay',
        sortable: false,
        headerName: `${t('Birthday')}`,
        renderCell: ({ row }: CellType) => (
          <Typography variant="body1" noWrap>
            {row?.birthday instanceof Date || typeof row.birthday === 'string'
              ? new Date(row.birthday).toISOString().slice(0, 10) // Chuyển đổi sang Date trước khi gọi toISOString()
              : 'N/A'}

          </Typography>
        )
      },
      {
        flex: 0.8,
        minWidth: 100,
        field: 'phoneNumber',
        sortable: false,
        headerName: `${t('Phone Number')}`,
        renderCell: ({ row }: CellType) => (
          <Typography variant="body1" noWrap>
            {row.phone_number || 'None'}
          </Typography>
        )
      },
      {
        field: 'actions',
        headerName: `${t('Actions')}`,
        flex: 0.5,
        minWidth: 100,
        sortable: false,
        renderCell: ({ row }: CellType) => <RowOptions row={row} />,
      }
    ]
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
            sortValue={sortValue}
            sortType={sortType}
            handleSortValueChange={handleSortValueChange}
            handleSortTypeChange={handleSortTypeChange}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={userData}
            columns={columns()}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 70]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row._id}
            rowCount={totalCategories || 1}
            paginationMode='server'
          />
        </Card>
      </Grid>
      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await AxiosInstance.get(`${adminPathName.listStudentEndpoint}`);
    const apiData: UserDataType[] = res.data.map((user: any, index: number) => ({
      ...user,
      id: index.toString()
    }));

    return {
      props: {
        apiData
      }
    };
  } catch (error: any) {
    return {
      props: {
        apiData: []
      }
    };
  }
};

UserList.acl = {
  action: 'manage',
  subject: 'teacher-page'
}

export default UserList
