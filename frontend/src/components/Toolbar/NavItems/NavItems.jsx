import React from "react";

import classes from './NavItems.module.css';

export default function NavItems(props) {
  return (
    
      <div className={classes.Div}>
        {props.children}
      </div>

  );
}
