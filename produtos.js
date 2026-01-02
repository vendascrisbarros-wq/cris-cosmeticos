const URL_API = "https://script.google.com/macros/s/AKfycbyzesRozISCaVEKobggl8FhbsY06kOBfPrGU1xUyjAfetx13IMrMWngW3QBMd3dydeI/exec";

let produtos = [];

async function carregarProdutos() {
    try {
        const resposta = await fetch(URL_API);
        const dados = await resposta.json();

        console.log("Produtos recebidos:", dados);

        // garante que sempre será um array
        if (Array.isArray(dados)) {
            produtos = dados;
        } else {
            produtos = Object.values(dados);
        }

        document.dispatchEvent(new Event("produtosCarregados"));
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

carregarProdutos();
