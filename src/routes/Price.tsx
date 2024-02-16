import { styled } from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { fetchPrice, fetchCoinHistory } from './api';
import { useParams } from 'react-router-dom';

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

function Price() {
  const { coinId } = useParams();
  const { isLoading: priceLoading, data: priceD } = useQuery<PriceData>({
    queryKey: ['ticker', coinId],
    queryFn: () => fetchPrice(coinId!),
    refetchInterval: 300000,
  });

  return (
    <>
      {priceLoading ? (
        <Overview>
          <Loader>Loading...</Loader>
        </Overview>
      ) : (
        <Overview>
          <OverviewItem>
            <span>Price:</span>
            <span>${priceD?.quotes.USD.price.toFixed(2)}</span>
          </OverviewItem>
          <OverviewItem>
            <span>precent from price ath:</span>
            <span>{priceD?.quotes.USD.percent_from_price_ath}% </span>
          </OverviewItem>
        </Overview>
      )}
    </>
  );
}

export default Price;
