const importCountedArticles = (filedata, articleState) => {
  const articles = { ...articleState };
  filedata.split("\r\n").forEach((line) => {
    const data = line.split(";").map((e) => e);

    const barcodeRegex = /^\d{1,13}$/;
    const curBarcode = data[0];
    const count = Number(data[1]);
    const name = data[2];
    let isBarcodeFound = false;

    if (barcodeRegex.test(curBarcode)) {
      Object.keys(articles).forEach((k) => {
        if (articles[k].barcode && articles[k].barcode.includes(curBarcode)) {
          articles[k].inStock += count;
          isBarcodeFound = true;
        }
      });

      if (!isBarcodeFound) {
        articles[curBarcode] = {
          name,
          inStock: count,
          orpakStock: 0,
          group: '-',
          barcode: [curBarcode],
          supplier: "-",
        };
      }
    }
  });

  return articles;
};

const importOrpakArticles = (fileData, articleState) => {
  const articles = { ...articleState };
  fileData.split("\n").forEach((line) => {
    const data = line.split(";").map((e) => e);

    const curSapcode = data[0];
    //when barcode is missing, sapcode will be using
    const curBarcode = data[1] ? data[1] : curSapcode;
    let orpakStock = data[2] ? data[2].replace(",", "").replace(" ", "") : null;
    orpakStock = Number(orpakStock);

    const sapcodeRegex = /^\d{9}$/;
    const barcodeRegex = /^\d{1,13}$/;

    if (sapcodeRegex.test(curSapcode) && barcodeRegex.test(curBarcode)) {
      if (articles[curSapcode]) {
        if (!articles[curSapcode].barcode.includes(curBarcode)) {
          articles[curSapcode].barcode.unshift(curBarcode);
        } else {
          const barcodeIndex = articles[curSapcode].barcode.findIndex(
            (b) => b === curBarcode
          );
          if (barcodeIndex >= 1) {
            articles[curSapcode].barcode.splice(barcodeIndex, 1);
            articles[curSapcode].barcode.unshift(curBarcode);
          }
        }

        orpakStock += articles[curSapcode].orpakStock;
        //const difference = articles[curSapcode].inStock - orpakStock;

        articles[curSapcode] = {
          ...articles[curSapcode],
          orpakStock,
        };
      } else if (articles[curBarcode]) {
        orpakStock += articles[curBarcode].orpakStock;
        //const difference = articles[curBarcode].inStock - orpakStock;

        articles[curBarcode] = {
          ...articles[curBarcode],
          orpakStock,
          //difference,
        };
      } else {
        //const difference = -orpakStock;
        articles[curSapcode] = {
          orpakStock,
          inStock: 0,
          group: '-',
          //difference,
          barcode: [curSapcode],
        };
      }
    }
  });

  return articles;
};

const importSapArticles = (fileData, articleState) => {
  const articles = { ...articleState };
  fileData.split("\n").forEach((line) => {
    const data = line.split(";").map((e) => e);

    const barcode = data[0][0] === "0" ? data[0].slice(1) : data[0];
    const sapcode = data[1];
    const name = data[2];
    const supplier = data[3];
    const group = data[4];
    const sapcodeRegex = /^\d{9}$/;
    const barcodeRegex = /^\d{1,13}$/;

    if (sapcodeRegex.test(sapcode) && barcodeRegex.test(barcode)) {
      if (!articles[sapcode]) {
        articles[sapcode] = {
          name,
          barcode: [],
          supplier,
          orpakStock: 0,
          inStock: 0,
          group,
        };
      }

      if (!articles[sapcode].barcode.includes(barcode)) {
        articles[sapcode].barcode.push(barcode);
      }
    }
  });

  return articles;
};

const importFiles = (sapData, orpakData, fsData) => {
    let data = importSapArticles(sapData, {});
    data = importOrpakArticles(orpakData, data);
    data = importCountedArticles(fsData, data)

    return Object.keys(data).reduce((acc,sap) => {
      const item = {...data[sap], sapcode: sap}
      if(item.inStock || item.orpakStock){
        acc.push(item)
      }
      
      return acc
    },[]);
}

export default importFiles;
