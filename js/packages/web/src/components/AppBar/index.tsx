import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { ConnectButton, CurrentUserBadge } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notifications } from '../Notifications';
import useWindowDimensions from '../../utils/layout';
import { MenuOutlined } from '@ant-design/icons';
import { useMeta } from '../../contexts';

const UserActions = () => {
  const { publicKey } = useWallet();
  const { whitelistedCreatorsByCreator, store } = useMeta();
  const pubkey = publicKey?.toBase58() || '';

  const canCreate = useMemo(() => {
    return (
      store?.info?.public ||
      whitelistedCreatorsByCreator[pubkey]?.info?.activated
    );
  }, [pubkey, whitelistedCreatorsByCreator, store]);

  return (
    <>
      {store && (
        <>
          {/* <Link to={`#`}>
            <Button className="app-btn">BIDS</Button>
          </Link> */}
          {canCreate ? (
            <Link to={`/art/create`}>
              <Button className="app-btn">MINT</Button>
            </Link>
          ) : null}
          <Link to={`/auction/create/0`}>
            <Button className="connector" type="primary">
              SELL
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

const DefaultActions = ({ vertical = false }: { vertical?: boolean }) => {
  const { connected } = useWallet();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
      }}
    >
      <Link to={`/artworks`}>
        <Button className="app-btn">
          {connected ? 'MY ITEMS' : 'OBJECTS'}
        </Button>
      </Link>
      <Link to={`/artists`}>
        <Button className="app-btn">AUTHORS</Button>
      </Link>
      <Link to={`/auctions`}>
        <Button className="app-btn">EXPLORE</Button>
      </Link>
      <Link to={`/widgets`}>
        <Button className="app-btn">WIDGETS</Button>
      </Link>
    </div>
  );
};

const MetaplexMenu = () => {
  const { width } = useWindowDimensions();
  const { connected } = useWallet();

  if (width < 768)
    return (
      <>
        <Dropdown
          arrow
          placement="bottomLeft"
          trigger={['click']}
          overlay={
            <Menu>
              <Menu.Item>
                <Link to={`/artworks`}>
                  <Button className="app-btn">
                    {connected ? 'MY ITEMS' : 'OBJECTS'}
                  </Button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/artists`}>
                  <Button className="app-btn">AUTHORS</Button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/auctions`}>
                  <Button className="app-btn">EXPLORE</Button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/widgets`}>
                  <Button className="app-btn">WIDGETS</Button>
                </Link>
              </Menu.Item>
            </Menu>
          }
        >
          <MenuOutlined style={{ fontSize: '1.0rem' }} />
        </Dropdown>
      </>
    );

  return <DefaultActions />;
};

export const AppBar = () => {
  const { connected } = useWallet();

  return (
    <>
      <div className="app-left app-bar-box">
        {window.location.hash !== '#/analytics' && <Notifications />}
        <div className="divider" />
        <MetaplexMenu />
      </div>
      {connected ? (
        <div className="app-right app-bar-box">
          <UserActions />
          <CurrentUserBadge
            showBalance={false}
            showAddress={false}
            iconSize={24}
          />
        </div>
      ) : (
        <ConnectButton type="primary" allowWalletChange />
      )}
    </>
  );
};
