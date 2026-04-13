import { useState } from "react";
import "./App.css";

function App() {
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");
  const [itens, setItens] = useState([]);

  const [preListaAberta, setPreListaAberta] = useState(false);
  const [listaAberta, setListaAberta] = useState(false);

  const [itemPreLista, setItemPreLista] = useState("");
  const [preLista, setPreLista] = useState([]);

  function adicionarItem() {
    if (produto === "" || valor === "") {
      return;
    }

    const novoItem = {
      nome: produto,
      preco: valor,
    };

    const novosItens = [...itens, novoItem];
    setItens(novosItens);

    const novaPreLista = preLista.map((item) => {
      if (item.nome.toLowerCase() === produto.toLowerCase()) {
        return { ...item, concluido: true };
      }
      return item;
    });

    setPreLista(novaPreLista);

    setProduto("");
    setValor("");
  }

  function removerItem(indexParaRemover) {
    const novaLista = itens.filter(
      (item, index) => index !== indexParaRemover
    );
    setItens(novaLista);
  }

  function adicionarPreLista() {
    if (itemPreLista === "") {
      return;
    }

    const novoItemPreLista = {
      nome: itemPreLista,
      concluido: false,
    };

    setPreLista([...preLista, novoItemPreLista]);
    setItemPreLista("");
  }

  function removerPreLista(indexParaRemover) {
    const novaPreLista = preLista.filter(
      (item, index) => index !== indexParaRemover
    );
    setPreLista(novaPreLista);
  }

  const total = itens.reduce((acc, item) => {
    return acc + Number(item.preco);
  }, 0);

  return (
    <div className="app">
      <div className="container-duplo">
        <div className="cupom">
          <h1>Pré-lista</h1>

          <div className="linha"></div>

          <button
            className="botao-toggle"
            onClick={() => setPreListaAberta(!preListaAberta)}
          >
            {preListaAberta ? "Fechar Pré-lista" : "Abrir Pré-lista"}
          </button>

          {preListaAberta && (
            <>
              <div className="linha"></div>

              <div className="formulario">
                <input
                  placeholder="Item da pré-lista"
                  value={itemPreLista}
                  onChange={(e) => setItemPreLista(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      adicionarPreLista();
                    }
                  }}
                />

                <button onClick={adicionarPreLista}>Adicionar</button>
              </div>

              <div className="linha"></div>

              <div className="lista">
                {preLista.length === 0 && (
                  <p className="vazio">Nenhum item na pré-lista</p>
                )}

                {preLista.map((item, index) => (
                  <div className="item item-prelista" key={index}>
                    <span className="nome-item">
                      {item.concluido ? "✅ " : "⬜ "} {item.nome}
                    </span>
                    <button
                      className="botao-remover"
                      onClick={() => removerPreLista(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="cupom">
          <h1>Lista Mercado</h1>

          <div className="linha"></div>

          <button
            className="botao-toggle"
            onClick={() => setListaAberta(!listaAberta)}
          >
            {listaAberta ? "Fechar Lista de Compra" : "Abrir Lista de Compra"}
          </button>

          {listaAberta && (
            <>
              <div className="linha"></div>

              <div className="formulario">
                <input
                  placeholder="Nome do produto"
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      adicionarItem();
                    }
                  }}
                />

                <input
                  placeholder="Valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      adicionarItem();
                    }
                  }}
                />

                <button onClick={adicionarItem}>Adicionar</button>
              </div>

              <div className="linha"></div>

              <div className="lista">
                {itens.length === 0 && (
                  <p className="vazio">Nenhum item adicionado</p>
                )}

                {itens.map((item, index) => (
                  <div className="item" key={index}>
                    <span className="nome-item">{item.nome}</span>
                    <span className="preco-item">
                      R$ {Number(item.preco).toFixed(2)}
                    </span>
                    <button
                      className="botao-remover"
                      onClick={() => removerItem(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <div className="linha"></div>

              <div className="total">
                <span>TOTAL</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;