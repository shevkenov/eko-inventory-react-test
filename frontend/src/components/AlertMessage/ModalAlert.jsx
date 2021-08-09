import React from 'react'

import classes from './AlertModal.module.css';

const ModalAlert = (props) => {
    return (
        <div className={classes.alert}>
            <div className={classes.modal}>
                <h4>Преди да продължите напред, моля да се уверите, че:</h4>
                <ol>
                    <li>Всички стокови разписки на Български пощи, за които няма издадена фактура са заприходени в Орпак от менюто „Получаване на заявка“.</li>
                    <li>Всички документи, чакащи фактура са заприходени в Орпак от менюто „Получаване на заявка“;</li>
                    <p>При тези случаи след приключване на инвентаризацията задължително изписвате заведените количества от менюто „Връщане на заявка“.</p>
                    <li>Всички получени фактури и кредитни известия са заприходени в Орпак.</li>
                </ol>
                <div className={classes.btn}>
                    <button onClick={props.closeModal}>Продължи!</button>
                </div>
            </div>
        </div>
    )
}

export default ModalAlert
