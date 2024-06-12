// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'

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
import ButtonsFab from 'src/views/pages/admin-profile/components/ButtonsFab'

// ** Define Header component using styled function
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SidebarAddCategory = (props: any) => {
  const { open, toggle, fetchDataList } = props;
  const { control, handleSubmit, setValue } = useForm()
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const createCategory = async (data: Category, file: File) => {
    try {
      const formData = new FormData();

      // Thêm dữ liệu của file vào formData
      formData.append('file', file);

      // Thêm dữ liệu của category vào formData
      formData.append('_id', data._id);
      formData.append('name', data.name);
      formData.append('icon', data.icon);

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
    if (selectedFile) {
      createCategory(data, selectedFile);
    } else {
      toast.error('Please select an icon file');
    }
  };


  const handleClose = () => {
    toggle();
  };

  const handleChooseFile = async () => {
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.click();
      fileInput.addEventListener('change', async event => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const binaryString = event.target?.result as string;
            setValue('icon', binaryString);
            setSelectedFile(file);
          };
          reader.readAsDataURL(file);

          // Remove the following line as `data` is not defined here
          // await createCategory(data, selectedFile);
        }
      });
    } catch (error) {
      console.error('Error choosing file:', error);
    }
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
          <Controller
            name='icon'
            control={control}
            render={({ field }) => (
              <Grid
                container
                alignItems='end'
                spacing={2}
                sx={{ display: 'flex', gap: 1, mb: 4 }}
              >
                <Grid item sx={{ position: 'relative', flex: 1 }} >
                  <TextField
                    fullWidth
                    placeholder='Icon'
                    defaultValue={field.value}
                    value={field.value}
                    onChange={e => {
                      setValue('icon', e.target.value)
                    }}
                    sx={{ mt: 2 }}
                  />
                  <Grid item className='buttonAvatar' onClick={handleChooseFile}
                    sx={{ position: 'absolute', top: '35%', right: 3 }}
                  >
                    <ButtonsFab />
                  </Grid>
                </Grid>
              </Grid>
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
