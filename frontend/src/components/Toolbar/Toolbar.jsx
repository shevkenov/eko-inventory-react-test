import React from 'react'
import {Link} from 'react-router-dom'

import Logo from './Logo/Logo';
import NavItems from './NavItems/NavItems';
import NavItem from './NavItems/NavItem/NavItem'
import classes from './Toolbar.module.css';
import DropDownMenu from './NavItems/DropDownMenu/DropDownMenu';
import SearchBar from '../SearchBar/SearchBar';

const Toolbar = (props) => {
    const links = props.isArticleImported ? (
      <NavItems>
        <NavItem>
          <SearchBar search={props.searchHandler} />
        </NavItem>
        <DropDownMenu {...props}></DropDownMenu>
        <NavItem>
          <Link to="/" onClick={props.clearInventory}>
            Clear Data
          </Link>
        </NavItem>
      </NavItems>
    ) : null;
    return (
      <header className={classes.Toolbar}>
        <Logo />
        {links}
      </header>
    );
}

export default Toolbar;