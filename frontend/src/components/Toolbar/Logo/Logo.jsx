import React from 'react'
import {NavLink} from 'react-router-dom';

import ImageSource from '../../../assets/logo.png';
import classes from './Logo.module.css';

const Logo = () => {
    return (
      <div className={classes.Logo}>
        <NavLink to='/'>
          <img src={ImageSource} alt="Eko Bulgaria" />
        </NavLink>
      </div>
    );
}

export default Logo;