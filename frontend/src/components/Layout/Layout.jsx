import React, { Fragment, Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from '../../axios-connection';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';

import Toolbar from "../Toolbar/Toolbar";
import Inventory from "../../containers/Inventory/Inventory";
import importFiles from "../../assets/importFiles";
import Home from "../Home/Home";
import convertXLSXtoCSV from '../../assets/convertXLStoCSV';

class Layout extends Component {
  state = {
    articles: [ 
    //   {
    //     sapcode: "123456789",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    //   {
    //     sapcode: "123456788",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    //   {
    //     sapcode: "123456787",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    //   {
    //     sapcode: "123456786",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    //   {
    //     sapcode: "123456785",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    //   {
    //     sapcode: "123456784",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    //   {
    //     sapcode: "123456783",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла1",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    //   {
    //     sapcode: "123456782",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла2",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    //   {
    //     sapcode: "123456781",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла3",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    //   {
    //     sapcode: "123456780",
    //     barcode: ["1234567890123"],
    //     inStock: 1,
    //     orpakStock: 3,
    //     group: "Масла",
    //     name: "Proba",
    //     supplier: "Supplier",
    //   },
    ],
    error: "",
    loading: false,
    articlesImported: false,
    ascending: true,
    gasStations: {},
    searchedValue: {}
  };

  componentDidMount() {
    axios.get("/gas-stations.json").then((response) => {
      this.setState({
        gasStations: response.data,
      });
    });
  }

  fileImportHandler = async (event) => {
    const files = event.target.files;
    if (files.length !== 3) {
      this.setState({
        error: "Файловете за импорт трябва да са три!",
      });
      return;
    }

    const allowedFileNames = {
      sapXLSX: "sap.xlsx",
      sapXLS: "sap.xls",
      orpakXLSX: "orpak.xlsx",
      orpakXLS: "orpak.xls"
    }

    const filesArr = [];
    for (let index = 0; index < files.length; index++) {
      filesArr.push(files[index]);
    }

    const sapFile =
      filesArr.find((f) => f.name.toLowerCase() === allowedFileNames.sapXLS) ||
      filesArr.find((f) => f.name.toLowerCase() === allowedFileNames.sapXLSX);

    const orpakFile =
      filesArr.find(f => f.name.toLowerCase() === allowedFileNames.orpakXLS) ||
      filesArr.find((f) => f.name.toLowerCase() === allowedFileNames.orpakXLSX);
    
    const fuelStationFile = filesArr.find((f) => {
      const arr = f.name.split(".");
      const name = arr[0];

      return this.state.gasStations[name];
    });

    if (!sapFile) {
      this.setState({
        error: "Файлът експортиран от САП липсва!",
      });
      return;
    }

    if (!orpakFile) {
      this.setState({
        error: "Файлът експортиран от ОРПАК липсва!",
      });
      return;
    }

    if (!fuelStationFile) {
      this.setState({
        error: "Файлът с броената наличност липсва!",
      });
      return;
    }

    //const orpakBlob = new Blob([orpakFile]);
    const fsBlob = new Blob([fuelStationFile]);
    this.setState({
      articles: [],
      loading: true,
      error: "",
    });
    try {
      //const orpakData = await orpakBlob.text();
      const fsData = await fsBlob.text();
      const orpakData = await convertXLSXtoCSV(orpakFile);
      const sapData = await convertXLSXtoCSV(sapFile);
      
      //const file = new FileReader();
      //file.readAsText(sapFile, "windows-1251");

      //file.onload = () => {
        this.setState({
          //articles: importFiles(file.result, orpakData, fsData),
          articles: importFiles(sapData, orpakData, fsData),
          loading: false,
          articlesImported: true,
        });
      //};
    } catch (error) {
      this.setState({
        loading: false,
        error: "Нещо се обърка. Проверете файловете и пробвайте отново!",
      });
    }
  };

  editInStock = (e, sapcode) => {
    const item = this.state.articles.find((i) => i.sapcode === sapcode);
    const index = this.state.articles.findIndex((i) => i.sapcode === sapcode);
    item.inStock = +e.target.value;

    let articles = [...this.state.articles];
    articles.splice(index, 1, item);

    this.setState({
      articles,
    });
  };

  clearInventory = () => {
    this.setState({
      articles: [],
      error: "",
      loading: false,
      articlesImported: false,
    });
  };

  orderBy = (property) => {
    const articles = this.state.articles.sort((item1, item2) => {
      let result = null;

      if (typeof item1[property] === "number") {
        if (this.state.ascending) {
          result = item1[property] - item2[property];
        } else {
          result = item2[property] - item1[property];
        }
        return result;
      } else if (property === "differnce") {
        if (this.state.ascending) {
          result =
            item1.inStock -
            item1.orpakStock -
            (item2.inStock - item2.orpakStock);
        } else {
          result =
            item2.inStock -
            item2.orpakStock -
            (item1.inStock - item1.orpakStock);
        }
        return result;
      } else if (typeof item1[property] === "string") {
        if (this.state.ascending) {
          result =
            item1[property].toUpperCase() < item2[property].toUpperCase()
              ? 1
              : -1;
        } else {
          result =
            item1[property].toUpperCase() < item2[property].toUpperCase()
              ? -1
              : 1;
        }
        return result;
      }

      return result;
    });

    this.setState((prevState) => ({
      articles,
      ascending: !prevState.ascending,
    }));
  };

  exportCSV = () => {
    const CSVheading =
      "Sapcode;Barcode;Name;Group;Supplier;OrpakStock;In Stock;Differnce\n";
    const articles = this.state.articles.map((item) => {
      const difference = item.inStock - item.orpakStock;
      return `${item.sapcode};${"`" + item.barcode};${item.name};${
        item.group
      };${item.supplier};${item.orpakStock};${item.inStock};${difference}`;
    });

    let csvContent =
      "data:text/csv;charset=utf-8," + CSVheading + articles.join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Inventory.txt");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
  };

  exportOrpak = () => {
    const articles = this.state.articles.reduce((acc,item) => {
      const qty = item.inStock;
      if(qty > 0) {
        const intQty = ("0000000000" + parseInt(qty)).slice(-10);

        const inx = qty.toString().indexOf(".");
        let decimalQty = "000";
        if (inx > 0) {
          decimalQty = qty.toString().substring(inx + 1);
          decimalQty = ("000" + decimalQty).slice(-3);
        }
        const brc = item.barcode;
        const barcode =
          brc === "-" ? "0000000000000" : ("000000000000" + brc).slice(-13);
        acc.push(`${barcode}${intQty}${decimalQty}`);
      }

      return acc;
    },[]);

    let csvContent = "data:text/csv;charset=utf-8," + articles.join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "OrpakInventory.txt");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
  };

  exportXLSX = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const articles = this.state.articles.map((item) => {
      const difference = item.inStock - item.orpakStock;
      return {
        sapcode: item.sapcode,
        barcode: item.barcode,
        name: item.name,
        group: item.group,
        supplier: item.supplier,
        orpakOnStock: item.orpakStock,
        inStock: item.inStock,
        difference,
      };
    });

    const ws = XLSX.utils.json_to_sheet(articles);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Inventory" + fileExtension);
  };

  removeItem = (sapcode) => {
    const articles = [...this.state.articles];
    const index = articles.findIndex((i) => i.sapcode === sapcode);
    articles.splice(index, 1);

    this.setState({
      articles,
    });
  };

  searchHandler = (value) => {
    const searchedValue = {
      value: value.inputValue,
      name: value.value
    }
    this.setState(
      {searchedValue}
    )
    
  };

  showArticles = () => {
    if (this.state.searchedValue.value){
      const val = this.state.searchedValue.value.toLowerCase();
      const regex = new RegExp(`[\\d\\w]*${val}[\\d\\w]*`);
      const articles = this.state.articles.reduce((acc,cur) => {
        const item = cur[this.state.searchedValue.name].toLowerCase();
        if(regex.test(item)){
          acc.push(cur)
        }
        
        return acc
      },[]);
      return articles;
    }else{
      return this.state.articles
    }
    
  }

  inventoryImportHandler = async(event) => {
    const file = event.target.files[0];
    this.setState({
      articles: [],
      loading: true
    });
    try {

      const data = await convertXLSXtoCSV(file);
      const articles = data.split("\n").slice(1).reduce((acc,cur) => {
        const item = cur.split(";");
        if(item.length === 7){
          acc.push({
            sapcode: item[0].trim(),
            barcode: [item[1].trim()],
            name: item[2].trim(),
            group: item[3].trim(),
            supplier: item[4].trim(),
            orpakStock: item[5].replace(",", "."),
            inStock: item[6].replace(",", "."),
          });
        }

        return acc;
      },[]);

      this.setState(
        {
          articles,
          loading: false,
          articlesImported: true,
        }
      );
    } catch (error) {
      this.setState({
        loading: false,
        error: "Нещо се обърка. Проверете файловете и пробвайте отново!",
      });
    }
  };

  render() {
    return (
      <Fragment>
        <Toolbar
          clearInventory={this.clearInventory}
          exportCSV={this.exportCSV}
          exportOrpak={this.exportOrpak}
          isArticleImported={this.state.articlesImported}
          exportExcel={this.exportXLSX}
          searchHandler={this.searchHandler}
        />
        <Switch>
          <Route
            path="/inventory"
            render={() => (
              <Inventory
                articles={this.showArticles}
                onChange={this.editInStock}
                isArticleImported={this.state.articlesImported}
                orderBy={this.orderBy}
                removeItem={this.removeItem}
                search={this.state.searchedValue}
              />
            )}
          />
          <Route
            path="/"
            render={() => (
              <Home
                filesHandler={this.fileImportHandler}
                error={this.state.error}
                isLoading={this.state.loading}
                isArticleImported={this.state.articlesImported}
                importInventory={this.inventoryImportHandler}
              />
            )}
          />
        </Switch>
      </Fragment>
    );
  }
}

export default Layout;
