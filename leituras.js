$(function () {
  const API_URL = 'http://localhost:8080/tarefas';

  // 1. Carregar tarefas do back-end
  function carregarLeituras() {
    $.ajax({
      url: API_URL,
      type: 'GET',
      dataType: 'json',
      success: function (tarefas) {
        // Limpar as listas
        $('#pending-list').empty();
        $('#completed-list').empty();

        let countPending = 0;
        let countCompleted = 0;

        tarefas.forEach(tarefa => {
          // Mapeamento:
          // titulo -> Título do livro
          // descricao -> Autor do livro
          // concluida -> Se já foi lido
          const titulo = tarefa.titulo || 'Sem Título';
          const autor = tarefa.descricao || 'Autor Desconhecido';
          const concluida = tarefa.concluida || false;

          const itemHTML = `
            <div class="todo-item ${concluida ? 'completed' : ''}" data-id="${tarefa.id}">
              <div class="todo-info">
                <div class="todo-icon-box" style="${concluida ? 'color: #10b981;' : ''}">
                  <i class="fa-solid ${concluida ? 'fa-book' : 'fa-book-open'}"></i>
                </div>
                <div>
                  <h4 class="todo-title">${escapeHTML(titulo)}</h4>
                  <p class="todo-author">${escapeHTML(autor)}</p>
                </div>
              </div>
              <div class="todo-actions">
                <button class="button action-btn ${concluida ? 'btn-undo' : 'btn-done'}" 
                        title="${concluida ? 'Mover para Para Ler' : 'Marcar como Lido'}"
                        data-action="toggle" 
                        data-status="${concluida}" 
                        data-title="${escapeAttr(titulo)}" 
                        data-author="${escapeAttr(autor)}">
                  <i class="${concluida ? 'fa-solid fa-arrow-rotate-left' : 'fa-regular fa-circle-check'}"></i>
                </button>
                <button class="button action-btn btn-delete" title="Excluir" data-action="delete">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
          `;

          if (concluida) {
            $('#completed-list').append(itemHTML);
            countCompleted++;
          } else {
            $('#pending-list').append(itemHTML);
            countPending++;
          }
        });

        // Atualizar os contadores na tela
        $('#count-pending').text(countPending);
        $('#count-completed').text(countCompleted);
      },
      error: function (xhr, status, error) {
        console.error('Erro ao buscar tarefas:', error);
        // Exibir mensagem amigável no console/tela caso o backend esteja offline
        console.warn('Certifique-se de que o back-end (Spring Boot) está rodando localmente em http://localhost:8080');
      }
    });
  }

  // 2. Criar nova leitura
  $('#add-reading-form').on('submit', function (e) {
    e.preventDefault();

    const titulo = $('#input-todo-title').val().trim();
    const autor = $('#input-todo-author').val().trim();

    if (!titulo || !autor) return;

    const novaTarefa = {
      titulo: titulo,
      descricao: autor,
      concluida: false
    };

    $.ajax({
      url: API_URL,
      type: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(novaTarefa),
      dataType: 'json',
      success: function () {
        // Limpar inputs
        $('#input-todo-title').val('');
        $('#input-todo-author').val('');
        // Recarregar a lista
        carregarLeituras();
      },
      error: function (xhr, status, error) {
        console.error('Erro ao adicionar leitura:', error);
        alert('Erro ao conectar com o servidor. O back-end está rodando?');
      }
    });
  });

  // 3. Ações nos itens (Alternar Status e Excluir) usando event delegation
  $(document).on('click', '.todo-actions button', function (e) {
    e.preventDefault();
    const btn = $(this);
    const todoItem = btn.closest('.todo-item');
    const id = todoItem.data('id');
    const action = btn.data('action');

    if (action === 'toggle') {
      const statusAtual = btn.data('status');
      const titulo = btn.data('title');
      const autor = btn.data('author');

      const tarefaAtualizada = {
        id: id,
        titulo: titulo,
        descricao: autor,
        concluida: !statusAtual
      };

      $.ajax({
        url: `${API_URL}/${id}`,
        type: 'PUT',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(tarefaAtualizada),
        dataType: 'json',
        success: function () {
          carregarLeituras();
        },
        error: function (xhr, status, error) {
          console.error('Erro ao atualizar status da leitura:', error);
          alert('Erro ao atualizar leitura no servidor.');
        }
      });
    } else if (action === 'delete') {
      $.ajax({
        url: `${API_URL}/${id}`,
        type: 'DELETE',
        success: function () {
          // Efeito visual suave antes de remover do DOM e recarregar
          todoItem.hide('slow', function () {
            carregarLeituras();
          });
        },
        error: function (xhr, status, error) {
          console.error('Erro ao excluir leitura:', error);
          alert('Erro ao excluir leitura no servidor.');
        }
      });
    }
  });

  // Funções auxiliares para evitar XSS
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;');
  }

  // Carregar dados na inicialização
  carregarLeituras();
});
