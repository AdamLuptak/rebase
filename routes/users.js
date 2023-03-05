var express = require('express');
var router = express.Router();
const reportGenerator = require('../sheet-generator/sheet-generator');
const fs = require("fs");
const path = require("path");
var AdmZip = require("adm-zip");
var XlsxTemplate = require('xlsx-template');
var XLSX = require('xlsx')
const excel = require("exceljs");
const moment = require("moment-business-days");

/* GET users listing. */
router.get('/', function (req, res, next) {
    fs.readFile(path.join(__dirname, 'templates', 'template.xlsx'), function (err, data) {
        const companyName = 'METIQ Timesheet 50hertz';
        const employeeName = 'Adam Luptak REBASE';
        const reportMonth = '01-02-2023';
        const reportMoment = moment(reportMonth, 'DD-MM-YYYY')
        const monthName = reportMoment.format('MMMM');
        const monthBusinessDays = reportMoment.monthBusinessDays()
        const sheetNumber = 1;
        const outputFileName = `${companyName} ${reportMoment.toDate().toDateString()} ${employeeName}.xlsx`
        const template = new XlsxTemplate(data);

        const workdays = monthBusinessDays.map(m => {
            return {date: m.toDate(), data: {hours: 8, comment: "working on tasks, meetings"}}
        })

        const values = {
            month: monthName,
            workday: workdays
        };

        template.substitute(sheetNumber, values);
        const generateBytes = template.generate()

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,base64"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + outputFileName
        );
        res.send(Buffer.from(generateBytes, 'binary'))
    });
});


module.exports = router;
