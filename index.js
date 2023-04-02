Date.prototype.getWeekNumber = function () {
  // https://stackoverflow.com/a/6117889
  let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  let dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

// this is not march 1, month is 0 indexed
const MIN_DATE = new Date(Date.UTC(2023, 03, 01));
const DATE_NOW = new Date();
const NOW_UTC = new Date(
  Date.UTC(DATE_NOW.getUTCFullYear(), DATE_NOW.getUTCMonth(), DATE_NOW.getUTCDate())
);
const WEEK = 7 * 24 * 60 * 60 * 1000;

const namespace = 'nuroisea-anime-webui-colab';

const notebookList = [
  '7th_layer',
  '8528-diffusion',
  'animeinourworld',
  'any_gape_mix',
  'anything_mix',
  'anything_v3',
  'anything_v4',
  'baka_diffusion',
  'chameleonai-mix',
  'counterfeit',
  'drbob2142_mix_models',
  'eimis_anime_diffusion',
  'elysium_anime',
  'everything',
  'evt_v3',
  'expmix_line',
  'hddream_g',
  'hentai_diffusion',
  'ligne_claire_anime_diffusion',
  'midnight_mixes',
  'misobarisic_playground',
  'mix-pro-v3',
  'mixing-cauldron',
  'momocha_mix',
  'open_anime_journey',
  'orange_mixs',
  'pastel_mix',
  'plat-diffusion',
  'protothing_200',
  'provide_your_own_models',
  'rasgeath_self_made_sauce',
  'shirayuki_model',
  'something',
  'soul0000',
  'waifu_diffusion',
  'waifuanything',
];
const featureList = [
  'gdrive-output', 'zip-to-gdrive', 'zip-to-temp-host', 'local-delete-outputs',
];
const tunnelList = [
  'gradio', 'ngrok', 'cloudflared', 'localhostrun', 'remotemoe'
];
const tempFileHostList = [
  'bashupload.com', 'keep.sh', 'temp.sh', 'transfer.sh'
];
const webuiVersionList = [
  'stable', 'latest', 'ui-redesign'
];
const extensionsVersionList = [
  'none', 'lite', 'stable', 'latest', 'experimental'
];

const countDataTable = document.getElementById('count-table');
const countFeatureTable = document.getElementById('feature-count-table');
const countTunnelTable = document.getElementById('tunnel-count-table');
const countTempHostTable = document.getElementById('temp-host-count-table');
const countWebUIVersionTable = document.getElementById('webui-version-count-table');
const countExtensionsVersionTable = document.getElementById('extensions-version-count-table');
const totalSpan = document.getElementById('total');

const timeSelector = document.getElementById('time-span');

let total = 0;

function loadTables(suffix = '') {
  totalSpan.innerHTML = '0';
  // this is so cringe

  // TODO: clean up the suffix thingy
  notebookList.forEach(value => {
    insertRows(countDataTable, value + suffix, value);
  });

  tunnelList.forEach(value => {
    insertRows(countTunnelTable, value + suffix, value);
  });

  featureList.forEach(value => {
    insertRows(countFeatureTable, value + suffix, value);
  });

  tempFileHostList.forEach(value => {
    insertRows(countTempHostTable, value + suffix, value);
  });

  webuiVersionList.forEach(value => {
    insertRows(countWebUIVersionTable, `webui-version-${value}` + suffix, value);
  });

  extensionsVersionList.forEach(value => {
    insertRows(countExtensionsVersionTable, `extensions-version-${value}` + suffix, value);
  });

  /*
   * Fetch data
   */
  notebookList.forEach(value => {
    fetchDataToDisplay({
      value: value + suffix,
      tableToSort: countDataTable,
      totalSpan: totalSpan,
      sortOrder: 1,
    });
  });

  tunnelList.forEach(value => {
    fetchDataToDisplay({
      value: value + suffix,
      formattedValue: `tunnel-${value}` + suffix,
      tableToSort: countTunnelTable,
      sortOrder: 1,
    });
  });

  featureList.forEach(value => {
    fetchDataToDisplay({
      value: value + suffix
    });
  });

  tempFileHostList.forEach(value => {
    fetchDataToDisplay({
      value: value + suffix,
      formattedValue: `zip-temp-host-${value}` + suffix,
      tableToSort: countTempHostTable,
      sortOrder: 1,
    });
  });

  webuiVersionList.forEach(value => {
    fetchDataToDisplay({
      value: `webui-version-${value}` + suffix,
      formattedValue: `webui-version-${value}` + suffix,
      tableToSort: countWebUIVersionTable,
      sortOrder: 1,
    });
  });

  extensionsVersionList.forEach(value => {
    fetchDataToDisplay({
      value: `extensions-version-${value}` + suffix,
      formattedValue: `extensions-version-${value}` + suffix,
      tableToSort: countExtensionsVersionTable,
      sortOrder: 1,
    });
  });
}

function sortTable(table, sort = 0) {
  // 0 = desc
  // 1 = asc
  // thanks chatgpt lmao
  let rows = Array.from(table.getElementsByTagName("tr"));
  let header = rows.shift();

  rows.sort(function (a, b) {
    let countA = parseInt(a.getElementsByTagName("td")[1].innerHTML);
    let countB = parseInt(b.getElementsByTagName("td")[1].innerHTML);
    if (sort == 0) {
      return countA - countB;
    } else {
      return countB - countA;
    }
  });

  table.innerHTML = "";
  table.appendChild(header);

  rows.forEach(function (row) {
    table.appendChild(row);
  });
}

async function getCount(key) {
  const response = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`);
  return response.json();
}

function insertRows(table, value, displayText = value) {
  let tr = document.createElement('tr');
  tr.classList.add('inserted-row');

  let tdName = document.createElement('td');
  tdName.innerHTML = displayText;

  let tdCount = document.createElement('td');
  tdCount.innerHTML = "?";
  tdCount.id = value;

  tr.appendChild(tdName);
  tr.appendChild(tdCount);

  table.appendChild(tr);
}

function destroyInsertedRows(targetClass = 'inserted-row') {
  let insertedRows = document.getElementsByClassName(targetClass);

  if (insertedRows.length) {
    for (const row of insertedRows) {
      row.parentElement.removeChild(row);
    }

    destroyInsertedRows(targetClass)
  }

}

function fetchDataToDisplay({
  value,
  formattedValue = value,
  tableToSort = false,
  sortOrder = 0,
  totalSpan = false,
}) {
  const countSpan = document.getElementById(value);

  getCount(formattedValue).then(data => {
    countSpan.innerHTML = data.value || 0;

    if (totalSpan) {
      let currentTotal = parseInt(totalSpan.innerHTML);
      currentTotal += data.value || 0;
      totalSpan.innerHTML = currentTotal;
    }

    if (tableToSort) {
      sortTable(tableToSort, sortOrder);
    }
  });
}

function suffixGenerator(mode = 'none') {
  let indicator = '';
  let year = NOW_UTC.getUTCFullYear().toString().substring(2);
  let identifier = '';

  if (mode === 'none') {
    return '';
  }

  if (mode === 'week') {
    indicator = 'w';
    identifier = NOW_UTC.getWeekNumber().toString().padStart(2, '0');
  } else if (mode === 'month') {
    indicator = 'm';
    identifier = NOW_UTC.getUTCMonth().toString().padStart(2, '0');
  }

  return `-${indicator}${year}${identifier}`;
}

timeSelector.addEventListener('change', event => {
  const value = event.target.value;

  const suffix = {
    'all': '',
    'week': suffixGenerator('week'),
    'month': suffixGenerator('month'),
  }

  const noticeText = {
    'all': 'Data from 2023.03.13',
    'week': `Data from week #${NOW_UTC.getWeekNumber()} of the year ${NOW_UTC.getUTCFullYear()}`,
    'month': `Data from month #${NOW_UTC.getUTCMonth()} of the year ${NOW_UTC.getUTCFullYear()}`,
  }

  let notice = document.getElementById('notice');
  notice.innerHTML = noticeText[value];

  destroyInsertedRows();
  loadTables(suffix[value]);
});

let changeEvent = new Event('change');
timeSelector.dispatchEvent(changeEvent);