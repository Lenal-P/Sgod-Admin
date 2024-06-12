// ** MUI Imports
import { Icon } from '@iconify/react'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import { useSelector } from 'react-redux'
import BreadcrumbRouter from 'src/pages/components/Breadcrumb'
import { socket } from 'src/socket'
import { generateRandom } from 'src/utils/math'

const TableHeaderDetail = ({ quizId }: { quizId: string }) => {
  const [roomId, setRoomId] = useState<string>("")
  const breacumbData = useSelector((state: any) => state.breadcrumbsData.data)
  const { t } = useTranslation()
  const router = useRouter()

  async function hostRoom(roomId: string, quizId: string) {
    socket.connect();
    socket.emit("hostRoom", {
      roomId,
      quizId
    })
  }

  useEffect(() => {
    if (roomId) {
      router.push(`/apps/quiz-online/waitingRoom/${roomId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, roomId, socket.connected])



  function startQuiz() {
    const randomRoomId = generateRandom(5)
    setRoomId(randomRoomId)
    hostRoom(randomRoomId, quizId)
  }

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'end',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <BreadcrumbRouter
          breacumbData={breacumbData}
        />
      </Box>
      <Box sx={{ gap: 4, rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={startQuiz}>
          <Icon fontSize='1.125rem' icon='tabler:play' />
          {t('Start Quiz Online')}
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeaderDetail
