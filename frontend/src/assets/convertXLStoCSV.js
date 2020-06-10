import XLSX from "xlsx";

const convertXLSXtoCSV = async(file) => {

    const slsxBlob = new Blob([file]);
    const slsxData = await slsxBlob.arrayBuffer();
    const wb = XLSX.read(slsxData, { type: "buffer" });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_csv(ws, {
      header: 1,
      FS: ";",
      RS: "\n",
    });

    return data
}

export default convertXLSXtoCSV;