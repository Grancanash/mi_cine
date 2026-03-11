(() => {
    const state = {
        page: 1,
        hasNext: true,
        loading: false,
        text: "",
        timeoutID: null,
        sortOrder: '-created_at',
        categories: [],
    };

    const ui = {
        container: document.getElementById("titles-container"),
        input: document.getElementById('titleSearchInput'),
        loader: document.getElementById("loader"),
        sortOrderTitles: document.querySelectorAll('.order-titles')[0],
        btnFilter: document.querySelector('#btn-filter'),
        selectFilterCategories: document.querySelector('#id_categories'),
        totalTitles: document.querySelector('.total-titles'),
        totalTitlesAbsolute: document.querySelector('#total-titles-absolute'),
        titlesEmpty: document.querySelector('#titles-empty'),
        titlesNotMatch: document.querySelector('#titles-not-match'),
    };

    const notify_not_match = () => {
        ui.container.innerHTML = `
        <li id="titles-not-match" class="list-row flex justify-center">
            <div class="text-center p-6">
                <h3 class="m-0! text-secondary!">No se encontraron registros.</h3>
            </div>
        </li>
        `;
    }

    const fetchTitles = (replace = false) => {

        if (state.loading || (!replace && !state.hasNext)) return;
        state.loading = true;
        ui.loader.style.display = "block";
        let url = `/titles/api/search/?page=${state.page}&text=${state.text}&order=${state.sortOrder}`;

        if (state.categories.length) {
            url += state.categories.reduce((acc, category) => acc + '&category=' + category, '');
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.empty) return; // Si laq BBDD está vacía muestra mensaje

                // Actualiza etiqueta total registros
                ui.totalTitles.textContent = (data.total_count > 1 ? `${data.total_count} registros` : data.total_count === 1 ? '1 registro' : '');

                if (data.total_count === 0) {
                    notify_not_match(); // Si la búsqueda o aplicación de filtros no devuvel resultados, muestra mensaje
                    return;
                }

                if (replace) ui.container.innerHTML = data.html;
                else ui.container.insertAdjacentHTML("beforeend", data.html);

                state.hasNext = data.has_next;
                state.page++;
            })
            .finally(() => {
                state.loading = false;
                ui.loader.style.display = "none";
            });
    };

    // Evento Búsqueda
    ui.input.addEventListener("input", () => {
        clearTimeout(state.timeoutID);
        state.timeoutID = setTimeout(() => {
            state.page = 1;
            state.text = ui.input.value;
            state.hasNext = true;
            fetchTitles(true); // Reemplazar contenido
        }, 300);
    });

    // Evento Scroll
    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
            fetchTitles(false); // Añadir contenido
        }
    });

    // Evento ordenación
    ui.sortOrderTitles.addEventListener('click', (e) => {
        if (e.target.matches('.btn')) {
            state.page = 1;
            state.sortOrder = e.target.dataset.order;

            ui.sortOrderTitles.querySelectorAll('.btn').forEach(btn => {
                btn.classList.remove('selected-title');
            });

            e.target.classList.add('selected-title');
            localStorage.setItem('sortOrder', state.sortOrder)
            fetchTitles(true); // Ordenar
        }
    })

    // Evento botón filtro
    ui.btnFilter.addEventListener('click', (e) => {
        state.page = 1;
        const targetId = e.target.dataset.target;
        const checkbox = document.getElementById(targetId)?.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = !checkbox.checked;
    });

    // Evento filtrar por categoría
    $(ui.selectFilterCategories).on("select2:select", function (e) {
        state.page = 1;
        state.categories = $(this).val();
        fetchTitles(true);
    });
    $(ui.selectFilterCategories).on("select2:unselect", function (e) {
        state.page = 1;
        state.categories = $(this).val();
        fetchTitles(true);
    });

    // Carga inicial
    document.addEventListener('DOMContentLoaded', () => {
        // Se obtiene del localStorage el orden de clasificación de los títulos y se actualiza en la lista de títulos
        state.sortOrder = localStorage.getItem('sortOrder') || '-created_at';
        ui.sortOrderTitles.querySelectorAll('.btn').forEach(btn => {
            btn.classList.remove('selected-title');
        });
        ui.sortOrderTitles.querySelector(`.btn[data-order=${state.sortOrder}]`).classList.add('selected-title');
        fetchTitles(true);
    });

})();