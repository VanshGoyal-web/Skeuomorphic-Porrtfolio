
/* THE PERSONAL DESK — VANSH GOYAL
 * To add your real links, fill in the three values below. Everything else works without setup.
 * Example: email: "you@example.com", github: "https://github.com/yourname"
 */
const CONTACT = {
  email: "",
  github: "",
  linkedin: ""
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const toast = $('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3100);
}

// DAY / EVENING DESK LAMP
const themeToggle = $('#themeToggle');
function setTheme(theme) {
  const evening = theme === 'evening';
  document.body.dataset.theme = evening ? 'evening' : 'day';
  $('#themeText').textContent = evening ? 'Evening mode' : 'Day mode';
  $('.switch-knob').textContent = evening ? '☾' : '☀';
  themeToggle.setAttribute('aria-pressed', String(evening));
  themeToggle.setAttribute('aria-label', evening ? 'Switch to day mode' : 'Switch to evening mode');
  try { localStorage.setItem('desk-theme', evening ? 'evening' : 'day'); } catch (_) {}
}
let rememberedTheme = 'day';
try { rememberedTheme = localStorage.getItem('desk-theme') || 'day'; } catch (_) {}
setTheme(rememberedTheme);
themeToggle.addEventListener('click', () => setTheme(document.body.dataset.theme === 'day' ? 'evening' : 'day'));

const now = new Date();
$('#deskDate').textContent = new Intl.DateTimeFormat('en-IN', {day:'2-digit', month:'short', year:'numeric'}).format(now).toUpperCase();
$('#year').textContent = now.getFullYear();

// PYTHON PATTERN PLAYGROUND
const patternSelect = $('#patternSelect');
const rowCount = $('#rowCount');
const rowValue = $('#rowValue');
const patternOutput = $('#patternOutput');
const patternCode = $('#patternCode');
let currentPythonCode = '';

const pythonSnippets = {
  diamond: (n) => `n = ${n}\n\nfor i in range(1, n + 1):\n    print(" " * (n - i) + "* " * i)\nfor i in range(n - 1, 0, -1):\n    print(" " * (n - i) + "* " * i)`,
  hollow: (n) => `n = ${n}\n\nfor i in list(range(1, n + 1)) + list(range(n - 1, 0, -1)):\n    if i == 1:\n        print(" " * (n - i) + "*")\n    else:\n        print(" " * (n - i) + "*" + " " * (2 * i - 3) + "*")`,
  pyramid: (n) => `n = ${n}\n\nfor i in range(1, n + 1):\n    print(" " * (n - i) + "* " * i)`,
  stairs: (n) => `n = ${n}\n\nfor i in range(1, n + 1):\n    print("* " * i)`
};

function makePattern(kind, n) {
  const lines = [];
  const levels = kind === 'diamond' || kind === 'hollow'
    ? [...Array.from({length:n}, (_,i) => i + 1), ...Array.from({length:n-1}, (_,i) => n - i - 1)]
    : Array.from({length:n}, (_,i) => i + 1);
  for (const i of levels) {
    if (kind === 'stairs') lines.push('* '.repeat(i).trimEnd());
    else if (kind === 'hollow') lines.push(' '.repeat(n-i) + (i===1 ? '*' : '*' + ' '.repeat(2*i-3) + '*'));
    else lines.push(' '.repeat(n-i) + '* '.repeat(i).trimEnd());
  }
  return lines.join('\n');
}

function updatePattern() {
  const n = Number(rowCount.value);
  const type = patternSelect.value;
  rowValue.textContent = n;
  patternOutput.textContent = makePattern(type, n);
  currentPythonCode = pythonSnippets[type](n);
  patternCode.textContent = currentPythonCode;
}
patternSelect.addEventListener('change', updatePattern);
rowCount.addEventListener('input', updatePattern);
updatePattern();

$$('[data-pattern-view]').forEach(button => button.addEventListener('click', () => {
  const codeView = button.dataset.patternView === 'code';
  patternCode.classList.toggle('hidden', !codeView);
  patternOutput.classList.toggle('hidden', codeView);
  $$('[data-pattern-view]').forEach(tab => tab.classList.toggle('active', tab === button));
}));

$('#copyPattern').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(currentPythonCode);
    showToast('Python code copied to clipboard. ✳');
  } catch (_) {
    // Browsers can block the Clipboard API for local file:// pages.
    patternCode.classList.remove('hidden');
    patternOutput.classList.add('hidden');
    $$('[data-pattern-view]').forEach(tab => tab.classList.toggle('active', tab.dataset.patternView === 'code'));
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(patternCode);
    selection.removeAllRanges();
    selection.addRange(range);
    showToast('Code selected — press Ctrl/Cmd + C to copy.');
  }
});

