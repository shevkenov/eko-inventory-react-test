import React, {Fragment} from 'react'

import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.module.css';

export default function Modal(props) {

    return (
      <Fragment>
        <Backdrop clicked={props.closeModal} show={props.show} />
        <div
          className={classes.Modal}
          style={{
            transform: props.show ? "translateY(0)" : "translateY(-100vh)",
            opacity: props.show ? "1" : "0",
          }}
        >
          <div className={classes.Popup}>
            <h3>Искате ли да изтриете артикул:</h3>
            <span>Име - {props.item.name}</span>
            <span>Артикул - {props.item.sapcode}</span>
            <div className={classes.ModalButtons}>
              <button onClick={props.removeItem}>Yes</button>
              <button onClick={props.closeModal}>No</button>
            </div>
          </div>
        </div>
      </Fragment>
    );
}
