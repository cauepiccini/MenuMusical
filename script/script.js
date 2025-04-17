let timeoutId;
const delayDebounce = 300; // Tempo em milissegundos

document.addEventListener("DOMContentLoaded", function () {
  const tabela = document.getElementById("tabela-musicas");
  const tbody = tabela.querySelector("tbody");
  const inputPesquisa = document.getElementById("pesquisa");
  const filtroNacional = document.getElementById("filtroNacional");
  const filtroInternacional = document.getElementById("filtroInternacional");
  const filtroGenero = document.getElementById("filtroGenero");

  let dadosMusicas = [];
  let sortBy = localStorage.getItem("sortBy") || "namesong";
  let sortAsc = localStorage.getItem("sortAsc") !== "false";

  function carregarDados() {
	fetch("https://www.doctorapple.com.br/menu/ShowInterativo/dados.php")
	  .then(response => response.json())
	  .then(dados => {
		dadosMusicas = dados;
		preencherSelectGeneros(dadosMusicas);
		aplicarFiltros();
	  })
	  .catch(error => console.error("❌ ERRO ao buscar dados:", error));
  }

  function preencherSelectGeneros(dados) {
	const generos = [...new Set(dados.map(m => m.typesong))].sort();
	filtroGenero.innerHTML = '<option value="">Estilo: Todos</option>';
	generos.forEach(genero => {
	  filtroGenero.innerHTML += `<option value="${genero}">${genero}</option>`;
	});
  }

  function aplicarFiltros() {
	const termo = inputPesquisa.value.toLowerCase();
	const mostrarNacional = filtroNacional.checked;
	const mostrarInternacional = filtroInternacional.checked;
	const generoSelecionado = filtroGenero.value.toLowerCase();
	const nenhumFiltroMarcado = !mostrarNacional && !mostrarInternacional;

	const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // Salva a posição do scroll

	const dadosFiltrados = dadosMusicas.filter(musica => {
	  const nome = musica.namesong.toLowerCase();
	  const artista = musica.artist.toLowerCase();
	  const trecho = musica.lyricsong.toLowerCase();
	  const nacionalidade = musica.national == true || musica.national == "1";
	  const corresponde = nome.includes(termo) || artista.includes(termo) || trecho.includes(termo);
	  const correspondeGenero = generoSelecionado === "" || musica.typesong.toLowerCase() === generoSelecionado;
	  const passaFiltroNacionalidade =
		nenhumFiltroMarcado ||
		(nacionalidade && mostrarNacional) ||
		(!nacionalidade && mostrarInternacional);

	  return corresponde && correspondeGenero && passaFiltroNacionalidade;
	});

	dadosFiltrados.sort((a, b) => {
	  const valorA = a[sortBy]?.toLowerCase() || "";
	  const valorB = b[sortBy]?.toLowerCase() || "";
	  return sortAsc ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
	});

	preencherTabela(dadosFiltrados);

	// Restaura a posição do scroll após a atualização da tabela
	setTimeout(() => {
	  document.documentElement.scrollTop = scrollTop;
	  document.body.scrollTop = scrollTop;
	}, 0);
  }

  function preencherTabela(dados) {
	tbody.innerHTML = "";
	dados.forEach(musica => {
	  const tr = document.createElement("tr");

	  const tdNome = document.createElement("td");
	  tdNome.textContent = musica.namesong;
	  tr.appendChild(tdNome);

	  const tdArtista = document.createElement("td");
	  tdArtista.textContent = musica.artist;
	  tr.appendChild(tdArtista);

	  const tdBotao = document.createElement("td");
	  const botao = document.createElement("a");
	  botao.href = `https://wa.me/553432552147?text=Gostaria%20de%20ouvir:%20*${encodeURIComponent(musica.namesong)}*%20de%20*${encodeURIComponent(musica.artist)}*`;
	  botao.target = "_blank";
	  botao.innerHTML = `<i class="fab fa-whatsapp"></i>`;
	  botao.classList.add("btn-whatsapp");
	  tdBotao.appendChild(botao);
	  tr.appendChild(tdBotao);

	  tbody.appendChild(tr);
	});
  }

  inputPesquisa.addEventListener("input", () => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(aplicarFiltros, delayDebounce);
  });
  filtroGenero.addEventListener("change", aplicarFiltros);
  filtroNacional.addEventListener("change", () => {
	if (filtroNacional.checked) filtroInternacional.checked = false;
	aplicarFiltros();
  });
  filtroInternacional.addEventListener("change", () => {
	if (filtroInternacional.checked) filtroNacional.checked = false;
	aplicarFiltros();
  });

  document.querySelectorAll("th[data-sort]").forEach(th => {
	th.addEventListener("click", () => {
	  const campo = th.dataset.sort;
	  if (sortBy === campo) {
		sortAsc = !sortAsc;
	  } else {
		sortBy = campo;
		sortAsc = true;
	  }
	  localStorage.setItem("sortBy", sortBy);
	  localStorage.setItem("sortAsc", sortAsc);
	  aplicarFiltros();
	});
  });

  document.getElementById("limparBusca").addEventListener("click", () => {
	inputPesquisa.value = '';
	inputPesquisa.dispatchEvent(new Event('input'));
  });

  document.getElementById("btn-limpar-filtros").addEventListener("click", () => {
	inputPesquisa.value = '';
	filtroGenero.value = '';
	filtroNacional.checked = false;
	filtroInternacional.checked = false;
	aplicarFiltros();
  });

  carregarDados();
});