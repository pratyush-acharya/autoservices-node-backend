import { logger } from "./logger.js";
import ExcelJS from "exceljs";

export const inQueueJson = (data) => {
  let reportObject = [];

  try {
    data.forEach((item) => {
      const total_cost = item.solutions.reduce((accumulator, solution) => {
        if (solution.state == "completed") {
          return accumulator + solution.price;
        } else {
          return accumulator + 0;
        }
      }, 0);
      const leftover_work = item.solutions.map((solution) => (solution.state != "completed" ? solution.detail : "")).join(", ");
      console.log(item.employee);
      let report = {
        date: item.startDate,
        vehicle_name: item.vehicle.model,
        vehicle_number: item.vehicle.number,
        technician: item.employee.name,
        customer_name: item.user.name,
        contact_number: item.user.phone_number,
        total_cost: total_cost,
        leftover_work: leftover_work,
      };

      reportObject.push(report);
    });
    return reportObject;
  } catch (e) {
    logger.error(`Error during JSON MAKE (Report Generation): ` + e.message);
    console.log(e.message);
    throw new Error("Failed to process service request.");
  }
};

export const inQueueReport = async (data) => {
  let name = `${Date.now()}.xlsx`;
  try {
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("In Queue Report");

    worksheet.columns = [
      { header: "S. No", key: "s_no", width: 5 },
      { header: "Date (A.D.)", key: "date", width: 20 },
      { header: "Vehicle Model", key: "vehicle_name", width: 15 },
      { header: "Vehicle Number", key: "vehicle_number", width: 15 },
      { header: "Technician", key: "technician", width: 20 },
      { header: "Customer Name", key: "customer_name", width: 20 },
      { header: "Customer Number", key: "customer_number", width: 20 },
      { header: "Expected Earnings", key: "total_cost", width: 10 },
      { header: "Remaining Task", key: "leftover_work", width: 10 },
    ];

    data.map((row, index) => {
      row.s_no = index + 1;
      worksheet.addRow(row);
    });

    worksheet.views = [{ state: "frozen", ySplit: 1, xSplit: 1, activeCell: "A1" }];

    await workbook.xlsx.writeFile(`./storage/reports/monthly/${name}`);
    return name;
  } catch (err) {
    logger.error("Error in generating Monthly Report: ", err.message);
    throw new Error("Error in generating Monthly Report.");
  }
};
