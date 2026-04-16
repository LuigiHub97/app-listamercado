import { useRef, useState } from "react";

function ListaMercadoPanel({
  listaAberta,
  setListaAberta,
  orcamento,
  setOrcamento,
  produto,
  setProduto,
  valor,
  setValor,
  categoria,
  setCategoria,
  categorias,
  itens,
  itensAgrupados,
  adicionarItem,
  aumentarQuantidade,
  diminuirQuantidade,
  removerItem,
  total,
  saldoRestante,
  estourouOrcamento,
  finalizarCompra,
}) {
  const [gravando, setGravando] = useState(false);
  const recognitionRef = useRef(null);

  const extrairItemEPreco = (texto) => {
    const textoLimpo = texto
      .toLowerCase()
      .trim()
      .replace(",", ".")
      .replace(/r\$/g, " ")
      .replace(/\s+/g, " ");

    const match = textoLimpo.match(/(.+?)\s+(\d+(?:\.\d+)?)\s*(real|reais)?$/i);

    if (!match) {
      return null;
    }

    const nome = match[1]
      .replace(/\b(real|reais)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const preco = match[2].trim();

    if (!nome || !preco) {
      return null;
    }

    return { nome, preco };
  };

  const adicionarItemPorVoz = (nome, preco) => {
    setProduto(nome);
    setValor(preco);
    adicionarItem(nome, preco);
  };

  const iniciarReconhecimento = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    if (gravando && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setGravando(true);
    };

    recognition.onend = () => {
      setGravando(false);
    };

    recognition.onerror = (event) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setGravando(false);
      alert("Não consegui entender sua voz. Tente de novo.");
    };

    recognition.onresult = (event) => {
      const textoReconhecido = event.results[0][0].transcript;
      const resultado = extrairItemEPreco(textoReconhecido);

      if (!resultado) {
        alert('Fale no formato: "arroz 10 reais"');
        return;
      }

      adicionarItemPorVoz(resultado.nome, resultado.preco);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
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
              placeholder="Seu orçamento"
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
            />
          </div>

          <div className="resumo-orcamento">
            <div className="saldo-linha">
              <span>Gasto</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>

            <div className="saldo-linha saldo-restante">
              <span>{estourouOrcamento ? "Ultrapassou" : "Restante"}</span>
              <strong>R$ {saldoRestante.toFixed(2)}</strong>
            </div>
          </div>

          {estourouOrcamento && (
            <p className="alerta-orcamento">
              Passou R$ {Math.abs(saldoRestante).toFixed(2)} do orçamento.
            </p>
          )}

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
              placeholder="Valor unitário"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  adicionarItem();
                }
              }}
            />

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {categorias.map((categoriaOpcao) => (
                <option key={categoriaOpcao} value={categoriaOpcao}>
                  {categoriaOpcao}
                </option>
              ))}
            </select>

            <button onClick={adicionarItem}>Adicionar</button>

            <button
              type="button"
              className={`botao-voz ${gravando ? "gravando" : ""}`}
              onClick={iniciarReconhecimento}
              title={gravando ? "Ouvindo..." : "Adicionar por voz"}
              aria-label={gravando ? "Ouvindo..." : "Adicionar por voz"}
            >
              🎤
            </button>
          </div>

          <div className="linha"></div>

          <div className="lista">
            {itens.length === 0 && (
              <p className="vazio">Nenhum item adicionado</p>
            )}

            {itensAgrupados.map((grupo) => (
              <div key={grupo.categoria}>
                <h2 className="titulo-categoria">{grupo.categoria}</h2>

                {grupo.itens.map((item, indexInterno) => {
                  const subtotal = item.precoUnitario * item.quantidade;

                  const indexReal = itens.findIndex(
                    (itemLista) =>
                      itemLista.nome === item.nome &&
                      itemLista.precoUnitario === item.precoUnitario &&
                      itemLista.categoria === item.categoria
                  );

                  return (
                    <div
                      className="item"
                      key={`${grupo.categoria}-${item.nome}-${indexInterno}-${item.precoUnitario}`}
                    >
                      <span className="nome-item">{item.nome}</span>

                      <span className="preco-item">{item.quantidade}x</span>

                      <span className="preco-item">
                        R$ {subtotal.toFixed(2)}
                      </span>

                      <button
                        className="botao-remover"
                        onClick={() => diminuirQuantidade(indexReal)}
                      >
                        -
                      </button>

                      <button
                        className="botao-remover"
                        onClick={() => aumentarQuantidade(indexReal)}
                      >
                        +
                      </button>

                      <button
                        className="botao-remover"
                        onClick={() => removerItem(indexReal)}
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="linha"></div>

          <div className="total">
            <span>TOTAL</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          <button className="botao-toggle" onClick={finalizarCompra}>
            Finalizar Compra
          </button>
        </>
      )}
    </div>
  );
}

export default ListaMercadoPanel;
