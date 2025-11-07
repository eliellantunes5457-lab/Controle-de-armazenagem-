
/* External JS for Checklist Log20 */
const ITEMS = ["Pontos de apoio estão OK?", "Painel de instrumentos está OK?", "Sensor de banco está OK?", "Cinto de segurança está OK?", "Buzina está OK?", "Sensor de cinto está OK?", "Limpador de para-brisas está OK?", "Para-brisa e teto estão OK?", "Retrovisores estão OK?", "Freios estão OK?", "Extintor está OK?", "LEDs laterais estão OK?", "Blue Spot está OK?", "Lâmpadas dianteiras estão OK?", "Lâmpadas traseiras estão OK?", "Sirene de ré está OK?", "Ausência de vazamento de óleo?", "Mangueiras da torre estão OK?", "Garfo está OK?", "Pneus estão OK?", "Rodas estão OK?"];
const EMOJIS = ["⚙️", "📟", "💺", "🎗️", "📣", "🔔", "🧹", "🪟", "🔭", "🛑", "🔥", "💡", "🔵", "🔦", "🔙", "📢", "🛢️", "🧰", "🛠️", "🛞", "⚙️"];
let index = 0;
let respostas = {}, descricoes = {}, startedAt = null;
let timer = null, timeLeft = 180;

function $(id) { return document.getElementById(id); }

function startChecklist() {
  const op = $('operador').value.trim();
  const ma = $('maquina').value.trim();
  const ho = $('horimetro').value.trim();
  if(!op || !ma || !ho) { alert('Preencha Operador, Máquina e Horímetro.'); return; }
  $('page-start').classList.add('hidden');
  $('page-check').classList.remove('hidden');
  index = 0;
  respostas = {}; descricoes = {};
  mostrarItem();
  iniciarTemporizador();
  startedAt = new Date().toISOString();
}

function mostrarItem() {
  $('itemText').innerText = ITEMS[index];
  $('itemEmoji').innerText = EMOJIS[index] || '⚙️';
  $('counter').innerText = 'Item ' + (index+1) + ' de ' + ITEMS.length;
  $('descBox').classList.add('hidden');
  $('desc').value = descricoes[ITEMS[index]] || '';
}

function responder(valor) {
  respostas[ITEMS[index]] = valor;
  if(valor === 'Não') {
    $('descBox').classList.remove('hidden');
    $('desc').focus();
  } else {
    setTimeout(proximoItem, 200);
  }
}

function proximoItem() {
  if(respostas[ITEMS[index]] === 'Não') {
    const d = $('desc').value.trim();
    if(!d) { alert('Descreva o problema antes de prosseguir.'); $('desc').focus(); return; }
    descricoes[ITEMS[index]] = d;
  }
  if(index + 1 < ITEMS.length) {
    index++;
    mostrarItem();
  } else {
    $('page-check').classList.add('hidden');
    $('page-observacoes').classList.remove('hidden');
    $('observacoes').focus();
  }
}

function iniciarTemporizador() {
  const btn = $('btnGenerate');
  timeLeft = 180;
  btn.disabled = true;
  btn.innerText = '⏳ Aguarde 3:00';
  if(timer) clearInterval(timer);
  timer = setInterval(function() {
    timeLeft--;
    var m = Math.floor(timeLeft/60);
    var s = String(timeLeft%60).padStart(2,'0');
    btn.innerText = '⏳ Aguarde ' + m + ':' + s;
    if(timeLeft <= 0) {
      clearInterval(timer);
      btn.disabled = false;
      btn.innerText = '✅ Gerar Relatório (PDF)';
    }
  }, 1000);
}

function gerarPDF() {
  if(timeLeft > 0) { alert('Aguarde o tempo mínimo de 3 minutos para gerar o relatório.'); return; }
  var operador = $('operador').value.trim();
  var maquina = $('maquina').value.trim();
  var horimetro = $('horimetro').value.trim();
  var observ = $('observacoes').value.trim();
  if(!window.jspdf) {
    alert('Biblioteca jsPDF não encontrada. Conecte-se à internet uma vez para baixar jsPDF ou peça a versão com jsPDF embutida.');
    return;
  }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({unit:'pt', format:'a4'});
  doc.setFontSize(14);
  doc.text('CHECKLIST LOG20 – OPERAÇÃO VIDROS', doc.internal.pageSize.getWidth()/2, 40, {align:'center'});
  doc.setFontSize(10);
  var now = new Date();
  doc.text('Data: ' + now.toLocaleDateString() + ' ' + now.toLocaleTimeString(), 40, 60);
  doc.text('Operador: ' + operador + ' | Máquina: ' + maquina + ' | Horímetro: ' + horimetro, 40, 75);
  var body = ITEMS.map(function(i){ return [i, respostas[i] || 'Não respondido', descricoes[i] || '']; });
  if(doc.autoTable) {
    doc.autoTable({startY:95, head:[['Item','Situação','Descrição']], body: body, styles:{fontSize:9,cellPadding:3}, headStyles:{fillColor:[245,130,32]}});
    var yAfter = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 95 + body.length*12;
    doc.setFontSize(11);
    doc.text('Observações:', 40, yAfter);
    var lines = doc.splitTextToSize(observ || 'Nenhuma observação.', 500);
    doc.text(lines, 40, yAfter + 15);
  } else {
    var y = 95; doc.setFontSize(9);
    body.forEach(function(r){ doc.text(r.join(' - '), 40, y); y += 14; if(y > 700){ doc.addPage(); y = 40; } });
    doc.text('Observações:', 40, y+20); doc.text(observ || 'Nenhuma observação.', 40, y+36);
  }
  var filename = 'Checklist_LOG20_' + (operador || 'Operador') + '.pdf';
  doc.save(filename);
  $('page-observacoes').classList.add('hidden');
  $('page-done').classList.remove('hidden');
}

function baixarJSON() {
  var data = { operador: $('operador').value.trim(), maquina: $('maquina').value.trim(), horimetro: $('horimetro').value.trim(), startedAt: startedAt, respostas: respostas, descricoes: descricoes, observacoes: $('observacoes').value.trim() };
  var blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = 'checklist_log20_' + (data.operador || 'operador') + '.json'; document.body.appendChild(a); a.click(); a.remove();
}

// Attach handlers safely after DOM ready
document.addEventListener('DOMContentLoaded', function() {
  var btnSim = $('btnSim'), btnNao = $('btnNao'), nextBtn = $('nextBtn'), startBtnInline = $('startBtn');
  if(btnSim) btnSim.addEventListener('click', function(){ responder('Sim'); });
  if(btnNao) btnNao.addEventListener('click', function(){ responder('Não'); });
  if(nextBtn) nextBtn.addEventListener('click', proximoItem);
  if(startBtnInline) startBtnInline.addEventListener('click', startChecklist);
});
