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

async function getCount(key) {
  const response = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`);
  return response.json();
}

let total = 0;

notebookList.forEach(value => {
  const countSpan = document.getElementById(value);
  const totalSpan = document.getElementById('total');
  getCount(value).then(data => {
    countSpan.innerHTML = data.value || 0;
    total += data.value;
    totalSpan.innerHTML = total || 0;

    sortTable(1);
  });
});

// 0 = desc
// 1 = asc
function sortTable(sort = 0) {
  let table = document.getElementById("count-table");
  let rows = Array.from(table.getElementsByTagName("tr"));
  let header = rows.shift(); // Remove the header row from the array

  rows.sort(function (a, b) {
    var countA = parseInt(a.getElementsByTagName("td")[1].innerHTML);
    var countB = parseInt(b.getElementsByTagName("td")[1].innerHTML);
    if (sort == 0) {
      return countA - countB;
    } else {
      return countB - countA;
    }
  });

  table.innerHTML = ""; // Clear the existing rows from the table

  table.appendChild(header); // Append the header back

  rows.forEach(function (row) {
    table.appendChild(row); // Append the sorted rows to the table
  });
}