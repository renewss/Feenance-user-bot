const excel = require('exceljs');
const axios = require('axios').default;

const wb = new excel.Workbook();
let out = new Array();

async function init() {
  try {
    // await wb.xlsx.readFile('/home/renewss/Downloads/Telegram Desktop/leads.xlsx');

    await wb.xlsx.readFile('/home/renewss/Downloads/Telegram Desktop/F-c.xlsx');
    let wsh = wb.getWorksheet(1);
    for (let i = 2; i <= wsh.rowCount; i++) {
      // reading and formatting  name
      const obj = extractNumber(wsh.getCell(i, 3).model.value);
      if (!obj) continue;

      // reading and attaching lead link
      const leadRaw = wsh.getCell(i, 2).model.value;
      if (!leadRaw) continue;

      obj.link = [extractLead(leadRaw)];
      out.push(obj);
    }
    console.log(out.length, wsh.rowCount);

    await wb.xlsx.readFile('/home/renewss/Downloads/Telegram Desktop/K-c.xlsx');
    wsh = wb.getWorksheet(1);
    for (let i = 2; i <= wsh.rowCount; i++) {
      const obj = extractNumber(wsh.getCell(i, 3).model.value);
      if (!obj) continue;

      const leadRaw = wsh.getCell(i, 2).model.value;
      if (!leadRaw) continue;

      let isExists = false;
      out.forEach((val, i) => {
        if (val.name === obj.name) {
          out[i].link.push(extractLead(leadRaw));
          isExists = true;
        }
      });

      if (!isExists) {
        obj.link = [extractLead(leadRaw)];
        out.push(obj);
      }
    }
    console.log(out.length, wsh.rowCount);

    // Deleting Duplicate email(number)
    const nums = new Object();
    out.forEach((val, i) => {
      if (!nums[val.email]) nums[val.email] = new Array(val);
      else nums[val.email].push(val);
    });

    // Object.values(nums).forEach((val) => {
    //   if (val.length > 1) {
    //     console.log(val.length);
    //     console.log('###############################################');
    //   }
    // });

    out = Object.values(nums).map((val) => {
      return val[0];
    });

    // Sending Request
    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNWUzNGQ4YmQyMTgwMzI2NmI1ZTMwMSIsImlhdCI6MTYwMDkzNTY5OCwiZXhwIjoxNjAxNzk5Njk4fQ.hEVNV_fiTSh7oE26f2Y7BIch4lFHArAeiub-5LkQL3c`,
      },
    };
    // const url = 'http://127.0.0.1:3030/api/v1/user/';
    const url = 'https://feenance-api.herokuapp.com/api/v1/user/';

    // dividing to smaller parts, as request size is too large
    const prms = new Array();
    let i = 0;
    while (i < out.length - 1) {
      let j = i + 100 >= out.length ? out.length - 1 : i + 100;
      prms.push(axios.post(url, out.slice(i, j), config));

      i += 100;
    }

    console.time();
    console.log('Waiting for promises...');
    await Promise.all(prms);
    console.log('Done!', out.length);
    console.timeEnd();
  } catch (err) {
    console.log(err, 000000000000000);
  }
}
init();

/** Extracts tel number from string.
 *  Returns updated string and tel number as a object
 */
function extractNumber(text) {
  const allowedChars = ['-', '.', ' '];
  let countOfDigits = 0;
  let countOfSpaces = 0;

  let firstDigit;
  for (const i in text) {
    if (isDigit(text[i])) {
      if (!countOfDigits) firstDigit = text[i];
      countOfDigits++;
    } else if (allowedChars.includes(text[i]) && countOfDigits > 0) {
      countOfSpaces++;
    } else {
      countOfDigits = 0;
      countOfSpaces = 0;
    }

    if (countOfDigits === 9 || (firstDigit != 9 && countOfDigits === 7)) {
      let number = text
        .slice(i - (countOfDigits + countOfSpaces - 1))
        .split(/[\.\s-]+/) // match space or dash
        .join('');

      let name = text.slice(0, i - (countOfDigits + countOfSpaces));
      name = name.slice(0, -1);
      number = number.slice(0, countOfDigits);

      return {
        name,
        email: number,
        telNumber: number,
        password: number,
        confirmPassword: number,
        role: 'User',
      };
    } else if (i == text.length - 1) {
      return false;
    }
  }

  return null;
}

function isDigit(c) {
  return c >= '0' && c <= '9';
}

function extractLead(text) {
  const leads = {
    Дилноза: '5f6c59dcba08142517ff5f73',
    Дилшода: '5f6c59dcba08142517ff5f71',
    Бекзод: '5f6c59dcba08142517ff5f77',
    Суннат: '5f6c59dcba08142517ff5f75',
    Феруз: '5f6c59dcba08142517ff5f7c',
    Нилуфар: '5f6c59dcba08142517ff5f7a',
    Мафтуна: '5f6c59dcba08142517ff5f7e',
    Алишер: '5f6c59dcba08142517ff5f80',
    Гулзира: '5f6c59dcba08142517ff5f82',
    Суръат: '5f6c59dcba08142517ff5f84',
  };

  const branchList = {
    Феендо: 'Feendo',
    Конти: 'Konti',
  };

  const leadArr = text.split(' ');

  if (leadArr.length === 2) return { branch: branchList[leadArr[0]], reference: leads[leadArr[1]] };
  else if (leadArr.length === 3)
    return { branch: branchList[leadArr[0]], reference: leads[leadArr[2]] };
  else return { branch: branchList[leadArr[0]], reference: leads[leadArr[2].split(',')[0]] };
}
