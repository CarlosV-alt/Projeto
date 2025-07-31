const API_URL = 'http://localhost:5000';

function initPage() {
    if (document.getElementById('formCidadao')) {
        setupCadastroPage();
    } else if (document.getElementById('formAtendimento')) {
        setupAtendimentoPage();
    } else if (document.getElementById('listaAtendimentos')) {
        setupHistoricoPage();
    }
}

function setupCadastroPage() {
    document.getElementById('formCidadao').addEventListener('submit', async (e) => {
        e.preventDefault();
        const cidadao = {
            nome: document.getElementById('nomeCidadao').value,
            cpf: document.getElementById('cpf').value,
            data_nascimento: document.getElementById('dataNascimento').value,
            sexo: document.getElementById('sexo').value
        };
        
        const response = await fetch(`${API_URL}/cidadaos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cidadao)
        });
        
        if (response.ok) {
            alert('Cidadão cadastrado com sucesso!');
            document.getElementById('formCidadao').reset();
        }
    });

    document.getElementById('formProfissional').addEventListener('submit', async (e) => {
        e.preventDefault();
        const profissional = {
            nome: document.getElementById('nomeProfissional').value,
            funcao: document.getElementById('funcao').value,
            setor: document.getElementById('setor').value
        };
        
        const response = await fetch(`${API_URL}/profissionais`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profissional)
        });
        
        if (response.ok) {
            alert('Profissional cadastrado com sucesso!');
            document.getElementById('formProfissional').reset();
        }
    });
}

function setupAtendimentoPage() {
    carregarCidadaos();
    carregarProfissionais();

    document.getElementById('formAtendimento').addEventListener('submit', async (e) => {
        e.preventDefault();
        const atendimento = {
            data: document.getElementById('data').value,
            tipo: document.getElementById('tipo').value,
            descricao: document.getElementById('descricao').value,
            cidadao_id: document.getElementById('cidadao').value,
            profissional_id: document.getElementById('profissional').value
        };
        
        const response = await fetch(`${API_URL}/atendimentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(atendimento)
        });
        
        if (response.ok) {
            alert('Atendimento registrado com sucesso!');
            document.getElementById('formAtendimento').reset();
        }
    });
}

function setupHistoricoPage() {
    carregarProfissionaisParaFiltro();
    
    carregarAtendimentos();
    
    document.getElementById('applyFilters').addEventListener('click', carregarAtendimentos);
}

async function carregarCidadaos() {
    try {
        const response = await fetch(`${API_URL}/cidadaos`);
        const cidadaos = await response.json();
        const select = document.getElementById('cidadao');
        
        select.innerHTML = '<option value="">Selecione um cidadão</option>';
        cidadaos.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = `${c.nome} (${c.cpf})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar cidadãos:', error);
    }
}

async function carregarProfissionais() {
    try {
        const response = await fetch(`${API_URL}/profissionais`);
        const profissionais = await response.json();
        const select = document.getElementById('profissional');
        
        select.innerHTML = '<option value="">Selecione um profissional</option>';
        profissionais.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.nome} - ${p.funcao}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
    }
}

async function carregarProfissionaisParaFiltro() {
    try {
        const response = await fetch(`${API_URL}/profissionais`);
        const profissionais = await response.json();
        const select = document.getElementById('filterProfessional');
        
        select.innerHTML = '<option value="">Todos os profissionais</option>';
        profissionais.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.nome} (${p.funcao})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
    }
}

async function carregarAtendimentos() {
    try {
        const response = await fetch(`${API_URL}/atendimentos`);
        const atendimentos = await response.json();
        const container = document.getElementById('listaAtendimentos');
        container.innerHTML = '';
        
        const filterDate = document.getElementById('filterDate').value;
        const filterType = document.getElementById('filterType').value;
        const filterProfessional = document.getElementById('filterProfessional').value;
        
        const atendimentosFiltrados = atendimentos.filter(a => {
            if (filterDate) {
                const atendimentoDate = new Date(a.data).toISOString().split('T')[0];
                if (atendimentoDate !== filterDate) return false;
            }
            
            if (filterType && a.tipo !== filterType) return false;
            
            if (filterProfessional && a.profissional_id != filterProfessional) return false;
            
            return true;
        });
        
        if (atendimentosFiltrados.length === 0) {
            container.innerHTML = '<p>Nenhum atendimento encontrado com os filtros aplicados.</p>';
            return;
        }
        
        atendimentosFiltrados.forEach(a => {
            const card = document.createElement('div');
            card.className = 'atendimento-card';
            card.innerHTML = `
                <h3>${formatarTipo(a.tipo)}</h3>
                <div class="meta">
                    <span><strong>Data:</strong> ${new Date(a.data).toLocaleString()}</span>
                    <span><strong>Profissional:</strong> ${a.profissional}</span>
                </div>
                <p><strong>Cidadão:</strong> ${a.cidadao}</p>
                <div class="desc">
                    <p><strong>Descrição:</strong> ${a.descricao}</p>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar atendimentos:', error);
        const container = document.getElementById('listaAtendimentos');
        container.innerHTML = '<p>Erro ao carregar atendimentos. Tente novamente mais tarde.</p>';
    }
}

