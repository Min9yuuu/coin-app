import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoins } from './api';
import { Helmet } from 'react-helmet';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../atoms';

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
const CoinsList = styled.ul``;
const Coin = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  margin-bottom: 10px;
  border-radius: 15px;
  border: 1px solid white;
  a {
    transition: color 0.2s ease-in;
    display: block;
    padding: 20px;
    display: flex;
    align-items: center;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;
const Loader = styled.span`
  text-align: center;
  display: block;
`;
const Img = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 15px;
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

interface ICoins {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

interface ICoinRouter {}

function Coins({}: ICoinRouter) {
  const { isLoading, data } = useQuery<ICoins[]>({
    queryKey: ['allCoins'],
    queryFn: fetchCoins,
    select: (data) => data.slice(0, 100),
  });
  const [darkAtom, setDarkAtom] = useRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  return (
    <Container>
      <Helmet>
        <title>코인</title>
      </Helmet>
      <Header>
        <Title>코인</Title>
        <DarkBtn onClick={toggleDarkAtom}>{darkAtom ? 'Light' : 'Dark'}</DarkBtn>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={coin}>
                <Img src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`} alt={`${coin.id}Logo`} />
                <span>{coin.name} &rarr;</span>
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
