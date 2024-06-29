// ** React Imports
import { ReactNode, useEffect, useState } from 'react';

// ** MUI Components
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Icon from 'src/@core/components/icon';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import { Button, CircularProgress, List, ListItem, Paper, Typography } from '@mui/material';
import { processName } from 'src/utils/processName';
import { socket } from 'src/socket';
import { useRouter } from 'next/router';

const WaitingRoom = () => {
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    console.log("id: ", socket.id)


    socket.on("connect", () => {
      console.log("connect ");
    })

    socket.on("receiveClient", ({ clients }) => {
      setStudents(clients)
    })

    return () => {
      socket.off('receiveClient');
    };
  }, []);

  function startQuiz() {
    console.log("run start quiz");
    router.push(`/apps/quiz-online/slide/${router.query.roomId}`)
  }

  return (
    <Paper>
      <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
        {!hidden && (
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <img src='/images/LogoFull.svg' alt='Logo' style={{ width: '15vw' }} />
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'flex-start',
                backgroundColor: 'customColors.bodyBg',
                p: 2,
                flexDirection: 'column',
              }}
            >
              <Box sx={{ my: 8, display: 'flex', width: '95%', justifyContent: 'space-between' }}>
                <Button variant='contained' sx={{ fontWeight: 'bold', mr: 2 }} startIcon={<Icon style={{ height: '1rem' }} icon='fa6-solid:user' />}>
                  {students.length}
                </Button>
                <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>CODE: {router.query.roomId}</Typography>
                <Button variant="contained" sx={{ fontWeight: 'bold' }} onClick={startQuiz}>Start</Button>
              </Box>
              {students.length > 0 ? (
                <List sx={{ display: 'flex', flexWrap: 'wrap', px: 2, justifyContent: 'center', gap: 3 }}>
                  {students.map((student, index) => (
                    <ListItem key={index} sx={{ width: 'auto', p: 0 }}>
                      <Button variant='outlined'>
                        <Box
                          sx={{
                            height: '3rem',
                            width: '3rem',
                            borderRadius: '50%',
                            marginRight: 2,
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography sx={{ fontWeight: 'bold', color: 'white' }}>
                            {processName(student)}
                          </Typography>
                        </Box>
                        {student}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography sx={{ display: 'flex', gap: 6, textAlign: 'center', mt: '10%', fontSize: 30, fontWeight: 'bold' }}>
                  <CircularProgress /> Waiting for students...
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

WaitingRoom.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default WaitingRoom;

WaitingRoom.acl = {
  action: 'read',
  subject: 'teacher-page'
}