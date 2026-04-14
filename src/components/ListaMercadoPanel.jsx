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
  return (
    <div className="cupom">
      <h1>Lista Mercado</h1>

      <div className="linha"></div>

      <div className="formulario">
        <input
          placeholder="Quanto você tem pro mercado?"
          value={orcamento}
          onChange={(e) => setOrcamento(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setListaAberta(true);
            }
          }}
        />
      </div>

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
                        R$ {item.precoUnitario.toFixed(2)}
                      </span>

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

          <div className={`total ${estourouOrcamento ? "total-negativo" : ""}`}>
            <span>RESTANTE</span>
            <span>R$ {saldoRestante.toFixed(2)}</span>
          </div>

          {estourouOrcamento && (
            <p className="alerta-orcamento">
              ⚠️ Você estourou o orçamento.
            </p>
          )}

          <div className="linha"></div>

          <button className="botao-toggle" onClick={finalizarCompra}>
            Finalizar Compra
          </button>
        </>
      )}
    </div>
  );
}

export default ListaMercadoPanel;