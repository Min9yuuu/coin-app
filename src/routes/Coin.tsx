import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useMatch, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoin, fetchPrice } from './api';
import { Helmet } from 'react-helmet';
import { useRecoilState } from 'recoil';
import { isDarkAtom } from '../atoms';

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}
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

interface IRouterDark {}

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;
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
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)} a {
    display: block;
  }
`;
const DarkBtn = styled.button`
  position: fixed;
  right: 30px;
  top: 10px;
  width: 50px;
  height: 25px;
  border-radius: 20px;
  border: 1px solid white;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.cardBgColor};
`;

function Coin() {
  const { coinId } = useParams();
  const { state } = useLocation();
  const priceMach = useMatch('/:coinId/price');
  const chartMach = useMatch('/:coinId/chart');

  const { isLoading: infoLoading, data: infoD } = useQuery<InfoData>({
    queryKey: ['info', coinId],
    queryFn: () => fetchCoin(coinId!),
  });
  const { isLoading: priceLoading, data: priceD } = useQuery<PriceData>({
    queryKey: ['ticker', coinId],
    queryFn: () => fetchPrice(coinId!),
    refetchInterval: 300000,
  });
  const loading = infoLoading || priceLoading;
  const [darkAtom, setDarkAtom] = useRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  return (
    <>
      <Container>
        <Helmet>
          <title>{state?.name ? state.name : loading ? 'Loading...' : infoD?.name}</title>
        </Helmet>
        <Header>
          <Title>{state?.name ? state.name : loading ? 'Loading...' : infoD?.name}</Title>
          <DarkBtn onClick={toggleDarkAtom}>{darkAtom ? 'Light' : 'Dark'}</DarkBtn>
        </Header>
        {loading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Overview>
              <OverviewItem>
                <span>Rank:</span>
                <span>{infoD?.rank}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Symbol:</span>
                <span>${infoD?.symbol}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Price:</span>
                <span>${priceD?.quotes.USD.price.toFixed(2)}</span>
              </OverviewItem>
            </Overview>
            <Description>{infoD?.description}</Description>
            <Overview>
              <OverviewItem>
                <span>Total Suply:</span>
                <span>{priceD?.total_supply}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Max Supply:</span>
                <span>{priceD?.max_supply}</span>
              </OverviewItem>
            </Overview>
            <Tabs>
              <Tab isActive={priceMach !== null}>
                <Link to={`price`}>Price</Link>
              </Tab>
              <Tab isActive={chartMach !== null}>
                <Link to={`chart`}>Chart</Link>
              </Tab>
            </Tabs>
            <Outlet context={{ coinId }} />
          </>
        )}
      </Container>
    </>
  );
}

export default Coin;
