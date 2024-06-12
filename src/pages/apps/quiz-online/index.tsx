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

// ** Third Party Components
import AxiosInstance from 'src/configs/axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/quizOnline/TableHeader'
import { QuizOnline } from 'src/context/types'
import Actions from 'src/pages/apps/action/ActionsQuizOnline'
import adminPathName from 'src/configs/endpoints/admin';
import toast from 'react-hot-toast'
import { updateData, resetData } from 'src/store/apps/breadcrumbs'
import { useDispatch } from 'react-redux'

interface CellType {
    row: QuizOnline
}

const UserList = () => {
    // ** State
    const [value, setValue] = useState<string>('')
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 })
    const [dataList, setDataList] = useState<QuizOnline[]>([])
    const searchQuery = encodeURIComponent(value);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [sortValue, setSortValue] = useState<string>('title');
    const [sortType, setSortType] = useState<string>('asc');
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const fetchDataList = async () => {
        try {
            const response = await AxiosInstance.get(`${adminPathName.getallQuizOnlineEndpoint}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}&search=${searchQuery}&sort=${sortValue}%3A${sortType}`);
            setDataList(response.data.newDataPaginate.data)
            setTotalPage(response.data.newDataPaginate.total);
        } catch (error: any) {
            if (error && error.response) {
                toast.error(error.response.data.message)
            }
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
    const RowOptions = ({ row }: { row: QuizOnline }) => {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Actions row={row} setDataList={setDataList} fetchDataList={fetchDataList} />
            </Box>
        );
    };

    useEffect(() => {
        dispatch(resetData())
        dispatch(updateData(
            {
                title: t('Quiz Online'),
                url: `/apps/quiz-online/`
            }
        ))
    }, [])

    const columns = (): GridColDef[] => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation()

        return [
            {
                flex: 1,
                minWidth: 100,
                field: 'title',
                sortable: false,
                headerName: `${t('Title')}`,
                renderCell: ({ row }: CellType) => (
                    <Typography variant="body1" noWrap>
                        {row.title || 'None'}
                    </Typography>
                )
            },
            {
                flex: 1,
                minWidth: 100,
                field: 'name',
                sortable: false,
                headerName: `${t('Name')}`,
                renderCell: ({ row }: CellType) => (
                    <Typography variant="body1" noWrap>
                        {row.name || 'None'}
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

    return (
        <Grid container spacing={6.5}>
            <Grid item xs={12}>
                <Card>
                    <Divider sx={{ m: '0 !important' }} />
                    <TableHeader
                        value={value}
                        handleFilter={handleFilter}
                        sortValue={sortValue}
                        sortType={sortType}
                        handleSortValueChange={handleSortValueChange}
                        handleSortTypeChange={handleSortTypeChange}
                    />
                    <DataGrid
                        autoHeight
                        rowHeight={62}
                        rows={dataList}
                        columns={columns()}
                        disableRowSelectionOnClick
                        pageSizeOptions={[10, 25, 70]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        getRowId={(row) => row._id}
                        rowCount={totalPage || 1}
                        paginationMode='server'
                    />
                </Card>
            </Grid>
        </Grid>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    try {
        const res = await AxiosInstance.get(`${adminPathName.listStudentEndpoint}`);
        const apiData: QuizOnline[] = res.data.map((user: any, index: number) => ({
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
