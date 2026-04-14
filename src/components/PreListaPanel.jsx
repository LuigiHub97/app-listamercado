function PreListaPanel({
  preListaAberta,
  setPreListaAberta,
  itemPreLista,
  setItemPreLista,
  categoriaPreLista,
  setCategoriaPreLista,
  categorias,
  preLista,
  preListaAgrupada,
  adicionarPreLista,
  removerPreLista,
}) {
  return (
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

            <select
              value={categoriaPreLista}
              onChange={(e) => setCategoriaPreLista(e.target.value)}
            >
              {categorias.map((categoriaOpcao) => (
                <option key={categoriaOpcao} value={categoriaOpcao}>
                  {categoriaOpcao}
                </option>
              ))}
            </select>

            <button onClick={adicionarPreLista}>Adicionar</button>
          </div>

          <div className="linha"></div>

          <div className="lista">
            {preLista.length === 0 && (
              <p className="vazio">Nenhum item na pré-lista</p>
            )}

            {preListaAgrupada.map((grupo) => (
              <div key={grupo.categoria}>
                <h2 className="titulo-categoria">{grupo.categoria}</h2>

                {grupo.itens.map((item, indexInterno) => {
                  const indexReal = preLista.findIndex(
                    (itemLista) =>
                      itemLista.nome === item.nome &&
                      itemLista.categoria === item.categoria
                  );

                  return (
                    <div
                      className="item item-prelista"
                      key={`${grupo.categoria}-${item.nome}-${indexInterno}`}
                    >
                      <span className="nome-item">
                        {item.concluido ? "✅ " : "⬜ "} {item.nome}
                      </span>

                      <button
                        className="botao-remover"
                        onClick={() => removerPreLista(indexReal)}
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PreListaPanel;