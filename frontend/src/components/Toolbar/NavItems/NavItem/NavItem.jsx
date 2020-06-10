import React from 'react'


import classes from './NavItem.module.css';

const NavItem = (props) => {
    return (
      <div className={classes.NavItem}>
        {props.children}
      </div>
    );
}

export default NavItem
