(() => {
    const state = {
        loading: false,
        media_type: '',
        text: '',
    };

    const ui = {
        fieldTitle: document.getElementById('id_name'),
        button: document.getElementById('btnSearchExternalTitle'),
        msg: document.getElementById('msgSearchExternalTitle'),
        loader: document.getElementById("loader"),
        name: document.getElementById('id_name'),
        original_title: document.getElementById('id_original_title'),
        year: document.getElementById('id_year'),
        type: document.getElementById('id_type'),
        description: document.getElementById('id_description'),
        categories: document.getElementById('id_categories'),
        actors: document.getElementById('id_actors'),
        platforms: document.getElementById('id_platforms'),
        btnModalDeleteTitle: document.getElementById('btn_modal_delete_title'),
        btnDeleteTitle: document.getElementById('btn_delete_title'),
    };

    const titleCase = (str) => {
        return str.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }


    const showTitlesLabels = (titles) => {

        const card = (title) => `
            <div class="title-card w-full px-3 py-1 rounded-sm bg-base-200 hover:bg-base-300 flex items-center justify-between cursor-pointer" data-id="${title.id}" data-mediatype="${title.media_type}">
                <div>
                    <div class="text-sm"><span class="">${title.name}</span> <span class="font-light">(${title.year}) - ${title.media_type === 'tv' ? 'Serie' : 'Película'}</span></div>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                    <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                </svg>
                </div>
            </div>
            `;

        const wraper = document.createElement('div');
        wraper.id = 'titles-minicards';
        const container = document.createElement('div');
        container.classList.add('titles-minicards-container', 'flex', 'flex-col', 'gap-1');

        ui.button.parentElement.insertAdjacentElement('afterend', wraper);

        wraper.insertAdjacentHTML('beforeend', '<div class="text-secondary mb-2">Selecciona el título que buscas:</div>');
        wraper.insertAdjacentElement('beforeend', container);

        titles.forEach((title) => {
            container.insertAdjacentHTML('beforeend', card(title));
        })

        container.addEventListener('click', (e) => {
            loading(true);
            const card = e.target.closest('.title-card');
            const id = card.dataset.id;
            const mediaType = card.dataset.mediatype;

            if (!state.loading) {
                const url = `/titles/api/search/external/?id=${id}&media_type=${mediaType}`;
                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        const titles_minicards = document.querySelector('#titles-minicards');
                        if (titles_minicards) titles_minicards.remove();
                        updateDom(data.title_info);
                    })
                    .finally(() => {
                        loading(false);
                    });
            }
        });

    }

    const loading = (state) => {
        if (state) {
            state.loading = true;
            ui.loader.classList.remove('hidden');
        } else {
            state.loading = false;
            ui.loader.classList.add('hidden');
        }
    }

    const fetchTitle = () => {
        state.text = document.getElementById('id_name').value

        if (!state.text || state.loading) return;

        loading(true);

        const url = `/titles/api/search/external/?text=${state.text}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const minicards = document.getElementById('titles-minicards')
                if (minicards) minicards.remove();

                ui.msg.classList.add('hidden');

                if (!data.status) {
                    ui.msg.innerHTML = data.msg;
                    ui.msg.classList.add('text-error');
                    ui.msg.classList.remove('hidden');
                    return;
                }

                showTitlesLabels(data.titles);
            })
            .finally(() => {
                loading(false)
            });
    };

    const updateSelect = (select, values) => {
        // Marcar existentes
        [...select.options].forEach(option => {
            option.selected = values.some(value => {
                return value.toLowerCase() === option.value.toLowerCase()
            });
        });

        // Crear faltantes
        values.forEach(value => {
            if (![...select.options].some(option =>
                value.toLowerCase() === option.value.toLowerCase()
            )) {
                const opt = new Option(titleCase(value), titleCase(value));
                select.add(opt);
                opt.selected = true;
            }
        });

        // Se fuerza el evento change con el disparador (trigger) para asegurarnos de que select2 es consciente de los cambios
        // (si no se hace se generan comportamientos extraños del select)

        $(select).trigger('change.select2');
    };


    const updateDom = (data) => {
        // Título
        ui.name.value = data.name;

        // Actualizar Título Original
        ui.original_title.value = data.original_title;

        // Año
        ui.year.value = data.year;

        // Tipo
        ui.type.value = data.type === 'tv' ? 'series' : 'movie';

        // Descripción
        ui.description.value = data.description;

        // Actualizar categorías/géneros
        categories = data.categories;
        updateSelect(ui.categories, categories);

        // Actualizar actores
        actors = data.actors;
        updateSelect(ui.actors, actors);

        // Actualizar plataformas
        platforms = data.platforms;
        updateSelect(ui.platforms, platforms);
    }

    ui.button.addEventListener("click", (e) => {
        e.preventDefault();
        fetchTitle();
    });

    ui.fieldTitle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchTitle();
        }
    });

    if (ui.btnModalDeleteTitle) {
        ui.btnModalDeleteTitle.addEventListener('click', (e) => {
            e.preventDefault();
            modal_delete_title.showModal();
        });
    }

})();