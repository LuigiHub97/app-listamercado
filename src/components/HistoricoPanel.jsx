function HistoricoPanel({
  historicoAberto,
  setHistoricoAberto,
  historico,
  categorias,
  formatarData,
  limparHistorico,
}) {
  return (
    <>
      <button
        className="botao-historico-flutuante"
        onClick={() => setHistoricoAberto(!historicoAberto)}
      >
        {historicoAberto ? "Fechar histórico" : "📜 Histórico"}
      </button>

      {historicoAberto && (
        <div className="painel-historico">
          <div className="topo-historico">
            <h2>Histórico</h2>

            <button
              className="botao-fechar-historico"
              onClick={() => setHistoricoAberto(false)}
            >
              X
            </button>
          </div>

          <div className="linha"></div>

          {historico.length > 0 && (
            <>
              <button className="botao-toggle" onClick={limparHistorico}>
                Limpar Histórico
              </button>
              <div className="linha"></div>
            </>
          )}

          <div className="lista">
            {historico.length === 0 && (
              <p className="vazio">Nenhuma compra salva ainda</p>
            )}

            {historico.map((compra) => (
              <div key={compra.id} className="bloco-historico">
                <h2 className="titulo-categoria">
                  Compra de {formatarData(compra.data)}
                </h2>

                <div className="item item-historico-info">
                  <span className="nome-item">Orçamento</span>
                  <span className="preco-item">
                    R$ {Number(compra.orcamento).toFixed(2)}
                  </span>
                </div>

                <div className="item item-historico-info">
                  <span className="nome-item">Total</span>
                  <span className="preco-item">
                    R$ {Number(compra.total).toFixed(2)}
                  </span>
                </div>

                <div className="item item-historico-info">
                  <span className="nome-item">Restante</span>
                  <span className="preco-item">
                    R$ {Number(compra.saldoRestante).toFixed(2)}
                  </span>
                </div>

                <div className="linha"></div>

                {categorias.map((nomeCategoria) => {
                  const itensDaCategoria = compra.itens.filter(
                    (item) => item.categoria === nomeCategoria
                  );

                  if (itensDaCategoria.length === 0) {
                    return null;
                  }

                  return (
                    <div key={`${compra.id}-${nomeCategoria}`}>
                      <h2 className="titulo-categoria">{nomeCategoria}</h2>

                      {itensDaCategoria.map((item, index) => {
                        const subtotal =
                          item.precoUnitario * item.quantidade;

                        return (
                          <div
                            className="item item-historico-produto"
                            key={`${compra.id}-${nomeCategoria}-${item.nome}-${index}`}
                          >
                            <span className="nome-item">{item.nome}</span>

                            <span className="preco-item">
                              {item.quantidade}x
                            </span>

                            <span className="preco-item">
                              R$ {item.precoUnitario.toFixed(2)}
                            </span>

                            <span className="preco-item">
                              R$ {subtotal.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default HistoricoPanel;