import { useEffect, useState } from "react";
import "./styles/global.css";
import "./styles/app-layout.css";
import "./styles/formulario.css";
import "./styles/lista.css";
import "./styles/historico.css";
import "./styles/responsive.css";
import PreListaPanel from "./components/PreListaPanel";
import ListaMercadoPanel from "./components/ListaMercadoPanel";
import HistoricoPanel from "./components/HistoricoPanel";

function criarIdCompra() {
  return Date.now();
}

function lerJsonSalvo(chave, fallback) {
  const valorSalvo = localStorage.getItem(chave);

  if (!valorSalvo) {
    return fallback;
  }

  try {
    return JSON.parse(valorSalvo);
  } catch {
    return fallback;
  }
}

function App() {
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");
  const [orcamento, setOrcamento] = useState(
    () => localStorage.getItem("orcamentoAtual") ?? ""
  );
  const [categoria, setCategoria] = useState("Limpeza");
  const [itens, setItens] = useState(() =>
    lerJsonSalvo("itensCompraAtual", [])
  );

  const [preListaAberta, setPreListaAberta] = useState(false);
  const [listaAberta, setListaAberta] = useState(false);
  const [historicoAberto, setHistoricoAberto] = useState(false);

  const [itemPreLista, setItemPreLista] = useState("");
  const [categoriaPreLista, setCategoriaPreLista] = useState("Limpeza");
  const [preLista, setPreLista] = useState(() =>
    lerJsonSalvo("preListaCompras", [])
  );

  const [historico, setHistorico] = useState(() =>
    lerJsonSalvo("historicoCompras", [])
  );

  const categorias = [
    "Limpeza",
    "Cozinha",
    "Besteiras",
    "Higiene",
    "Carnes",
    "Bebidas",
    "Diversos",
  ];

  useEffect(() => {
    localStorage.setItem("historicoCompras", JSON.stringify(historico));
  }, [historico]);

  useEffect(() => {
    localStorage.setItem("preListaCompras", JSON.stringify(preLista));
  }, [preLista]);

  useEffect(() => {
    localStorage.setItem("itensCompraAtual", JSON.stringify(itens));
  }, [itens]);

  useEffect(() => {
    localStorage.setItem("orcamentoAtual", orcamento);
  }, [orcamento]);

  function normalizarTexto(texto) {
    return texto.trim().toLowerCase();
  }

  function converterParaNumero(texto) {
    return Number(String(texto).replace(",", "."));
  }

  function formatarData(dataIso) {
    const data = new Date(dataIso);

    return data.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function agruparPorCategoria(lista) {
    return categorias
      .map((nomeCategoria) => ({
        categoria: nomeCategoria,
        itens: lista.filter((item) => item.categoria === nomeCategoria),
      }))
      .filter((grupo) => grupo.itens.length > 0);
  }

  function adicionarItem(nomeRecebido = produto, valorRecebido = valor) {
    const nomeLimpo = nomeRecebido.trim();
    const precoNumero = converterParaNumero(valorRecebido);

    if (nomeLimpo === "" || String(valorRecebido).trim() === "") {
      return;
    }

    if (Number.isNaN(precoNumero) || precoNumero <= 0) {
      return;
    }

    if (!categorias.includes(categoria)) {
      return;
    }

    const indexExistente = itens.findIndex((item) => {
      return (
        normalizarTexto(item.nome) === normalizarTexto(nomeLimpo) &&
        item.precoUnitario === precoNumero &&
        item.categoria === categoria
      );
    });

    let novaLista = [];

    if (indexExistente !== -1) {
      novaLista = itens.map((item, index) => {
        if (index === indexExistente) {
          return {
            ...item,
            quantidade: item.quantidade + 1,
          };
        }
        return item;
      });
    } else {
      novaLista = [
        ...itens,
        {
          nome: nomeLimpo,
          precoUnitario: precoNumero,
          quantidade: 1,
          categoria,
        },
      ];
    }

    setItens(novaLista);

    const novaPreLista = preLista.map((item) => {
      if (
        normalizarTexto(item.nome) === normalizarTexto(nomeLimpo) &&
        item.categoria === categoria
      ) {
        return { ...item, concluido: true };
      }
      return item;
    });

    setPreLista(novaPreLista);
    setProduto("");
    setValor("");
    setCategoria("Limpeza");
  }

  function aumentarQuantidade(indexParaAlterar) {
    setItens((listaAtual) =>
      listaAtual.map((item, index) =>
        index === indexParaAlterar
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  }

  function diminuirQuantidade(indexParaAlterar) {
    setItens((listaAtual) =>
      listaAtual
        .map((item, index) =>
          index === indexParaAlterar
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function removerItem(indexParaRemover) {
    setItens((listaAtual) =>
      listaAtual.filter((_, index) => index !== indexParaRemover)
    );
  }

  function adicionarPreLista() {
    const nomeLimpo = itemPreLista.trim();

    if (nomeLimpo === "") {
      return;
    }

    const itemJaExiste = preLista.some((item) => {
      return (
        normalizarTexto(item.nome) === normalizarTexto(nomeLimpo) &&
        item.categoria === categoriaPreLista
      );
    });

    if (itemJaExiste) {
      setItemPreLista("");
      return;
    }

    setPreLista((listaAtual) => [
      ...listaAtual,
      {
        nome: nomeLimpo,
        categoria: categoriaPreLista,
        concluido: false,
      },
    ]);

    setItemPreLista("");
    setCategoriaPreLista("Limpeza");
  }

  function removerPreLista(indexParaRemover) {
    setPreLista((listaAtual) =>
      listaAtual.filter((_, index) => index !== indexParaRemover)
    );
  }

  const total = itens.reduce((acc, item) => {
    return acc + item.precoUnitario * item.quantidade;
  }, 0);

  const orcamentoNumero =
    orcamento.trim() === "" ? 0 : converterParaNumero(orcamento);

  const saldoRestante =
    Number.isNaN(orcamentoNumero) ? 0 : orcamentoNumero - total;

  const estourouOrcamento = saldoRestante < 0;

  function finalizarCompra() {
    if (itens.length === 0) {
      return;
    }

    const compraFinalizada = {
      id: criarIdCompra(),
      data: new Date().toISOString(),
      orcamento:
        orcamento.trim() === "" || Number.isNaN(converterParaNumero(orcamento))
          ? 0
          : converterParaNumero(orcamento),
      total,
      saldoRestante,
      itens: itens.map((item) => ({ ...item })),
    };

    setHistorico((historicoAtual) => [compraFinalizada, ...historicoAtual]);
    setItens([]);
  }

  function limparHistorico() {
    setHistorico([]);
  }

  const preListaAgrupada = agruparPorCategoria(preLista);
  const itensAgrupados = agruparPorCategoria(itens);

  return (
    <div className={`app ${historicoAberto ? "app-historico-aberto" : ""}`}>
      <div className="container-duplo">
        <PreListaPanel
          preListaAberta={preListaAberta}
          setPreListaAberta={setPreListaAberta}
          itemPreLista={itemPreLista}
          setItemPreLista={setItemPreLista}
          categoriaPreLista={categoriaPreLista}
          setCategoriaPreLista={setCategoriaPreLista}
          categorias={categorias}
          preLista={preLista}
          preListaAgrupada={preListaAgrupada}
          adicionarPreLista={adicionarPreLista}
          removerPreLista={removerPreLista}
        />

        <ListaMercadoPanel
          listaAberta={listaAberta}
          setListaAberta={setListaAberta}
          orcamento={orcamento}
          setOrcamento={setOrcamento}
          produto={produto}
          setProduto={setProduto}
          valor={valor}
          setValor={setValor}
          categoria={categoria}
          setCategoria={setCategoria}
          categorias={categorias}
          itens={itens}
          itensAgrupados={itensAgrupados}
          adicionarItem={adicionarItem}
          aumentarQuantidade={aumentarQuantidade}
          diminuirQuantidade={diminuirQuantidade}
          removerItem={removerItem}
          total={total}
          saldoRestante={saldoRestante}
          estourouOrcamento={estourouOrcamento}
          finalizarCompra={finalizarCompra}
        />
      </div>

      <HistoricoPanel
        historicoAberto={historicoAberto}
        setHistoricoAberto={setHistoricoAberto}
        historico={historico}
        categorias={categorias}
        formatarData={formatarData}
        limparHistorico={limparHistorico}
      />
    </div>
  );
}

export default App;
