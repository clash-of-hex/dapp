const fs = require('fs');

const CONFIG_PATH = '../../config.json';


const saveConf = (data) => {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, false, ' '), 'utf8');
};

const readConf = () => {
  let rawdata = fs.readFileSync(CONFIG_PATH);
  return JSON.parse(rawdata);
};


module.exports = {
  saveConf,
  readConf
};
