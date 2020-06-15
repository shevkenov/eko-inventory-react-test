const importCountedArticles = (filedata, articleState) => {
  const articles = { ...articleState };
  filedata.split("\r\n").forEach((line) => {
    const data = line.split(";").map((e) => e);

    const barcodeRegex = /^\d{1,13}$/;
    const curCode = data[0];
    const count = Number(data[1]);
    const name = data[2];

    if (barcodeRegex.test(curCode)) {
      const sapcode = Object.keys(articles).find(
        (sCode) => sCode === curCode
      );

      //if sapcode exists, the relevant barcode will be checked for existnce
      if (sapcode) {
        const barcode = Object.keys(articles[sapcode].barcode).find(bCode => bCode === curCode);

        if (barcode) {
          
          //if barcode exists to the relevant sapcode, the inStock will be calculated
          articles[sapcode].barcode[barcode].inStock += count;

        } else {

          //if does not exists to the relevant sapcode, all sapcode properties will be copied and a barcode property will be created
          articles[sapcode] = {
            ...articles[sapcode],
            barcode: {
              ...articles[sapcode].barcode,
              [curCode]: {
                orpakStock: 0,
                inStock: count,
              },
            },
          };

        }
      } else {
        const sapcode = Object.keys(articles).find(sCode => articles[sCode].barcode && articles[sCode].barcode[curCode])

        if (sapcode) {
          
          articles[sapcode].barcode[curCode].inStock += count;
        }else{

          //if sapcode does not exists it will be initiated as sapcode and barcode
          articles[curCode] = {
            sapcode: curCode,
            barcode: {
              [curCode]: {
                orpakStock: 0,
                inStock: count,
              },
            },
            name,
            supplier: "-",
            group: "-",
          };
        }

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
        //if barcode exists, orpakStock will be calculated, otherwise the barcode will be added as property with initial instock and orpakStock
        if (!articles[curSapcode].barcode[curBarcode]) {
          articles[curSapcode].barcode[curBarcode] = {
            inStock: 0,
            orpakStock: 0,
          };
        }

        articles[curSapcode].barcode[curBarcode].orpakStock += orpakStock;
      } else if (!articles[curSapcode]) {
        articles[curSapcode] = {
          sapcode: curSapcode,
          barcode: {
            [curBarcode]: {
              inStock: 0,
              orpakStock,
            },
          },
          name: "-",
          group: "-",
          supplier: "-",
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

    const barcode = data[0];
    const sapcode = data[1];
    const name = data[2];
    const supplier = data[3];
    const group = data[4];
    const sapcodeRegex = /^\d{9}$/;
    const barcodeRegex = /^\d{1,13}$/;

    if (sapcodeRegex.test(sapcode) && barcodeRegex.test(barcode)) {
      //if sapcode do not exists, creates new object, else check if
      if (!articles[sapcode]) {
        articles[sapcode] = {
          name,
          barcode: {
            [barcode]: {
              orpakStock: 0,
              inStock: 0,
            },
          },
          supplier,
          group,
        };
      } else if (!articles[sapcode].barcode[barcode]) {
        articles[sapcode].barcode[barcode] = {
          orpakStock: 0,
          inStock: 0,
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

  //console.log(result);
  return Object.keys(result).reduce((acc, sap) => {
    const barcodes = { ...result[sap].barcode };

    Object.keys(barcodes).forEach((bcode) => {
      const item = {
        sapcode: sap,
        name: result[sap].name,
        barcode: bcode,
        orpakStock: result[sap].barcode[bcode].orpakStock,
        inStock: result[sap].barcode[bcode].inStock,
        supplier: result[sap].supplier,
        group: result[sap].group,
      };

      if (item.inStock || item.orpakStock) {
        acc.push(item);
      }
    });

    return acc;
  }, []);
};

export default importFiles;
