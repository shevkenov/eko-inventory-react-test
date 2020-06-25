const importCountedArticles = (filedata, articleState) => {
  const articles = { ...articleState };
  filedata.split("\r\n").forEach((line) => {
    const data = line.split(";").map((e) => e);

    const barcodeRegex = /^\d{1,13}$/;
    const curCode = data[0];
    const count = Number(data[1]);
    const name = data[2];

    if (barcodeRegex.test(curCode)) {
      const sapcode = Object.keys(articles).find((sCode) =>
        articles[sCode].allBarcodes.includes(curCode)
      );

      //if sapcode exists, the relevant barcode will be checked for existnce
      if (articles[curCode]) {
        articles[curCode].inStock += count;
      } else if (sapcode) {
        articles[sapcode].inStock += count;
      } else {
        articles[curCode] = {
          barcode: [curCode],
          masterBarcode: curCode,
          orpakStock: 0,
          inStock: count,
          name,
          supplier: "-",
          group: "-",
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

    //check whether sapcode and barcode are valid
    if (sapcodeRegex.test(curSapcode) && barcodeRegex.test(curBarcode)) {
      //check whether current barcode already exists in articles.
      if (articles[curSapcode]) {
        //if barcode does not exist, it will be added as property with 0 instock and 0 orpakStock.
        if (!articles[curSapcode].allBarcodes.includes(curBarcode)) {
          articles[curSapcode].allBarcodes.push(curBarcode);
        }

        //it will be calculated
        articles[curSapcode].orpakStock += orpakStock;
        articles[curSapcode].masterBarcode = curBarcode;
      } else if (!articles[curSapcode]) {
        //if such sapcode does not exist it will be added as a new property.
        articles[curSapcode] = {
          allBarcodes: [curBarcode],
          masterBarcode: curBarcode,
          inStock: 0,
          orpakStock,
          name: "-",
          group: "-",
          supplier: "-",
        };
      }
    }
  });

  return articleState;
};

const importSapArticles = (fileData, articleState) => {
  const articles = { ...articleState };
  fileData.split("\n").forEach((line) => {
    const data = line.split(";").map((e) => e);

    const barcode = data[0];
    const sapcode = data[1];
    const name = data[2];
    const supplier = data[3];
    const group = data[4];
    const sapcodeRegex = /^\d{9}$/;
    const barcodeRegex = /^\d{1,13}$/;

    if (sapcodeRegex.test(sapcode) && barcodeRegex.test(barcode)) {
      //if sapcode do not exists, creates new object, else check if
      if (articles[sapcode]) {
        if (!articles[sapcode].allBarcodes.includes(barcode)) {
          articles[sapcode].allBarcodes.push(barcode);
        }
      } else {
        articles[sapcode] = {
          name,
          allBarcodes: [barcode],
          inStock: 0,
          orpakStock: 0,
          masterBarcode: null,
          supplier,
          group,
        };
      }
    }
  });

  return articles;
};

const importFiles = (sapData, orpakData, fsData) => {
  const sap = importSapArticles(sapData, {});
  const orpak = importOrpakArticles(orpakData, sap);
  const result = importCountedArticles(fsData, orpak);

  return Object.keys(result).reduce((acc, sap) => {
    const item = {
      sapcode: sap,
      barcode: result[sap].masterBarcode,
      orpakStock: result[sap].orpakStock,
      inStock: result[sap].inStock,
      supplier: result[sap].supplier,
      group: result[sap].group,
      name: result[sap].name,
    };

    if (item.inStock || item.orpakStock) {
      acc.push(item);
    }

    return acc;
  }, []);
};

export default importFiles;
