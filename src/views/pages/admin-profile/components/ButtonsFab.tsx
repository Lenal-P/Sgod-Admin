// ** MUI Imports
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ButtonsFab = () => {
  return (
    <>
      <Box
        sx={{
          margin: '0',
          width: '40px',
          marginLeft: 2,
        }}
      >
        <Fab color='primary' aria-label='edit' sx={{ height: '36px', width: '36px' }}>
          <Icon icon='tabler:pencil' />
        </Fab>
      </Box>
    </>
  )
}

export default ButtonsFab
