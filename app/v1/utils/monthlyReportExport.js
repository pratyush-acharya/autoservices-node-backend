import {logger} from "./logger.js";
import * as ExcelJS from "exceljs";


export const makeMonthlyJson = (data) => {
    let reportObject = []

    try {
        data.forEach((item) => {
            let report = {
                "date": item.startDate,
                "vehicle_name": item.vehicle.name,
                "vehicle_number": item.vehicle.number,
                "technician": item.employee.name,
                "customer_name": item.user.name,
                "contact_number": item.user.phone_number,
                "paid": item.status === "paid" ? "Yes" : "No",
                "new_customer": item.newCustomer ? "Yes" : "No",
                "services": item.solutions.map(solution => solution.detail).join(", "),
                "total_cost": item.solutions.reduce((accumulator, solution) => {
                    if (solution.state === 'completed') {
                        return accumulator + solution.price;
                    }
                }, 0),
                "discount_type": item.discount.type,
                "discount": item.discount.amount,
            }
            reportObject.push(report)
        })
        return reportObject
    } catch (e) {
        logger.error(`Error during JSON MAKE (Report Generation): ` + e.message);
        throw new Error("Failed to process service request.");
    }
}


export const monthlyReport = async (data) => {
    let name = `${Date.now()}.xlsx`
    try {
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet("Monthly Report")

        worksheet.columns = [
            {header: "S. No", key: "s_no", width: 5},
            {header: 'Date (A.D.)', key: "date", width: 20},
            {header: 'Vehicle Model', key: "vehicle_name", width: 15},
            {header: 'Vehicle Number', key: "vehicle_number", width: 15},
            {header: "Technician", key: "technician", width: 20},
            {header: "Customer Name", key: "customer_name", width: 20},
            {header: "Customer Number", key: "customer_number", width: 20},
            {header: "Paid (Y/N)", key: "paid", width: 20},
            {header: "New Customer (Y/N)", key: "new_customer", width: 10},
            {header: "Services", key: "services", width: 10},
            {header: "Total Cost", key: "total_cost", width: 10},
            {header: "Discount Type", key: "discount_type", width: 10},
            {header: "Discount", key: "discount", width: 10}
        ]

        data.map((row, index) => {
            row.s_no = index + 1
            worksheet.addRow(row);
        });

        worksheet.views = [
            {state: 'frozen', ySplit: 1, xSplit: 1, activeCell: 'A1'}
        ];

        await workbook.xlsx.writeFile(`./storage/reports/monthly/${name}`);
        return workbook;
    } catch (err) {
        logger.error("Error in generating Monthly Report: ", err.message)
        throw new Error("Error in generating Monthly Report.")
    }
}