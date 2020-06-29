import React, {Fragment, Component} from "react";
import { Redirect } from "react-router-dom";

import classes from "./Inventory.module.css";
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import UpArrow from '../../components/Icons/Up';

class Inventory extends Component {
  state = {
    removing: false,
    itemForRemoving: {}
  };

  closeModal = () => {
    this.setState({
      removing: false,
    });
  };

  popupMessage = (item) => {
    this.setState({
      removing: true,
      itemForRemoving: item,
    });
  };

  removeItem = () => {
    this.setState({
      removing: false,
    });
    this.props.removeItem(this.state.itemForRemoving.sapcode);
  };

  render() {
    let index = 0;
    const articles = this.props.articles().reduce((acc, item) => {
      let difference = item.inStock - item.orpakStock;
      difference =
        (difference + "").indexOf(".") === -1
          ? difference
          : difference.toFixed(2);
      
      if (item.inStock || item.orpakStock){
        acc.push(
          <tr key={index}>
            <td className={classes.No}>{++index}</td>
            <td>{item.sapcode}</td>
            <td>{item.barcode}</td>
            <td>{item.name}</td>
            <td>{item.group}</td>
            <td>{item.supplier}</td>
            {/* <td className={classes.Number}>{item.orpakStock}</td> */}
            <td className={classes.Input}>
              <div>
                <input
                  value={item.orpakStock}
                  type="number"
                  min="0"
                  onChange={(e) => this.props.onChangeOrpakStock(e, item.sapcode)}
                />
              </div>
            </td>
            <td className={classes.Input}>
              <div>
                <input
                  value={item.inStock}
                  type="number"
                  min="0"
                  onChange={(e) => this.props.onChangeInStock(e, item.sapcode)}
                />
              </div>
            </td>
            <td className={classes.Number}>{difference}</td>
            <Button onClick={() => this.popupMessage(item)}>Изтрий</Button>
          </tr>
        );
      }
      
      return acc;
      
    }, []);

    const table = (
      <div className={classes.Inventory}>
        <table className={classes.Table}>
          <thead className={classes.TableHead}>
            <tr>
              <th>No</th>
              <th onClick={() => this.props.orderBy("sapcode")}>САП код</th>
              <th>Баркод</th>
              <th onClick={() => this.props.orderBy("name")}>Име артикул</th>
              <th onClick={() => this.props.orderBy("group")}>Група</th>
              <th onClick={() => this.props.orderBy("supplier")}>Доставчик</th>
              <th onClick={() => this.props.orderBy("orpakStock")}>
                Орпак нам.
              </th>
              <th onClick={() => this.props.orderBy("inStock")}>Намер.</th>
              <th onClick={() => this.props.orderBy("differnce")}>Разлика</th>
              <th onClick={() => window.scrollTo(0, 0)}>
                <UpArrow />
              </th>
            </tr>
          </thead>
          <tbody className={classes.TableBody}>{articles}</tbody>
        </table>
      </div>
    );

    const result = this.props.isArticleImported ? (
      <Fragment>
        <Modal
          show={this.state.removing}
          closeModal={this.closeModal}
          item={this.state.itemForRemoving}
          removeItem={this.removeItem}
        />
        {table}
      </Fragment>
    ) : (
      <Redirect to="/" />
    );

    return result;
  }
};

export default Inventory 