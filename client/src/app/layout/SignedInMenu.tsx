import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useAppDispatch, useAppSelector } from '../store/configureStore';
import { accountSlice, signOut } from '../../features/Acount/AccountSlice';
import { clearBasket } from '../../features/BasketPage/basketslice';

export default function SignedInMenu() {

  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.account)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button
        id="fade-button"
        color="inherit"
        sx={{ typography: 'h6' }}

        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {user?.email}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My orders</MenuItem>
        <MenuItem onClick={() => {
          dispatch(signOut())
          dispatch(clearBasket())
        }}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
  );
}