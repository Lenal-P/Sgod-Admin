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
import { Category } from 'src/context/types'

// ** Define Header component using styled function
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SidebarAddCategory = (props: any) => {
  const { open, toggle, fetchDataList } = props;
  const { control, handleSubmit } = useForm()

  const createCategory = async (data: Category) => {
    try {
      const formData = new FormData();

      // Thêm dữ liệu của category vào formData
      formData.append('_id', data._id);
      formData.append('name', data.name);
      formData.append('icon', '/placeholder-image.jpg');

      // Gọi API để tạo category và gửi formData
      const response = await AxiosInstance.post(`${adminPathName.addCategoryEndpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      fetchDataList(response.data);
      toast.success('Create Category Successfully');
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };


  const onSubmit = (data: any) => {
    createCategory(data);
  };

  const handleClose = () => {
    toggle();
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
        <Typography variant='h5'>{t('Add New Category')}</Typography>
        <IconButton size='small' onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ padding: '16px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                autoFocus
                fullWidth
                value={value}
                sx={{ marginBottom: '16px' }}
                label={t('Name')}
                onChange={onChange}
                placeholder='Category Name'
              />
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

export default SidebarAddCategory;
