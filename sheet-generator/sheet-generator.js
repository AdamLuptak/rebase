var XlsxTemplate = require('xlsx-template');
const fs = require('fs');
const path = require('path');
const moment = require('moment-business-days');
process.env.TZ = 'Etc/Universal'; // UTC +00:00

const generate = async (companyName, employeeName) => {
     return fs.readFile(path.join(__dirname, 'templates', 'template.xlsx'), function (err, data) {

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
        fs.writeFileSync(outputFileName, generateBytes, "binary");
    });
}


module.exports = {generate}
