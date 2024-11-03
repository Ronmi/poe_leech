function floor(x, n) {
  if (x < 0.001) { n = 4; }
  if (x < 0.01) { n = 3; }
  if (x < 0.1) { n = 2; }
  if (n === undefined) { n = 2; }
  if (n < 1) { return Math.floor(x); }
  return Math.floor(x * Math.pow(10, n)) / Math.pow(10, n);
}
// return an object with the following properties:
// - hit: average hit damage
// - total_lps: Maximum leech per second
// - ehr: Effective Hit Rate
// - lps: Max leech per second per instance
// - cap: Leech cap of one instance
// - lpi: Leech per instance
// - dur: Duration of one instance
// - count: Number of instances
// - ins: Instant leech per instance
// - ips: Instant leech per second
// - nlpi: Non-instant leech per instance
// - nps: Non-instant leech per second
// - rate: Leech per second (nps+ips)
function calc(
  mult,       // count of leech source, can be mobs hit by area skill, or number of
              // minions which hits the target
  damage,     // average damage
  aps,        // attack/cast per second
  hit_chance, // hit chance
  max_rate,   // percent of life to maximum leech rate (default 0.2=20%)
  mod,        // leech rate modifier (default 1)
  instant,    // instant leech rate (default 0, 0.1 = 10%)
  leech_rate, // % of damage leeched, for bone barrier, it's 0.1
  life,       // player max life
) {
  const hit = floor(damage / hit_chance); // average hit damage
  const ehr = floor(aps * hit_chance); // effective hit rate
  const cap =  floor(life * max_rate); // leech cap of one instance
  const lps = floor(life*mod*0.02); // max of leech per second per instance
  const lpi_cap = life * 0.1; // leech per instance cap
  const lpi = Math.min(floor(hit * leech_rate), lpi_cap); // leech per instance
  const ins = floor(lpi*instant); // instant leech per instance
  const total_lps = floor(life*max_rate);
  const ips = floor(ins*ehr*mult); // instant leech per second
  const nlpi = floor(lpi-ins); // uncapped non-instant leech rate per instance
  const dur = floor(nlpi / lps); // duration of one instance
  const count = floor(ehr*mult*Math.max(1, dur)); // number of instances
  const nlps = Math.min(nlpi, lps);
  const nps = Math.min(nlps*count, total_lps);
  const rate = nps + ips;
  return {
    hit,
    total_lps,
    ehr,
    lps,
    cap,
    lpi,
    dur,
    count,
    ins,
    ips,
    nlpi,
    nps,
    rate,
  };
}

function update_leech() {
  const params = ['life', 'damage', 'aps', 'hit_chance', 'mult', 'instant', 'max_rate', 'mod', 'leech_rate'];
  for (const param of params) {
    document.getElementById(param).style.border = '';
    if (isNaN(parseFloat(document.getElementById(param).value))) {
      document.getElementById(param).style.border = '1px solid red';
      return;
    }
  }

  const life = parseFloat(document.getElementById('life').value);
  if (life <= 0) {
    document.getElementById('life').style.border = '1px solid red';
    return;
  }
  const damage = parseFloat(document.getElementById('damage').value);
  if (damage <= 0) {
    document.getElementById('damage').style.border = '1px solid red';
    return;
  }
  const aps = parseFloat(document.getElementById('aps').value);
  if (aps <= 0) {
    document.getElementById('aps').style.border = '1px solid red';
    return;
  }
  const hit_chance = parseFloat(document.getElementById('hit_chance').value);
  if (hit_chance <= 0 || hit_chance > 100) {
    document.getElementById('hit_chance').style.border = '1px solid red';
    return;
  }
  const mult = parseFloat(document.getElementById('mult').value);
  if (mult < 1) {
    document.getElementById('mult').style.border = '1px solid red';
    return;
  }
  const instant = parseFloat(document.getElementById('instant').value);
  if (instant < 0 || instant > 100) {
    document.getElementById('instant').style.border = '1px solid red';
    return;
  }
  const max_rate = parseFloat(document.getElementById('max_rate').value);
  if (max_rate <= 0) {
    document.getElementById('max_rate').style.border = '1px solid red';
    return;
  }
  const mod = parseFloat(document.getElementById('mod').value);
  if (mod <= 0) {
    document.getElementById('mod').style.border = '1px solid red';
    return;
  }
  const leech_rate = parseFloat(document.getElementById('leech_rate').value);
  if (leech_rate < 0) {
    document.getElementById('leech_rate').style.border = '1px solid red';
    return;
  }
  const result = calc(mult, damage, aps, hit_chance/100, max_rate/100, mod, instant/100, leech_rate/100, life);

  document.getElementById('hit').innerText = result.hit;
  document.getElementById('total_lps').innerText = result.total_lps+"/s";
  document.getElementById('ehr').innerText = result.ehr+"/s";
  document.getElementById('lps').innerText = result.lps+"/s";
  document.getElementById('cap').innerText = result.cap;
  document.getElementById('lpi').innerText = result.lpi;
  document.getElementById('dur').innerText = result.dur + " s";
  document.getElementById('count').innerText = result.count;
  document.getElementById('ins').innerText = result.ins;
  document.getElementById('ips').innerText = result.ips+"/s";
  document.getElementById('nlpi').innerText = result.nlpi;
  document.getElementById('nps').innerText = result.nps+"/s";
  document.getElementById('rate').innerText = result.rate+"/s";
}
