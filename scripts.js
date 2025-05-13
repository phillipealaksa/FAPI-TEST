kurzy = {};
kurzy['CZK'] = 1;
getKurzy();
function getKurzy() {
    const dnes = new Date();
    const den = String(dnes.getDate()).padStart(2, '0');
    const mesic = String(dnes.getMonth() + 1).padStart(2, '0');
    const rok = dnes.getFullYear();
    const datum = `${den}.${mesic}.${rok}`;

    const url = `https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date=${datum}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    fetch(proxyUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Chyba při načítání kurzu');
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n');
            for (let i = 2; i < lines.length; i++) {
                const line = lines[i].split('|');
                if (line.length >= 5) {
                    line[4] = line[4].replace(',', '.');
                    kurzy[line[3]] = Number(line[4]);
                }
            };
        })
        .catch(error => console.error('Chyba:', error));
}       

function vypocitatCenu(cena, mnozstvi, mena, dph) {
    return cena * mnozstvi * (1 + dph / 100) / kurzy[mena];
}


function rekapitulace() {
    const jmeno = document.getElementById('jmeno').value;
    const prijmeni = document.getElementById('prijmeni').value;
    const produkt = document.getElementById('produkt').value;
    const cena = document.getElementById('cena').value;
    const mnozstvi = document.getElementById('mnozstvi').value;



    const dim = document.createElement('div');
    dim.style.width = '100%';
    dim.style.height = '100%';
    dim.style.position = 'fixed';
    dim.style.top = '0';
    dim.style.left = '0';
    dim.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dim.style.zIndex = '9999';

    document.body.appendChild(dim);

    const rekapitulaceDiv = document.createElement('div');
    rekapitulaceDiv.id = 'rekapitulace';

    rekapitulaceDiv.innerHTML = `
        <h2>Rekapitulace</h2>
        <p>${jmeno} ${prijmeni}, posíláte objednávku na následující produkt:</p>
        <p><strong>Produkt:</strong> ${produkt}</p>
        <p><strong>Cena:</strong> ${cena} Kč</p>
        <p><strong>Množství:</strong> ${mnozstvi} ks</p>
        <p><strong>Celková cena s DPH:</strong></p>
        <div id="celkovacena-container"><p id="celkovacena">${(cena * mnozstvi * 1.21).toFixed(2)}</p><select id="mena"></select></div>
        <p>Pokud je vše v pořádku, klikněte na "Potvrdit". Pokud chcete něco změnit, klikněte na "Zavřít".</p>
        <div>
             <button id="potvrdit">Potvrdit</button>
             <button id="zavrit">Zavřít</button>
        </div>
    `;
    for (let i = 0; i < Object.keys(kurzy).length; i++) {
        const option = document.createElement('option');
        option.value = Object.keys(kurzy)[i];
        option.textContent = Object.keys(kurzy)[i];
        if (option.value == 'CZK') {
            option.selected = true;
        }
        rekapitulaceDiv.querySelector('#mena').appendChild(option);
    } 
    
    document.addEventListener('change', function () {
        const mena = document.getElementById('mena').value;
        const celkovacena = vypocitatCenu(cena, mnozstvi, mena, 21);
        document.getElementById('celkovacena').innerHTML = celkovacena.toFixed(2);
    }); 

    document.body.appendChild(rekapitulaceDiv);
    document.getElementById('potvrdit').onclick = function () {
        document.body.removeChild(dim);
        document.body.removeChild(rekapitulaceDiv);
        document.getElementById('objednavka-form').submit();    
    };

    document.getElementById('zavrit').onclick = function () {
        document.body.removeChild(dim);
        document.body.removeChild(rekapitulaceDiv);
    };
    return false;
}

