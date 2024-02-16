import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { fetchCoinHistory } from './api';
import ApexCharts from 'react-apexcharts';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atoms';

interface ICoinId {
  coinId: string;
}

interface IHistory {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

function Chart() {
  const isDark = useRecoilValue(isDarkAtom);
  const { coinId } = useOutletContext<ICoinId>();
  const { isLoading, data } = useQuery<IHistory[]>({
    queryKey: ['ohlcv', coinId],
    queryFn: () => fetchCoinHistory(coinId),
  });
  return (
    <>
      <div>
        {isLoading ? (
          'Loading chart...'
        ) : (
          <ApexCharts
            type="candlestick"
            series={[
              {
                name: 'Price',
                data:
                  data?.map((price) => ({
                    x: price.time_close,
                    y: [price.open, price.high, price.low, price.close],
                  })) ?? [],
              },
            ]}
            options={{
              theme: {
                mode: isDark ? 'dark' : 'light',
              },
              chart: {
                height: 300,
                width: 500,
                toolbar: {
                  show: false,
                },
                background: 'transparent',
              },
              grid: { show: false },
              stroke: {
                curve: 'smooth',
                width: 4,
              },
              yaxis: {
                show: false,
              },
              xaxis: {
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { show: false },
                type: 'datetime',
                categories: data?.map((price) => price.time_close),
              },
              fill: {
                type: 'gradient',
                gradient: { gradientToColors: ['#0be881'], stops: [0, 100] },
              },
              colors: ['#0fbcf9'],
              tooltip: {
                y: {
                  formatter: (value) => `$${value.toFixed(2)}`,
                },
              },
            }}
          />
        )}
      </div>
    </>
  );
}

export default Chart;