// NUMBER DETECTIVE: GCD, LCM, FACTORS AND EUCLID'S STEPS
function gcd(a, b) {
  while (b !== 0) [a,b] = [b,a%b];
  return a;
}
function factorsOf(n) {
  const factors=[];
  let value=n;
  for (let p=2;p*p<=value;p+=(p===2?1:2)) {
    while (value%p===0) { factors.push(p); value /= p; }
  }
  if (value>1) factors.push(value);
  return factors.length ? factors.join(' × ') : '1';
}
function calculateNumbers() {
  const a=Number($('#numberA').value), b=Number($('#numberB').value);
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a<1 || b<1 || a>999999 || b>999999) {
    $('#gcdResult').textContent = '—';
    $('#lcmResult').textContent = '—';
    $('#factorResults').textContent = 'Enter whole numbers from 1 to 999999.';
    $('#euclidSteps').textContent = 'Waiting for valid inputs…';
    return;
  }
  const common=gcd(a,b), multiple=(a/common)*b;
  $('#gcdResult').textContent = common.toLocaleString('en-IN');
  $('#lcmResult').textContent = multiple.toLocaleString('en-IN');
  $('#factorResults').textContent = '';
  for (const [label, number] of [['A',a],['B',b]]) {
    const div=document.createElement('div');
    const title=document.createElement('b');
    title.textContent = `${label} (${number}) = `;
    div.append(title, document.createTextNode(factorsOf(number)));
    $('#factorResults').appendChild(div);
  }
  let x=Math.max(a,b), y=Math.min(a,b), steps=[];
  while (y!==0) {
    const quotient=Math.floor(x/y), remainder=x%y;
    steps.push(`${x} = ${y} × ${quotient} + ${remainder}`);
    [x,y] = [y,remainder];
  }
  steps.push(`Therefore, GCD = ${x}`);
  $('#euclidSteps').textContent = '';
  for (const step of steps) {
    const row=document.createElement('div');
    row.textContent=step;
    $('#euclidSteps').appendChild(row);
  }
}
$('#numberA').addEventListener('input', calculateNumbers);
$('#numberB').addEventListener('input', calculateNumbers);
calculateNumbers();

// SCRATCHPAD — SAVED ONLY IN THIS BROWSER
const scratchpad=$('#scratchpad');
try { scratchpad.value=localStorage.getItem('desk-scratchpad') || ''; } catch (_) {}
scratchpad.addEventListener('input', () => {
  try {localStorage.setItem('desk-scratchpad', scratchpad.value);$('#saveStatus').textContent='SAVED ON THIS DEVICE';}
  catch (_) {$('#saveStatus').textContent='STORAGE UNAVAILABLE';}
});
$('#clearNote').addEventListener('click', () => {
  scratchpad.value='';
  try {localStorage.removeItem('desk-scratchpad');} catch (_) {}
  $('#saveStatus').textContent='NOTE CLEARED';
  showToast('A fresh page, all yours.');
});

// CONTACT LINKS — configured at the top of this file.
$('#emailButton').addEventListener('click', () => {
  if (!CONTACT.email) return showToast('Set CONTACT.email at the top of script.js first.');
  window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Hello from your portfolio!')}`;
});
$$('[data-contact]').forEach(button => button.addEventListener('click', () => {
  const type=button.dataset.contact;
  if (!CONTACT[type]) return showToast(`Set CONTACT.${type} at the top of script.js first.`);
  const url=CONTACT[type];
  if (!/^https:\/\//i.test(url)) return showToast(`Your ${type} URL should begin with https://`);
  window.open(url, '_blank', 'noopener,noreferrer');
}));
