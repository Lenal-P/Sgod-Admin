import React, { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import ReactApexcharts from 'src/@core/components/react-apexcharts';
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import AxiosInstance from 'src/configs/axios';
import adminPathName from 'src/configs/endpoints/admin';
import { useRouter } from 'next/router';

const ChartScore = () => {
  const [chartData, setChartData] = useState({ scores: [], data: [] });
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const fetchChartData = async () => {
    try {
      const response = await AxiosInstance.post(`${adminPathName.getScoreQuizEndpoint}`, {
        quiz_id: router.query.id,
      });
      const data = response.data;

      if (data.scores && data.data) {
        setChartData({
          scores: data.scores,
          data: data.data,
        });
        setLoading(data.scores.length > 0 && data.data.length > 0);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error: any) {
      setLoading(false);
      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const colors = Array(chartData.scores.length).fill(hexToRGBA(theme.palette.primary.main, 0.16));

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '45%',
        startingShape: 'rounded',
      },
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: {
      enabled: false,
    },
    colors,
    states: {
      hover: {
        filter: { type: 'none' },
      },
      active: {
        filter: { type: 'none' },
      },
    },
    grid: {
      show: false,
      padding: {
        top: 30,
        left: 0,
        right: 8,
        bottom: -12,
      },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: theme.palette.divider },
      categories: chartData.scores,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string,
        },
      },
    },
    yaxis: {
      labels: {
        offsetX: -15,
        formatter: (val) => val.toFixed(0),
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string,
        },
      },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '60%' },
          },
          grid: {
            padding: { right: 20 },
          },
        },
      },
    ],
  };

  const finalColors = colors.map(() => (hexToRGBA(theme.palette.primary.main, 1)));

  return (
    <Card sx={{ borderRadius: '0px 0px 15px 15px' }}>
      <Typography sx={{ backgroundColor: (theme) => `${theme.palette.customColors.tableHeaderBg}`, display: 'flex', flex: 1, fontSize: 18, height: '5rem', alignItems: 'center', pl: 6 }}>{t('Chart Scores')}</Typography>

      <CardContent sx={{ '& .MuiCardContent-root': { p: 0 } }}>
        {loading ? (
          <ReactApexcharts
            type='bar'
            height={350}
            options={{ ...options, colors: finalColors }}
            series={[{ data: chartData.data }]}
          />
        ) : (
          <Box sx={{ textAlign: 'center', padding: 5 }}>
            <Typography variant='h6'>{t('No data available')}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartScore;
