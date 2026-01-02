const catalogo = document.getElementById("catalogo");
const inputBusca = document.getElementById("busca");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let abrirCarrinhoAutomatico = true;

let listaProdutos = [];

document.addEventListener("produtosCarregados", () => {
    listaProdutos = produtos;
    renderizarProdutos(listaProdutos);

    // 🔥 AGORA SIM o carrinho pode ser renderizado
    carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    atualizarCarrinho();
});

// busca em tempo real
inputBusca.addEventListener("input", () => {
    const termo = inputBusca.value.toLowerCase();

    const filtrados = listaProdutos.filter(produto =>
        produto.NOME.toLowerCase().includes(termo) ||
        produto.DESCRICAO.toLowerCase().includes(termo) ||
        produto.CATEGORIA.toLowerCase().includes(termo)
    );

    renderizarProdutos(filtrados);
});

function renderizarProdutos(lista) {
    catalogo.innerHTML = "";

const categorias = {};

    if (!lista || lista.length === 0) {
        catalogo.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

// AGRUPA OS PRODUTOS POR CATEGORIA
lista.forEach(produto => {
    if (!categorias[produto.CATEGORIA]) {
        categorias[produto.CATEGORIA] = [];
    }
    categorias[produto.CATEGORIA].push(produto);
});

    // Renderizar cada categoria
    Object.keys(categorias).forEach(nomeCategoria => {
        const secao = document.createElement("section");
        secao.className = "categoria";

        const titulo = document.createElement("h2");
        titulo.className = "titulo-categoria";
        titulo.textContent = nomeCategoria;

        const linha = document.createElement("div");
        linha.className = "linha-produtos";

        categorias[nomeCategoria].forEach(produto => {
            const card = document.createElement("div");
            card.className = "produto";

card.innerHTML = `
    <img src="${produto.IMAGEM}" alt="${produto.NOME}">
    
    <span class="marca-produto">${produto.MARCA}</span>
    <h3>${produto.NOME}</h3>

    <p class="descricao">${produto.DESCRICAO}</p>

    <div class="preco">
        R$ ${Number(produto.PRECO).toFixed(2)}
    </div>

    <button 
        ${produto.ESTOQUE <= 0 ? "disabled" : ""}
        onclick='adicionarAoCarrinho(${JSON.stringify(produto)})'>
        Adicionar ao carrinho
    </button>
`;

            linha.appendChild(card);
        });

        secao.appendChild(titulo);
        secao.appendChild(linha);
        catalogo.appendChild(secao);
    });
}

function adicionarAoCarrinho(produto) {
    const itemExistente = carrinho.find(
        item => item.produto.NOME === produto.NOME
    );

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            produto: produto,
            quantidade: 1
        });
    }
    atualizarCarrinho();
salvarCarrinho();


    atualizarCarrinho();

    // abre automaticamente APENAS enquanto permitido
    if (abrirCarrinhoAutomatico) {
        abrirCarrinho();
    }
}

function atualizarCarrinho() {
    const container = document.getElementById("itens-carrinho");
    const totalEl = document.getElementById("total");

    document.getElementById("contador-carrinho").textContent =
        carrinho.reduce((soma, item) => soma + item.quantidade, 0);

    container.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        const div = document.createElement("div");

        const subtotal = item.produto.PRECO * item.quantidade;
        total += subtotal;

        div.className = "item-carrinho";

        div.innerHTML = `
    <img src="${item.produto.IMAGEM}" class="img-carrinho">

    <div class="info-carrinho">
        <strong>${item.produto.NOME}</strong>
        <span>
            R$ ${item.produto.PRECO} × ${item.quantidade}
        </span>

        <div class="acoes-item">
            <button onclick="diminuirQuantidade(${index})">−</button>
            <button onclick="aumentarQuantidade(${index})">+</button>
            <button class="remover" onclick="removerDoCarrinho(${index})">✕</button>
        </div>
    </div>
`;

        container.appendChild(div);
    });

    totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function aumentarQuantidade(index) {
    carrinho[index].quantidade++;
    atualizarCarrinho();
}
atualizarCarrinho();
salvarCarrinho();

function diminuirQuantidade(index) {
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
    } else {
        carrinho.splice(index, 1);
    }
    atualizarCarrinho();
}
atualizarCarrinho();
salvarCarrinho();

function enviarWhatsApp() {
    if (carrinho.length === 0) return;

    let mensagem = "*Pedido realizado — Cris Cosméticos*\n\n";

    carrinho.forEach(item => {
        const nome = item.produto.NOME;
        const quantidade = item.quantidade;
        const preco = Number(item.produto.PRECO);

        mensagem += ` *${nome}*\n`;
        mensagem += `• Valor unitário: R$ ${preco.toFixed(2)}\n`;
        mensagem += `• Quantidade: ${quantidade}\n\n`;
    });

    const total = carrinho.reduce(
        (soma, item) => soma + Number(item.produto.PRECO) * item.quantidade,
        0
    );

    mensagem += "━━━━━━━━━━━━━━\n";
    mensagem += `*Total do pedido:* R$ ${total.toFixed(2)}\n\n`;
    mensagem += "Obrigado pela preferência!\n";
    mensagem += "Em breve entraremos em contato para confirmar.";

    const telefone = "5582999447590";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    // Limpa carrinho
    localStorage.removeItem("carrinho");
    carrinho = [];
    atualizarCarrinho();
    fecharCarrinho();
}

function toggleCarrinho() {
    document.getElementById("modal-carrinho")
        .classList.toggle("ativo");
}

function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    document.getElementById("contador-carrinho").innerText = totalItens;
}

function abrirCarrinho() {
    const modal = document.getElementById("modal-carrinho");
    modal.classList.add("ativo");
}

function fecharCarrinho() {
    const modal = document.getElementById("modal-carrinho");
    modal.classList.remove("ativo");
}

function continuarComprando() {
    abrirCarrinhoAutomatico = false;
    fecharCarrinho();
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function carregarCarrinho() {
    const dados = localStorage.getItem("carrinho");

    if (dados) {
        carrinho = JSON.parse(dados);
        atualizarCarrinho();
    }
}
