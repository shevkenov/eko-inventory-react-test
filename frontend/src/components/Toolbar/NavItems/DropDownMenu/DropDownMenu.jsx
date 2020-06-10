import React from 'react'
import { Link } from "react-router-dom";

import NavItem from '../NavItem/NavItem';
import NavButton from '../../NavButton/NavButton';
import classes from './DropDownMenu.module.css';

export default function ExportNavItems(props) {

    return (
      <div className={classes.Div}>
        <NavButton>Export</NavButton>
        <div className={classes.DropDown}>
          <NavItem>
            <Link to="/inventory" onClick={props.exportCSV}>
              Export TXT
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/inventory" onClick={props.exportExcel}>
              Export to Excel
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/inventory" onClick={props.exportOrpak}>
              Export to Orpak
            </Link>
          </NavItem>
        </div>
      </div>
    );
}
