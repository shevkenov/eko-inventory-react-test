import React from "react";
import { Redirect } from "react-router-dom";

import classes from "./HomeItems.module.css";

export default function HomeItems(props) {
  const div = (
    <div className={classes.Home}>
      <div className={classes.Div}>
        <h2>Импорт на файлове за обработка на инвентаризация!</h2>
        <ul>
          <li>
            Файл експортиран от <span>САП</span>, формат -{" "}
            <span>баркод, сапкод, име на артикул, доставчик, група</span>. Име
            на файла <span>sap.csv</span>
          </li>
          <li>
            Файл експортиран от <span>Орпак</span>, формат -{" "}
            <span>сапкод, баркод, наличност</span>. Име на файла{" "}
            <span>orpak.csv</span>
          </li>
          <li>
            Файл с <span>броената наличност</span>, формат -{" "}
            <span>баркод, наличност, име</span>. Име на файла{" "}
            <span>(номер на бензиностанция, именован 11xx или 19xx).txt</span>
          </li>
          <li>
            Разделител на колоните във файловете трябва да бъде <span>;</span>
          </li>
        </ul>
        <input
          type="file"
          accept=".txt, .xls, .xlsx"
          multiple
          required
          onChange={props.filesHandler}
        />
      </div>
      <div className={classes.Div}>
        <h2>Импорт на готова инвентаризация!</h2>
        <ul>
          <li>
            Файлът трябва да е във формат <span>Excel [xlsx, xls]</span>
          </li>
          <li>
            Файлът трябва да съдържа
            <span> 7 колони със заглавия</span> съдържащи:
          </li>
          <li>
            <span>
              САП код, баркод, име на артикул, група, доставчик, наличност в
              Орпак, намерено
            </span>
          </li>
        </ul>
        <input
          type="file"
          accept=".xlsx, .xls"
          required
          onChange={props.importInventory}
        />
      </div>
      {props.error ? (
        <div className={classes.Error}>
          <h2>{props.error}</h2>
        </div>
      ) : null}
    </div>
  );

  return props.isArticleImported ? <Redirect to="/inventory" /> : div;
}
