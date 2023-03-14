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
  'momocha_mix',
  'open_anime_journey',
  'orange_mixs',
  'pastel_mix',
  'plat-diffusion',
  'protothing_200',
  'provide_your_own_models',
  'rasgeath_self_made_sauce',
  'shirayuki_model',
  'soul0000',
  'waifu_diffusion',
  'waifuanything',
];
const featureList = [
  'gdrive-output'
];
const tunnelList = [
  'gradio', 'ngrok', 'cloudflared', 'localhostrun', 'remotemoe'
];

const countDataTable = document.getElementById("count-table");
const countFeatureTable = document.getElementById("feature-count-table");
const countTunnelTable = document.getElementById("tunnel-count-table");

async function getCount(key) {
  const response = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`);
  return response.json();
}

let total = 0;

notebookList.forEach(value => { 
  let tr = document.createElement('tr');
  
  let tdName = document.createElement('td');
  tdName.innerHTML = value;

  let tdCount = document.createElement('td');
  tdCount.innerHTML = "0";
  tdCount.id = value;

  tr.appendChild(tdName);
  tr.appendChild(tdCount);

  countDataTable.appendChild(tr);
});

tunnelList.forEach(value => {
  let tr = document.createElement('tr');

  let tdName = document.createElement('td');
  tdName.innerHTML = value;

  let tdCount = document.createElement('td');
  tdCount.innerHTML = "0";
  tdCount.id = value;

  tr.appendChild(tdName);
  tr.appendChild(tdCount);

  countTunnelTable.appendChild(tr);
});

notebookList.forEach(value => {
  const countSpan = document.getElementById(value);
  const totalSpan = document.getElementById('total');
  getCount(value).then(data => {
    countSpan.innerHTML = data.value || 0;
    total += data.value;
    totalSpan.innerHTML = total || 0;

    sortTable(countDataTable,1);
  });
});

tunnelList.forEach(value => {
  const countSpan = document.getElementById(value);
  getCount(`tunnel-${value}`).then(data => {
    countSpan.innerHTML = data.value || 0;
    sortTable(countTunnelTable, 1);
  });
});

featureList.forEach(value => { 
  const countSpan = document.getElementById(value);
  getCount(value).then(data => { 
    countSpan.innerHTML = data.value || 0;
  });
});

// 0 = desc
// 1 = asc
// thanks chatgpt lmao
function sortTable(table, sort = 0) {
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