function setupListagemPage() {
    carregarCidadaosParaListagem();
    carregarProfissionaisParaListagem();
    
    document.getElementById('searchCitizenBtn').addEventListener('click', carregarCidadaosParaListagem);
    document.getElementById('searchProfessionalBtn').addEventListener('click', carregarProfissionaisParaListagem);
    
    document.getElementById('prevCitizenPage').addEventListener('click', () => {
        currentCitizenPage--;
        carregarCidadaosParaListagem();
    });
    
    document.getElementById('nextCitizenPage').addEventListener('click', () => {
        currentCitizenPage++;
        carregarCidadaosParaListagem();
    });
    
    document.getElementById('prevProfessionalPage').addEventListener('click', () => {
        currentProfessionalPage--;
        carregarProfissionaisParaListagem();
    });
    
    document.getElementById('nextProfessionalPage').addEventListener('click', () => {
        currentProfessionalPage++;
        carregarProfissionaisParaListagem();
    });
}

let currentCitizenPage = 1;
let currentProfessionalPage = 1;
const itemsPerPage = 10;

async function carregarCidadaosParaListagem() {
    try {
        const searchTerm = document.getElementById('searchCitizen').value;
        const tableBody = document.querySelector('#citizensTable tbody');
        tableBody.innerHTML = '<tr><td colspan="5" class="loading">Carregando cidadãos...</td></tr>';
        
        const response = await fetch(`${API_URL}/cidadaos`);
        let cidadaos = await response.json();
        

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            cidadaos = cidadaos.filter(c => 
                c.nome.toLowerCase().includes(term) || 
                c.cpf.includes(term)
            );
        }
        
        document.getElementById('citizenCount').textContent = `${cidadaos.length} cidadãos encontrados`;
        
        const totalPages = Math.ceil(cidadaos.length / itemsPerPage);
        const startIndex = (currentCitizenPage - 1) * itemsPerPage;
        const paginatedItems = cidadaos.slice(startIndex, startIndex + itemsPerPage);
        
        document.getElementById('prevCitizenPage').disabled = currentCitizenPage <= 1;
        document.getElementById('nextCitizenPage').disabled = currentCitizenPage >= totalPages;
        document.getElementById('citizenPageInfo').textContent = `Página ${currentCitizenPage} de ${totalPages}`;
        
        tableBody.innerHTML = '';
        
        if (paginatedItems.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">Nenhum cidadão encontrado</td></tr>';
            return;
        }
        
        paginatedItems.forEach(c => {
            const row = document.createElement('tr');
            
            const dataNasc = new Date(c.data_nascimento).toLocaleDateString('pt-BR');
            
            row.innerHTML = `
                <td>${c.nome}</td>
                <td>${c.cpf}</td>
                <td>${dataNasc}</td>
                <td>${formatarSexo(c.sexo)}</td>
                <td>
                    <button class="btn-action btn-edit">Editar</button>
                    <button class="btn-action btn-delete">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar cidadãos:', error);
        const tableBody = document.querySelector('#citizensTable tbody');
        tableBody.innerHTML = '<tr><td colspan="5" class="error">Erro ao carregar cidadãos</td></tr>';
    }
}

async function carregarProfissionaisParaListagem() {
    try {
        const searchTerm = document.getElementById('searchProfessional').value;
        const tableBody = document.querySelector('#professionalsTable tbody');
        tableBody.innerHTML = '<tr><td colspan="4" class="loading">Carregando profissionais...</td></tr>';
        
        const response = await fetch(`${API_URL}/profissionais`);
        let profissionais = await response.json();
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            profissionais = profissionais.filter(p => 
                p.nome.toLowerCase().includes(term) || 
                p.funcao.toLowerCase().includes(term) ||
                p.setor.toLowerCase().includes(term)
            );
        }
        
        document.getElementById('professionalCount').textContent = `${profissionais.length} profissionais encontrados`;
        
        const totalPages = Math.ceil(profissionais.length / itemsPerPage);
        const startIndex = (currentProfessionalPage - 1) * itemsPerPage;
        const paginatedItems = profissionais.slice(startIndex, startIndex + itemsPerPage);
        
        document.getElementById('prevProfessionalPage').disabled = currentProfessionalPage <= 1;
        document.getElementById('nextProfessionalPage').disabled = currentProfessionalPage >= totalPages;
        document.getElementById('professionalPageInfo').textContent = `Página ${currentProfessionalPage} de ${totalPages}`;
        
        tableBody.innerHTML = '';
        
        if (paginatedItems.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">Nenhum profissional encontrado</td></tr>';
            return;
        }
        
        paginatedItems.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.nome}</td>
                <td>${p.funcao}</td>
                <td>${p.setor}</td>
                <td>
                    <button class="btn-action btn-edit">Editar</button>
                    <button class="btn-action btn-delete">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
        const tableBody = document.querySelector('#professionalsTable tbody');
        tableBody.innerHTML = '<tr><td colspan="4" class="error">Erro ao carregar profissionais</td></tr>';
    }
}

function formatarSexo(sexo) {
    const sexos = {
        'M': 'Masculino',
        'F': 'Feminino',
        'O': 'Outro'
    };
    return sexos[sexo] || sexo;
}

function initPage() {
    if (document.getElementById('formCidadao')) {
        setupCadastroPage();
    } else if (document.getElementById('formAtendimento')) {
        setupAtendimentoPage();
    } else if (document.getElementById('listaAtendimentos')) {
        setupHistoricoPage();
    } else if (document.getElementById('citizensTable')) {
        setupListagemPage();
    }
}

function formatarTipo(tipo) {
    const tipos = {
        'VISITA_DOMICILIAR': 'Visita Domiciliar',
        'CONSULTA': 'Consulta',
        'ENCAMINHAMENTO': 'Encaminhamento'
    };
    return tipos[tipo] || tipo;
}

document.addEventListener('DOMContentLoaded', initPage);