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

let total = 0;

/*
 * Initialize table here
 */
notebookList.forEach(value => {
  insertRows(countDataTable, value);
});

tunnelList.forEach(value => {
  insertRows(countTunnelTable, value);
});

featureList.forEach(value => {
  insertRows(countFeatureTable, value);
});

tempFileHostList.forEach(value => {
  insertRows(countTempHostTable, value);
});

webuiVersionList.forEach(value => {
  insertRows(countWebUIVersionTable, `webui-version-${value}`, value);
});

extensionsVersionList.forEach(value => {
  insertRows(countExtensionsVersionTable, `extensions-version-${value}`, value);
});

/*
 * Fetch data
 */

notebookList.forEach(value => {
  fetchDataToDisplay({
    value: value,
    tableToSort: countDataTable,
    totalSpan: totalSpan,
    sortOrder: 1,
  });
});

tunnelList.forEach(value => {
  fetchDataToDisplay({
    value: value,
    formattedValue: `tunnel-${value}`,
    tableToSort: countTunnelTable,
    sortOrder: 1,
  });
});

featureList.forEach(value => {
  fetchDataToDisplay({ value: value });
});

tempFileHostList.forEach(value => {
  fetchDataToDisplay({
    value: value,
    formattedValue: `zip-temp-host-${value}`,
    tableToSort: countTempHostTable,
    sortOrder: 1,
  });
});

webuiVersionList.forEach(value => {
  fetchDataToDisplay({
    value: `webui-version-${value}`,
    formattedValue: `webui-version-${value}`,
    tableToSort: countWebUIVersionTable,
    sortOrder: 1,
  });
});

extensionsVersionList.forEach(value => {
  fetchDataToDisplay({
    value: `extensions-version-${value}`,
    formattedValue: `extensions-version-${value}`,
    tableToSort: countExtensionsVersionTable,
    sortOrder: 1,
  });
});

/*
 * Functions
 */

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

  let tdName = document.createElement('td');
  tdName.innerHTML = displayText;

  let tdCount = document.createElement('td');
  tdCount.innerHTML = "?";
  tdCount.id = value;

  tr.appendChild(tdName);
  tr.appendChild(tdCount);

  table.appendChild(tr);
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