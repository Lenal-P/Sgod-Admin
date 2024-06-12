// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Imports
import AxiosInstance from 'src/configs/axios'
import adminPathName from 'src/configs/endpoints/admin';
import { QuizQuestionStore, UserDataType } from 'src/context/types'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'

// ** Define Header component using styled function
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SidebarAddQuizQuestionStore = (props: any) => {
  const { open, toggleAdd, fetchDataList } = props;
  const { control, handleSubmit } = useForm()
  const user = localStorage.getItem('userData')
  const userData: UserDataType | null = user ? JSON.parse(user) : null

  const createQuizQuestionStore = async (data: QuizQuestionStore) => {
    const filteredData = {
      is_share: Boolean(Number(data.is_share)),
      owner: userData?._id,
      title: data.title,
    };
    console.log(filteredData)
    try {
      const response = await AxiosInstance.post(`${adminPathName.addQuizStoreEndpoint}`, filteredData);
      fetchDataList(response.data);
      toast.success('Create QuizQuestionStore Successfully');
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  const handleClose = () => {
    toggleAdd();
  };

  const onSubmit = (data: any) => {
    createQuizQuestionStore(data);
  };

  const { t } = useTranslation()

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
        <Typography variant='h5'>{t('Add New QuizQuestionStore')}</Typography>
        <IconButton size='small' onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ padding: '16px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='title'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                autoFocus
                fullWidth
                value={value}
                sx={{ marginBottom: '16px' }}
                label={t('title')}
                onChange={onChange}
                placeholder='Title'
              />
            )}
          />
          <Controller
            name='is_share'
            control={control}
            defaultValue=''
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                sx={{ mb: 8 }}
                value={field.value || 'default'}
                onChange={(e: SelectChangeEvent<string>) => field.onChange(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                fullWidth
              >
                <MenuItem value='default' disabled>{t('Select Status Share')}</MenuItem>
                <MenuItem value={'1'}>{t('Public')}</MenuItem>
                <MenuItem value={'0'}>{t('Private')}</MenuItem>
              </Select>
            )}
          />
          <Button type='submit' variant='contained' sx={{ mr: 3 }}>
            {t('Submit')}
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            {t('Cancel')}
          </Button>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddQuizQuestionStore;
