const namespace = 'NUROISEA/anime-webui-colab';
const currentTime = Date.now();

const notebookList = [
  '7th_layer',
  '8528-diffusion',
  'animeinourworld',
  'any_gape_mix',
  'anything_mix',
  'anything_v3',
  'anything_v4',
  'baka_diffusion',
  'camelliamix',
  'chameleonai-mix',
  'counterfeit',
  'dark_sushi_mix',
  'drbob2142_mix_models',
  'eimis_anime_diffusion',
  'elysium_anime',
  'everything',
  'evt_v3',
  'expmix_line',
  'grapefruit',
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
  'voxo',
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
  'fallback', 'stable', 'latest', 'latest-dev', 'ui-redesign'
];
const extensionsVersionList = [
  'none', 'lite', 'stable', 'latest', 'experimental'
];
const controlnetVersionList = [
  'none', 'v1.0', 'v1.0-diff', 't2i', 'v1.1'
];

const suffixes = [
  'total',
  'today',
  '1d',
  '2d',
  '3d',
  '4d',
  '5d',
  '6d',
  '7d',
];

const countDataTable = document.getElementById('count-table');
const countFeatureTable = document.getElementById('feature-count-table');
const countTunnelTable = document.getElementById('tunnel-count-table');
const countTempHostTable = document.getElementById('temp-host-count-table');
const countWebUIVersionTable = document.getElementById('webui-version-count-table');
const countExtensionsVersionTable = document.getElementById('extensions-version-count-table');
const countControlNetVersionTable = document.getElementById('controlnet-version-count-table');

let globalTotal = 0;
let globalDailyTotal = 0;
let globalWeeklyTotalArray = [0, 0, 0, 0, 0, 0, 0];
let globalWeeklyTotal = 0;
let notebookDataLoadedCount = 0;

notebookList.forEach(value => {
  insertRows(countDataTable, value, value);
});

tunnelList.forEach(value => {
  insertRows(countTunnelTable, value, value);
});

featureList.forEach(value => {
  insertRows(countFeatureTable, value, value);
});

tempFileHostList.forEach(value => {
  insertRows(countTempHostTable, value, value);
});

webuiVersionList.forEach(value => {
  insertRows(countWebUIVersionTable, `webui-version-${value}`, value);
});

extensionsVersionList.forEach(value => {
  insertRows(countExtensionsVersionTable, `extensions-version-${value}`, value);
});

controlnetVersionList.forEach(value => {
  insertRows(countControlNetVersionTable, `controlnet-version-${value}`, value);
});

/*
 * Fetch data
 */
notebookList.forEach(value => {
  fetchDataToDisplay({
    value: value,
    formattedValue: `notebook-${value}`,
    tableToSort: countDataTable,
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
  fetchDataToDisplay({
    value: value
  });
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

controlnetVersionList.forEach(value => {
  fetchDataToDisplay({
    value: `controlnet-version-${value}`,
    formattedValue: `controlnet-version-${value}`,
    tableToSort: countControlNetVersionTable,
    sortOrder: 1,
  });
});


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
  const response = await fetch(`https://api.visitorbadge.io/api/status?path=${namespace}/${key}`);
  return response.json();
}

function insertRows(table, value, displayText = value) {
  let tr = document.createElement('tr');
  tr.classList.add('inserted-row');

  let tdName = document.createElement('td');
  tdName.id = `cell-${value}`;
  tdName.innerHTML = displayText;
  tr.appendChild(tdName);

  suffixes.forEach(suffix => {
    let tableCell = document.createElement('td');
    tableCell.innerHTML = "?";
    tableCell.id = `${value}-${suffix}`;
    tableCell.classList.add('number');
    tr.appendChild(tableCell);
  });

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

function cellCompare(tableCell, subject, comparison) {
  if (subject > comparison) {
    tableCell.classList.add('higher');
  } else if (subject < comparison) {
    tableCell.classList.add('lower');
  }
}

function fetchDataToDisplay({
  value,
  formattedValue = value,
  tableToSort = false,
  sortOrder = 0,
}) {
  getCount(formattedValue).then(data => {
    const total = data.total;
    const today = data.today;
    const week = data.dailyResults;

    let weekIterator = 0;
    suffixes.forEach(suffix => {
      const tableCell = document.getElementById(`${value}-${suffix}`)

      if (suffix == 'total') {
        tableCell.innerHTML = total;
      } else if (suffix == 'today') {
        tableCell.innerHTML = today;
        cellCompare(tableCell, today, week[0].total);
      } else {
        const dayCount = week[weekIterator].total;
        tableCell.innerHTML = dayCount;

        if (weekIterator + 1 < 7) {
          cellCompare(
            tableCell,
            dayCount,
            week[weekIterator + 1].total
          );
        }

        weekIterator += 1;
      }
    });

    if (formattedValue.includes('notebook')) {
      globalTotal += total;
      globalDailyTotal += today;

      document.getElementById('total-overall').innerHTML = globalTotal;
      document.getElementById('total-daily').innerHTML = globalDailyTotal;

      week.forEach((data, index) => {
        const weekTotal = data.total;
        globalWeeklyTotalArray[index] += weekTotal;
        globalWeeklyTotal += weekTotal;
        document.getElementById(`week-${index + 1}d`).innerHTML = globalWeeklyTotalArray[index];
        document.getElementById(`total-weekly`).innerHTML = globalWeeklyTotal;
      });

      notebookDataLoadedCount += 1;
      document.getElementById('loaded-notebook').innerHTML = notebookDataLoadedCount;
    }

    let tdName = document.getElementById(`cell-${value}`);
    let statusLink = `https://visitorbadge.io/status?path=${namespace}/${formattedValue}`;

    tdName.innerHTML += `<a href="${statusLink}">↗</a>`
  });
}

document.getElementById('current-time').innerHTML = new Date(currentTime);
document.getElementById('notebook-count').innerHTML = notebookList.length;