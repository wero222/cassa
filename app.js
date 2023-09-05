let modalitaModifica = false;
let indiceTransazioneCheStoModificando;

window.onload = () => {
    generaHTMLTransazioni(transazioni);
}

function generaHTMLTransazioni(transazioni) {
    // <tr>
    //     <td>1</td>
    //     <td>2022-01-20</td>
    //     <td>ENTRATA</td>
    //     <td>Stipendio</td>
    //     <td>€ 5000</td>
    //     <td></td>
    //     <td></td>
    //     <td></td>
    // </tr>
    const transazioniTBody = document.getElementById("transazioniTBody");
    transazioniTBody.innerHTML = "";

    let progressivo = 1;
    let indice = 0;

    for (const t of transazioni) {
        let cssClassTipoTransazione = t.tipo == "ENTRATA" ? "text-success" : "text-danger";

        let strTransazione = `
            <tr>
                <td>${progressivo}</td>
                <td>${t.data}</td>
                <td>${t.tipo}</td>
                <td>${t.descrizione}</td>
                <td class="${cssClassTipoTransazione}">€ ${t.importo}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="modifica(${indice})">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                </td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="elimina(${indice})">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
                <td></td>
            </tr>
        `;

        transazioniTBody.innerHTML += strTransazione;

        progressivo++;
        indice++;
    }

    let spanTotale = document.getElementById("totaleTransazioni");
    spanTotale.innerHTML = calcolaTotale(transazioni);
}

function calcolaTotale(movimenti) {
    let totale = 0;

    for (const m of movimenti) {
        if (m.tipo == "ENTRATA") {
            totale += m.importo;
        } else {
            totale -= m.importo;
        }
    }

    return totale;
}

function elimina(index) {
    if (confirm("Sei sicuro di volere eliminare la transazione?")) {
        // rimuove dall'array transazioni 
        // 1 elemento a partire da index
        transazioni.splice(index, 1);

        inviaMessaggio("Transazione eliminata con successo", true);

        generaHTMLTransazioni(transazioni);
    }
}

function modifica(index) {
    modalitaModifica = true;
    indiceTransazioneCheStoModificando = index;

    const inputData = document.getElementById("data");
    const inputTipo = document.getElementById("tipo");
    const inputDescrizione = document.getElementById("descrizione");
    const inputImporto = document.getElementById("importo");
    const btnSalva = document.getElementById("btnSalva");

    const transazione = transazioni[index];

    inputData.value = transazione.data;
    inputTipo.value = transazione.tipo;
    inputDescrizione.value = transazione.descrizione;
    inputImporto.value = transazione.importo;

    btnSalva.innerHTML = "Salva";
}

function aggiungiTransazione() {
    // prendo il riferimento ad ogni input
    const inputData = document.getElementById("data");
    const inputTipo = document.getElementById("tipo");
    const inputDescrizione = document.getElementById("descrizione");
    const inputImporto = document.getElementById("importo");

    // controllo input
    if (inputData.value == "") {
        inviaMessaggio("Valore data mancante", false);
        return;
    }

    if (inputDescrizione.value == "") {
        inviaMessaggio("Valore descrione mancante", false);
        return;
    }

    if (inputImporto.value == "") {
        inviaMessaggio("Valore importo mancante", false);
        return;
    }

    if (modalitaModifica == false) {
        // siamo in modalità inserimento

        let nuovaTransazione = {
            data: inputData.value,
            tipo: inputTipo.value,
            descrizione: inputDescrizione.value,
            importo: parseFloat(inputImporto.value)
        }

        transazioni.push(nuovaTransazione);
    } else {
        // siamo in modalità modifica
        transazioni[indiceTransazioneCheStoModificando].data = inputData.value;
        transazioni[indiceTransazioneCheStoModificando].tipo = inputTipo.value;
        transazioni[indiceTransazioneCheStoModificando].descrizione = inputDescrizione.value;
        transazioni[indiceTransazioneCheStoModificando].importo = parseFloat(inputImporto.value);
    }

    inviaMessaggio(`Transazione ${modalitaModifica ? "salvata" : "aggiunta"} con successo`, true);

    // pulisco la form
    inputData.value = "";
    inputTipo.value = "ENTRATA";
    inputDescrizione.value = "";
    inputImporto.value = 0;
    modalitaModifica = false;
    indiceTransazioneCheStoModificando = undefined;
    document.getElementById("btnSalva").innerHTML = "Aggiungi";

    // rigenero la tabella
    generaHTMLTransazioni(transazioni);
}

function inviaMessaggio(testo, ok) {
    const divMessaggio = document.getElementById("messaggio");

    divMessaggio.innerHTML = testo;

    divMessaggio.className = ok ? "text-success" : "text-danger";
}