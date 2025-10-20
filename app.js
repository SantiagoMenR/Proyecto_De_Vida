// Datos almacenados en memoria
let metas = [];
let emociones = [];
let proyectoVida = {
    vision: '',
    objetivos: '',
    fortalezas: '',
    valores: '',
    plan: '',
    progreso: '',
    fechaActualizacion: ''
};
let objetivosSMART = [];
let cancionesRecientes = [];
let musicaReproduciendo = false;
let videoIdActual = null;

// Variables para Película Mental
let imagenesCargadas = [];
let peliculaActual = null;
let reproduciendoPelicula = false;
let intervaloReproduccion = null;
let indiceImagenActual = 0;

// Funciones para localStorage
function guardarMetas() {
    localStorage.setItem('proyectoVida_metas', JSON.stringify(metas));
}

function cargarMetas() {
    const metasGuardadas = localStorage.getItem('proyectoVida_metas');
    if (metasGuardadas) {
        metas = JSON.parse(metasGuardadas);
    }
}

function guardarEmociones() {
    localStorage.setItem('proyectoVida_emociones', JSON.stringify(emociones));
}

function cargarEmociones() {
    const emocionesGuardadas = localStorage.getItem('proyectoVida_emociones');
    if (emocionesGuardadas) {
        emociones = JSON.parse(emocionesGuardadas);
    }
}

function guardarProyecto() {
    localStorage.setItem('proyectoVida_proyecto', JSON.stringify(proyectoVida));
}

function cargarProyecto() {
    const proyectoGuardado = localStorage.getItem('proyectoVida_proyecto');
    if (proyectoGuardado) {
        proyectoVida = JSON.parse(proyectoGuardado);
    }
}

function guardarObjetivosSMART() {
    localStorage.setItem('proyectoVida_objetivosSMART', JSON.stringify(objetivosSMART));
}

function cargarObjetivosSMART() {
    const objetivosGuardados = localStorage.getItem('proyectoVida_objetivosSMART');
    if (objetivosGuardados) {
        objetivosSMART = JSON.parse(objetivosGuardados);
    }
}

function guardarCancionesRecientes() {
    localStorage.setItem('proyectoVida_cancionesRecientes', JSON.stringify(cancionesRecientes));
}

function cargarCancionesRecientes() {
    const cancionesGuardadas = localStorage.getItem('proyectoVida_cancionesRecientes');
    if (cancionesGuardadas) {
        cancionesRecientes = JSON.parse(cancionesGuardadas);
    }
}


// Navegación entre secciones
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
    });
});

// Formulario de Metas
document.getElementById('form-meta').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const meta = {
        id: Date.now(),
        titulo: document.getElementById('meta-titulo').value,
        descripcion: document.getElementById('meta-descripcion').value,
        prioridad: document.getElementById('meta-prioridad').value,
        fecha: document.getElementById('meta-fecha').value,
        completada: false,
        fechaCreacion: new Date().toLocaleDateString()
    };
    
    metas.push(meta);
    guardarMetas(); // Guardar en localStorage
    actualizarMetas();
    actualizarInicio();
    e.target.reset();
});

// Formulario de Emociones
document.getElementById('form-emocion').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emocion = {
        id: Date.now(),
        tipo: document.getElementById('emocion-tipo').value,
        descripcion: document.getElementById('emocion-descripcion').value,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString()
    };
    
    emociones.push(emocion);
    guardarEmociones(); // Guardar en localStorage
    actualizarEmociones();
    actualizarInicio();
    e.target.reset();
});

// Formulario de Proyecto de Vida
document.getElementById('form-proyecto').addEventListener('submit', (e) => {
    e.preventDefault();
    
    proyectoVida = {
        vision: document.getElementById('proyecto-vision').value,
        objetivos: document.getElementById('proyecto-objetivos').value,
        fortalezas: document.getElementById('proyecto-fortalezas').value,
        valores: document.getElementById('proyecto-valores').value,
        plan: document.getElementById('proyecto-plan').value,
        progreso: document.getElementById('proyecto-progreso').value,
        fechaActualizacion: new Date().toLocaleDateString()
    };
    
    guardarProyecto();
    actualizarVistaProyecto();
    actualizarInicio();
    
    // Mostrar mensaje de éxito
    mostrarNotificacion('✅ Proyecto de vida guardado exitosamente', 'success');
});

// Formulario de Objetivos SMART
document.getElementById('form-objetivo-smart').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const objetivo = {
        id: Date.now(),
        texto: document.getElementById('objetivo-texto').value,
        medible: document.getElementById('objetivo-medible').value,
        fecha: document.getElementById('objetivo-fecha').value,
        completado: false,
        fechaCreacion: new Date().toLocaleDateString()
    };
    
    objetivosSMART.push(objetivo);
    guardarObjetivosSMART();
    actualizarObjetivosSMART();
    actualizarInicio();
    e.target.reset();
});

// Configurar funcionalidad de música
function configurarMusica() {
    const musicBtn = document.getElementById('music-floating-btn');
    const musicModal = document.getElementById('music-modal');
    const closeModal = document.getElementById('close-modal');
    const addYoutubeBtn = document.getElementById('add-youtube-btn');
    const youtubeUrlInput = document.getElementById('youtube-url-input');
    const youtubePlayerModal = document.getElementById('youtube-player-modal');
    const closePlayer = document.getElementById('close-player');
    
    // Abrir modal de música
    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            musicModal.classList.add('show');
            actualizarHistorialCanciones();
        });
    }
    
    // Cerrar modal de música
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            musicModal.classList.remove('show');
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (musicModal) {
        musicModal.addEventListener('click', (e) => {
            if (e.target === musicModal) {
                musicModal.classList.remove('show');
            }
        });
    }
    
    // Agregar canción de YouTube
    if (addYoutubeBtn) {
        addYoutubeBtn.addEventListener('click', () => {
            const url = youtubeUrlInput.value.trim();
            const nombreCancion = document.getElementById('song-name-input').value.trim();
            
            if (!url) {
                mostrarNotificacion('❌ Por favor ingresa una URL de YouTube', 'error');
                return;
            }
            
            const videoId = extraerIdYouTube(url);
            if (!videoId) {
                mostrarNotificacion('❌ URL de YouTube inválida', 'error');
                return;
            }
            
            agregarCancionReciente(url, videoId, nombreCancion || null);
            youtubeUrlInput.value = '';
            document.getElementById('song-name-input').value = '';
            musicModal.classList.remove('show');
            mostrarNotificacion('🎵 Canción agregada exitosamente', 'success');
        });
    }
    
    // Permitir agregar con Enter
    if (youtubeUrlInput) {
        youtubeUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addYoutubeBtn.click();
            }
        });
    }
    
    const songNameInput = document.getElementById('song-name-input');
    if (songNameInput) {
        songNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addYoutubeBtn.click();
            }
        });
    }
    
    // Cerrar modal del reproductor
    if (closePlayer) {
        closePlayer.addEventListener('click', () => {
            youtubePlayerModal.classList.remove('show');
            // No detener la música, solo cerrar el modal
        });
    }
    
    // Cerrar modal del reproductor al hacer clic fuera
    if (youtubePlayerModal) {
        youtubePlayerModal.addEventListener('click', (e) => {
            if (e.target === youtubePlayerModal) {
                youtubePlayerModal.classList.remove('show');
                // No detener la música, solo cerrar el modal
            }
        });
    }
    
    
    // Botón de control de música
    const musicControlBtn = document.getElementById('music-control-btn');
    if (musicControlBtn) {
        musicControlBtn.addEventListener('click', toggleReproduccion);
    }
}

function extraerIdYouTube(url) {
    const patterns = [
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
        /youtube\.com\/watch\?v=([^"&?\/\s]{11})/,
        /youtu\.be\/([^"&?\/\s]{11})/,
        /youtube\.com\/embed\/([^"&?\/\s]{11})/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    return null;
}

function agregarCancionReciente(url, videoId, nombrePersonalizado = null) {
    const cancion = {
        id: Date.now(),
        url: url,
        videoId: videoId,
        nombre: nombrePersonalizado || `Video de YouTube`,
        fechaAgregada: new Date().toLocaleDateString(),
        horaAgregada: new Date().toLocaleTimeString()
    };
    
    // Agregar al inicio del array
    cancionesRecientes.unshift(cancion);
    
    // Mantener máximo 15 canciones
    if (cancionesRecientes.length > 15) {
        cancionesRecientes = cancionesRecientes.slice(0, 15);
    }
    
    guardarCancionesRecientes();
}

function actualizarHistorialCanciones() {
    console.log('Actualizando historial de canciones:', cancionesRecientes);
    
    const lista = document.getElementById('recent-songs-list');
    
    if (cancionesRecientes.length === 0) {
        lista.innerHTML = `
            <div class="empty-history">
                <p>No hay canciones agregadas</p>
                <small>Agrega una canción de YouTube para comenzar</small>
            </div>
        `;
        return;
    }
    
    const html = cancionesRecientes.map(cancion => `
        <div class="song-item">
            <div class="song-info">
                <h5 class="song-title" id="song-title-${cancion.id}">${cancion.nombre}</h5>
                <p>📅 ${cancion.fechaAgregada} - 🕐 ${cancion.horaAgregada}</p>
            </div>
            <div class="song-actions">
                <button class="play-song-btn" onclick="reproducirCancion('${cancion.videoId}')">
                    ▶️ Reproducir
                </button>
                <button class="edit-song-btn" onclick="editarNombreCancion(${cancion.id})">
                    ✏️ Editar
                </button>
                <button class="delete-song-btn" onclick="eliminarCancionReciente(${cancion.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
    
    console.log('HTML generado:', html);
    lista.innerHTML = html;
}

function reproducirCancion(videoId) {
    console.log('Reproduciendo canción con videoId:', videoId);
    
    const youtubePlayerModal = document.getElementById('youtube-player-modal');
    const youtubePlayer = document.getElementById('youtube-player');
    const currentSongTitle = document.getElementById('current-song-title');
    
    console.log('Elementos encontrados:', {
        youtubePlayerModal: !!youtubePlayerModal,
        youtubePlayer: !!youtubePlayer,
        currentSongTitle: !!currentSongTitle
    });
    
    if (!youtubePlayerModal) {
        console.error('No se encontró el modal del reproductor');
        mostrarNotificacion('❌ Error: Modal del reproductor no encontrado', 'error');
        return;
    }
    
    if (!youtubePlayer) {
        console.error('No se encontró el iframe del reproductor');
        mostrarNotificacion('❌ Error: Reproductor de YouTube no encontrado', 'error');
        return;
    }
    
    if (!videoId) {
        console.error('VideoId no válido:', videoId);
        mostrarNotificacion('❌ Error: ID del video no válido', 'error');
        return;
    }
    
    try {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
        console.log('URL del embed:', embedUrl);
        
        // Limpiar el iframe anterior
        youtubePlayer.src = '';
        
        // Establecer la nueva URL
        youtubePlayer.src = embedUrl;
        
        if (currentSongTitle) {
            currentSongTitle.textContent = 'Reproduciendo video de YouTube...';
        }
        
        // Mostrar el modal
        youtubePlayerModal.classList.add('show');
        
        console.log('Modal abierto exitosamente');
        mostrarNotificacion('🎵 Reproduciendo video de YouTube', 'success');
        
        // Actualizar estado de reproducción
        musicaReproduciendo = true;
        videoIdActual = videoId;
        mostrarBotonControl();
        
    } catch (error) {
        console.error('Error al reproducir:', error);
        mostrarNotificacion('❌ Error al reproducir el video', 'error');
    }
}

function eliminarCancionReciente(id) {
    cancionesRecientes = cancionesRecientes.filter(c => c.id !== id);
    guardarCancionesRecientes();
    actualizarHistorialCanciones();
    mostrarNotificacion('🗑️ Canción eliminada del historial', 'info');
}

function editarNombreCancion(id) {
    const cancion = cancionesRecientes.find(c => c.id === id);
    if (!cancion) return;
    
    const nuevoNombre = prompt('Editar nombre de la canción:', cancion.nombre);
    
    if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
        cancion.nombre = nuevoNombre.trim();
        guardarCancionesRecientes();
        actualizarHistorialCanciones();
        mostrarNotificacion('✏️ Nombre actualizado', 'success');
    }
}

// Funciones para el botón de control de música
function mostrarBotonControl() {
    const controlBtn = document.getElementById('music-control-btn');
    if (controlBtn) {
        controlBtn.style.display = 'flex';
        actualizarIconoControl();
    }
}

function ocultarBotonControl() {
    const controlBtn = document.getElementById('music-control-btn');
    if (controlBtn) {
        controlBtn.style.display = 'none';
    }
}

function actualizarIconoControl() {
    const icon = document.getElementById('control-icon');
    if (icon) {
        icon.textContent = musicaReproduciendo ? '⏸️' : '▶️';
    }
}

function toggleReproduccion() {
    const youtubePlayerModal = document.getElementById('youtube-player-modal');
    
    if (musicaReproduciendo) {
        // Pausar música
        musicaReproduciendo = false;
        actualizarIconoControl();
        
        // Mostrar modal para pausar
        if (youtubePlayerModal) {
            youtubePlayerModal.classList.add('show');
        }
        
        mostrarNotificacion('⏸️ Música pausada', 'info');
    } else {
        // Reanudar música
        musicaReproduciendo = true;
        actualizarIconoControl();
        
        // Mostrar modal para reanudar
        if (youtubePlayerModal) {
            youtubePlayerModal.classList.add('show');
        }
        
        mostrarNotificacion('▶️ Música reanudada', 'success');
    }
}

function detenerMusicaCompletamente() {
    musicaReproduciendo = false;
    videoIdActual = null;
    
    const youtubePlayerModal = document.getElementById('youtube-player-modal');
    const youtubePlayer = document.getElementById('youtube-player');
    
    if (youtubePlayerModal) {
        youtubePlayerModal.classList.remove('show');
    }
    
    if (youtubePlayer) {
        youtubePlayer.src = '';
    }
    
    ocultarBotonControl();
    mostrarNotificacion('⏹️ Música detenida', 'info');
}

function actualizarMetas() {
    const lista = document.getElementById('lista-metas');
    
    if (metas.length === 0) {
        lista.innerHTML = '<div class="empty-state"><p>No tienes metas creadas aún. ¡Empieza a construir tu futuro!</p></div>';
        return;
    }
    
    lista.innerHTML = metas.map(meta => `
        <div class="item priority-${meta.prioridad} ${meta.completada ? 'completada' : ''}">
            <div class="item-content">
                <h4>${meta.titulo} ${meta.completada ? '✅' : ''}</h4>
                <p>${meta.descripcion}</p>
                <p style="font-size: 0.85em; margin-top: 5px;">📅 Fecha límite: ${meta.fecha}</p>
                ${meta.completada ? '<p style="font-size: 0.85em; margin-top: 5px; color: #28a745;">✅ Completada</p>' : ''}
            </div>
            <div class="item-actions">
                ${!meta.completada ? `<button class="complete-btn" onclick="marcarMetaCompletada(${meta.id})">Completar</button>` : ''}
                <button class="delete-btn" onclick="eliminarMeta(${meta.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function actualizarEmociones() {
    const lista = document.getElementById('lista-emociones');
    
    if (emociones.length === 0) {
        lista.innerHTML = '<div class="empty-state"><p>No has registrado emociones aún. ¡Empieza tu diario emocional!</p></div>';
        return;
    }
    
    lista.innerHTML = emociones.map(emocion => `
        <div class="item">
            <div class="item-content">
                <span class="emotion-badge emotion-${emocion.tipo}">${obtenerEmojiEmocion(emocion.tipo)} ${emocion.tipo.charAt(0).toUpperCase() + emocion.tipo.slice(1)}</span>
                <p style="margin-top: 10px;">${emocion.descripcion}</p>
                <p style="font-size: 0.85em; margin-top: 5px;">🕐 ${emocion.fecha} - ${emocion.hora}</p>
            </div>
            <button class="delete-btn" onclick="eliminarEmocion(${emocion.id})">Eliminar</button>
        </div>
    `).join('');
}

function actualizarVistaProyecto() {
    const vista = document.getElementById('vista-proyecto');
    if (!vista) return;
    
    if (!proyectoVida.vision && !proyectoVida.objetivos && !proyectoVida.fortalezas) {
        vista.innerHTML = '<div class="empty-state"><p>No has escrito tu proyecto de vida aún. ¡Comienza a construir tu futuro!</p></div>';
        return;
    }
    
    vista.innerHTML = `
        <div class="project-content">
            ${proyectoVida.vision ? `
                <div class="project-section">
                    <h4>🎯 Mi Visión Personal</h4>
                    <p>${proyectoVida.vision}</p>
                </div>
            ` : ''}
            ${proyectoVida.objetivos ? `
                <div class="project-section">
                    <h4>🎯 Mis Objetivos a Largo Plazo</h4>
                    <p>${proyectoVida.objetivos}</p>
                </div>
            ` : ''}
            ${proyectoVida.fortalezas ? `
                <div class="project-section">
                    <h4>💪 Mis Fortalezas y Talentos</h4>
                    <p>${proyectoVida.fortalezas}</p>
                </div>
            ` : ''}
            ${proyectoVida.valores ? `
                <div class="project-section">
                    <h4>🎯 Mis Valores Fundamentales</h4>
                    <p>${proyectoVida.valores}</p>
                </div>
            ` : ''}
            ${proyectoVida.plan ? `
                <div class="project-section">
                    <h4>🚀 Mi Plan de Acción</h4>
                    <p>${proyectoVida.plan}</p>
                </div>
            ` : ''}
            ${proyectoVida.progreso ? `
                <div class="project-section">
                    <h4>📊 Mi Progreso y Reflexiones</h4>
                    <p>${proyectoVida.progreso}</p>
                </div>
            ` : ''}
            ${proyectoVida.fechaActualizacion ? `
                <div class="project-meta">
                    <small>Última actualización: ${proyectoVida.fechaActualizacion}</small>
                </div>
            ` : ''}
        </div>
    `;
}

function actualizarObjetivosSMART() {
    const lista = document.getElementById('objetivos-smart');
    if (!lista) return;
    
    if (objetivosSMART.length === 0) {
        lista.innerHTML = '<div class="empty-state"><p>No tienes objetivos SMART creados aún. ¡Define tus objetivos de manera específica y medible!</p></div>';
        return;
    }
    
    lista.innerHTML = objetivosSMART.map(objetivo => `
        <div class="smart-item ${objetivo.completado ? 'completado' : ''}">
            <div class="smart-content">
                <h4>${objetivo.texto} ${objetivo.completado ? '✅' : ''}</h4>
                <p><strong>Medible:</strong> ${objetivo.medible}</p>
                <p><strong>Fecha límite:</strong> ${objetivo.fecha}</p>
                ${objetivo.completado ? '<p class="completado-text">✅ Objetivo completado</p>' : ''}
            </div>
            <div class="smart-actions">
                ${!objetivo.completado ? `<button class="complete-btn" onclick="completarObjetivoSMART(${objetivo.id})">Completar</button>` : ''}
                <button class="delete-btn" onclick="eliminarObjetivoSMART(${objetivo.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function actualizarInicio() {
    document.getElementById('total-metas').textContent = metas.length;
    document.getElementById('total-emociones').textContent = emociones.length;
    document.getElementById('metas-completadas').textContent = metas.filter(m => m.completada).length;
    
    // Calcular progreso del proyecto
    const camposProyecto = [proyectoVida.vision, proyectoVida.objetivos, proyectoVida.fortalezas, proyectoVida.valores, proyectoVida.plan, proyectoVida.progreso];
    const camposCompletados = camposProyecto.filter(campo => campo && campo.trim() !== '').length;
    const progresoPorcentaje = Math.round((camposCompletados / camposProyecto.length) * 100);
    document.getElementById('progreso-proyecto').textContent = progresoPorcentaje + '%';
    
    // Últimas 3 metas
    const resumenMetas = document.getElementById('resumen-metas');
    const ultimasMetas = metas.slice(-3).reverse();
    
    if (ultimasMetas.length === 0) {
        resumenMetas.innerHTML = '<div class="empty-state"><p>No hay metas registradas</p></div>';
    } else {
        resumenMetas.innerHTML = ultimasMetas.map(meta => `
            <div class="item priority-${meta.prioridad}">
                <div class="item-content">
                    <h4>${meta.titulo}</h4>
                    <p>${meta.descripcion.substring(0, 100)}...</p>
                </div>
            </div>
        `).join('');
    }
    
    // Últimas 3 emociones
    const resumenEmociones = document.getElementById('resumen-emociones');
    const ultimasEmociones = emociones.slice(-3).reverse();
    
    if (ultimasEmociones.length === 0) {
        resumenEmociones.innerHTML = '<div class="empty-state"><p>No hay emociones registradas</p></div>';
    } else {
        resumenEmociones.innerHTML = ultimasEmociones.map(emocion => `
            <div class="item">
                <div class="item-content">
                    <span class="emotion-badge emotion-${emocion.tipo}">${obtenerEmojiEmocion(emocion.tipo)} ${emocion.tipo.charAt(0).toUpperCase() + emocion.tipo.slice(1)}</span>
                    <p style="margin-top: 10px;">${emocion.descripcion.substring(0, 100)}...</p>
                </div>
            </div>
        `).join('');
    }
    
    // Resumen del proyecto en la página principal
    const resumenProyecto = document.getElementById('resumen-proyecto');
    if (resumenProyecto) {
        if (!proyectoVida.vision && !proyectoVida.objetivos) {
            resumenProyecto.innerHTML = '<div class="empty-state"><p>No has comenzado tu proyecto de vida aún. ¡Ve a la sección "Mi Proyecto" para empezar!</p></div>';
        } else {
            resumenProyecto.innerHTML = `
                <div class="project-summary-card">
                    ${proyectoVida.vision ? `
                        <div class="summary-section">
                            <h4>🎯 Mi Visión</h4>
                            <p>${proyectoVida.vision.substring(0, 150)}${proyectoVida.vision.length > 150 ? '...' : ''}</p>
                        </div>
                    ` : ''}
                    ${proyectoVida.objetivos ? `
                        <div class="summary-section">
                            <h4>🎯 Mis Objetivos</h4>
                            <p>${proyectoVida.objetivos.substring(0, 150)}${proyectoVida.objetivos.length > 150 ? '...' : ''}</p>
                        </div>
                    ` : ''}
                    <div class="summary-meta">
                        <small>Progreso: ${Math.round((camposCompletados / camposProyecto.length) * 100)}% • Última actualización: ${proyectoVida.fechaActualizacion || 'Nunca'}</small>
                    </div>
                </div>
            `;
        }
    }
}

function marcarMetaCompletada(id) {
    const meta = metas.find(m => m.id === id);
    if (meta) {
        meta.completada = true;
        guardarMetas(); // Guardar cambios en localStorage
        actualizarMetas();
        actualizarInicio();
    }
}

function eliminarMeta(id) {
    metas = metas.filter(m => m.id !== id);
    guardarMetas(); // Guardar cambios en localStorage
    actualizarMetas();
    actualizarInicio();
}

function eliminarEmocion(id) {
    emociones = emociones.filter(e => e.id !== id);
    guardarEmociones(); // Guardar cambios en localStorage
    actualizarEmociones();
    actualizarInicio();
}

function completarObjetivoSMART(id) {
    const objetivo = objetivosSMART.find(o => o.id === id);
    if (objetivo) {
        objetivo.completado = true;
        guardarObjetivosSMART();
        actualizarObjetivosSMART();
        actualizarInicio();
        mostrarNotificacion('🎉 ¡Objetivo SMART completado!', 'success');
    }
}

function eliminarObjetivoSMART(id) {
    objetivosSMART = objetivosSMART.filter(o => o.id !== id);
    guardarObjetivosSMART();
    actualizarObjetivosSMART();
    actualizarInicio();
}

function obtenerEmojiEmocion(tipo) {
    const emojis = {
        feliz: '😊',
        motivado: '💪',
        ansioso: '😰',
        tranquilo: '😌',
        triste: '😢'
    };
    return emojis[tipo] || '😊';
}

// Funciones de exportar/importar
function exportarProyecto() {
    const datosCompletos = {
        proyectoVida,
        objetivosSMART,
        metas,
        emociones,
        cancionesRecientes,
        fechaExportacion: new Date().toISOString()
    };
    
    const datosJSON = JSON.stringify(datosCompletos, null, 2);
    const blob = new Blob([datosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `proyecto-vida-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarNotificacion('📤 Proyecto exportado exitosamente', 'success');
}

function importarProyecto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const datos = JSON.parse(e.target.result);
                
                if (datos.proyectoVida) proyectoVida = datos.proyectoVida;
                if (datos.objetivosSMART) objetivosSMART = datos.objetivosSMART;
                if (datos.metas) metas = datos.metas;
                if (datos.emociones) emociones = datos.emociones;
                if (datos.cancionesRecientes) cancionesRecientes = datos.cancionesRecientes;
                
                // Guardar en localStorage
                guardarProyecto();
                guardarObjetivosSMART();
                guardarMetas();
                guardarEmociones();
                guardarCancionesRecientes();
                
                // Actualizar interfaz
                actualizarVistaProyecto();
                actualizarObjetivosSMART();
                actualizarMetas();
                actualizarEmociones();
                actualizarInicio();
                
                // Cargar datos en formularios
                if (proyectoVida.vision) document.getElementById('proyecto-vision').value = proyectoVida.vision;
                if (proyectoVida.objetivos) document.getElementById('proyecto-objetivos').value = proyectoVida.objetivos;
                if (proyectoVida.fortalezas) document.getElementById('proyecto-fortalezas').value = proyectoVida.fortalezas;
                if (proyectoVida.valores) document.getElementById('proyecto-valores').value = proyectoVida.valores;
                if (proyectoVida.plan) document.getElementById('proyecto-plan').value = proyectoVida.plan;
                if (proyectoVida.progreso) document.getElementById('proyecto-progreso').value = proyectoVida.progreso;
                
                mostrarNotificacion('📥 Proyecto importado exitosamente', 'success');
            } catch (error) {
                mostrarNotificacion('❌ Error al importar el archivo', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 100);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// ==================== FUNCIONES PARA PELÍCULA MENTAL ====================

// Configurar funcionalidad de carga de imágenes
function configurarCargaImagenes() {
    const uploadArea = document.getElementById('image-upload-area');
    const imageInput = document.getElementById('image-input');
    const durationSlider = document.getElementById('image-duration');
    const durationValue = document.getElementById('duration-value');
    
    // Drag and drop
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            imageInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            procesarArchivosImagenes(files);
        });
    }
    
    // Input de archivos
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            procesarArchivosImagenes(files);
        });
    }
    
    // Slider de duración
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', (e) => {
            durationValue.textContent = `${e.target.value} segundos`;
        });
    }
}

// Procesar archivos de imágenes
function procesarArchivosImagenes(files) {
    const archivosValidos = files.filter(file => {
        const esImagen = file.type.startsWith('image/');
        const tamanoValido = file.size <= 10 * 1024 * 1024; // 10MB
        
        if (!esImagen) {
            mostrarNotificacion(`❌ ${file.name} no es una imagen válida`, 'error');
            return false;
        }
        
        if (!tamanoValido) {
            mostrarNotificacion(`❌ ${file.name} es demasiado grande (máx. 10MB)`, 'error');
            return false;
        }
        
        return true;
    });
    
    archivosValidos.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imagen = {
                id: Date.now() + Math.random(),
                nombre: file.name,
                url: e.target.result,
                archivo: file
            };
            
            imagenesCargadas.push(imagen);
            actualizarGaleriaImagenes();
            mostrarNotificacion(`📸 ${file.name} agregada`, 'success');
        };
        reader.readAsDataURL(file);
    });
}

// Actualizar galería de imágenes
function actualizarGaleriaImagenes() {
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (!galleryGrid) return;
    
    if (imagenesCargadas.length === 0) {
        galleryGrid.innerHTML = `
            <div class="empty-gallery">
                <p>No hay imágenes cargadas aún</p>
                <small>Agrega imágenes para crear tu película mental</small>
            </div>
        `;
        return;
    }
    
    const html = imagenesCargadas.map(imagen => `
        <div class="image-item" data-id="${imagen.id}">
            <img src="${imagen.url}" alt="${imagen.nombre}">
            <div class="image-overlay">
                <button class="remove-image-btn" onclick="eliminarImagen('${imagen.id}')">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
    
    galleryGrid.innerHTML = html;
}

// Eliminar imagen de la galería
function eliminarImagen(id) {
    imagenesCargadas = imagenesCargadas.filter(img => img.id !== id);
    actualizarGaleriaImagenes();
    mostrarNotificacion('🗑️ Imagen eliminada', 'info');
}

// Limpiar todas las imágenes
function limpiarImagenes() {
    imagenesCargadas = [];
    actualizarGaleriaImagenes();
    mostrarNotificacion('🗑️ Todas las imágenes eliminadas', 'info');
}

// Crear película mental
function crearPeliculaMental() {
    if (imagenesCargadas.length === 0) {
        mostrarNotificacion('❌ Necesitas cargar al menos una imagen', 'error');
        return;
    }
    
    const titulo = document.getElementById('movie-title').value || 'Mi Película Mental';
    const duracion = parseInt(document.getElementById('image-duration').value);
    const transicion = document.getElementById('transition-type').value;
    
    peliculaActual = {
        titulo: titulo,
        imagenes: [...imagenesCargadas],
        duracionPorImagen: duracion,
        tipoTransicion: transicion,
        duracionTotal: imagenesCargadas.length * duracion,
        fechaCreacion: new Date().toISOString()
    };
    
    mostrarReproductorPelicula();
    mostrarNotificacion('🎬 ¡Película mental creada exitosamente!', 'success');
}

// Mostrar reproductor de película
function mostrarReproductorPelicula() {
    const moviePlayer = document.getElementById('movie-player');
    const movieTitleDisplay = document.getElementById('movie-title-display');
    
    if (moviePlayer && peliculaActual) {
        moviePlayer.style.display = 'block';
        movieTitleDisplay.textContent = peliculaActual.titulo;
        
        // Scroll suave hacia el reproductor
        moviePlayer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Vista previa de la película
function previewPelicula() {
    if (imagenesCargadas.length === 0) {
        mostrarNotificacion('❌ Necesitas cargar al menos una imagen', 'error');
        return;
    }
    
    mostrarNotificacion('👁️ Iniciando vista previa...', 'info');
    
    // Crear una película temporal para vista previa
    const peliculaPreview = {
        titulo: 'Vista Previa',
        imagenes: [...imagenesCargadas],
        duracionPorImagen: 2, // Más rápida para vista previa
        tipoTransicion: document.getElementById('transition-type').value,
        duracionTotal: imagenesCargadas.length * 2
    };
    
    peliculaActual = peliculaPreview;
    mostrarReproductorPelicula();
    
    // Iniciar reproducción automática
    setTimeout(() => {
        reproducirPelicula();
    }, 1000);
}

// Reproducir película
function reproducirPelicula() {
    if (!peliculaActual || peliculaActual.imagenes.length === 0) {
        mostrarNotificacion('❌ No hay película para reproducir', 'error');
        return;
    }
    
    reproduciendoPelicula = true;
    indiceImagenActual = 0;
    
    // Actualizar botón de reproducción
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.innerHTML = '⏸️ Pausar';
    }
    
    // Mostrar primera imagen
    mostrarImagenActual();
    
    // Iniciar intervalo de reproducción
    intervaloReproduccion = setInterval(() => {
        siguienteImagen();
    }, peliculaActual.duracionPorImagen * 1000);
    
    mostrarNotificacion('▶️ Reproduciendo película mental', 'success');
}

// Mostrar imagen actual
function mostrarImagenActual() {
    const movieScreen = document.getElementById('movie-screen');
    const progressFill = document.getElementById('progress-fill');
    const timeDisplay = document.getElementById('time-display');
    
    if (!movieScreen || !peliculaActual) return;
    
    const imagenActual = peliculaActual.imagenes[indiceImagenActual];
    
    // Crear elemento de imagen
    const imgElement = document.createElement('img');
    imgElement.src = imagenActual.url;
    imgElement.alt = imagenActual.nombre;
    
    // Aplicar clase de transición
    imgElement.className = `transition-${peliculaActual.tipoTransicion}`;
    
    // Limpiar pantalla y agregar nueva imagen
    movieScreen.innerHTML = `
        <div class="movie-overlay">
            <div class="movie-title-display">${peliculaActual.titulo}</div>
            <div class="movie-progress"></div>
        </div>
    `;
    movieScreen.appendChild(imgElement);
    
    // Actualizar progreso
    const progreso = ((indiceImagenActual + 1) / peliculaActual.imagenes.length) * 100;
    if (progressFill) {
        progressFill.style.width = `${progreso}%`;
    }
    
    // Actualizar tiempo
    const tiempoActual = (indiceImagenActual + 1) * peliculaActual.duracionPorImagen;
    const tiempoTotal = peliculaActual.duracionTotal;
    if (timeDisplay) {
        timeDisplay.textContent = `${formatearTiempo(tiempoActual)} / ${formatearTiempo(tiempoTotal)}`;
    }
}

// Siguiente imagen
function siguienteImagen() {
    if (!peliculaActual) return;
    
    indiceImagenActual++;
    
    if (indiceImagenActual >= peliculaActual.imagenes.length) {
        // Película terminada
        detenerPelicula();
        mostrarNotificacion('🎬 ¡Película completada!', 'success');
        return;
    }
    
    mostrarImagenActual();
}

// Alternar reproducción/pausa
function togglePlayPause() {
    if (reproduciendoPelicula) {
        pausarPelicula();
    } else {
        reproducirPelicula();
    }
}

// Pausar película
function pausarPelicula() {
    reproduciendoPelicula = false;
    
    if (intervaloReproduccion) {
        clearInterval(intervaloReproduccion);
        intervaloReproduccion = null;
    }
    
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.innerHTML = '▶️ Reproducir';
    }
    
    mostrarNotificacion('⏸️ Película pausada', 'info');
}

// Detener película
function detenerPelicula() {
    reproduciendoPelicula = false;
    indiceImagenActual = 0;
    
    if (intervaloReproduccion) {
        clearInterval(intervaloReproduccion);
        intervaloReproduccion = null;
    }
    
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.innerHTML = '▶️ Reproducir';
    }
    
    // Limpiar pantalla
    const movieScreen = document.getElementById('movie-screen');
    if (movieScreen) {
        movieScreen.innerHTML = `
            <div class="movie-overlay">
                <div class="movie-title-display">${peliculaActual ? peliculaActual.titulo : 'Película Mental'}</div>
                <div class="movie-progress"></div>
            </div>
        `;
    }
    
    // Resetear progreso
    const progressFill = document.getElementById('progress-fill');
    const timeDisplay = document.getElementById('time-display');
    
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    
    if (timeDisplay && peliculaActual) {
        timeDisplay.textContent = `0:00 / ${formatearTiempo(peliculaActual.duracionTotal)}`;
    }
    
    mostrarNotificacion('⏹️ Película detenida', 'info');
}

// Formatear tiempo
function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = Math.floor(segundos % 60);
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
}


// Inicializar aplicación
function inicializarApp() {
    // Cargar datos desde localStorage
    cargarMetas();
    cargarEmociones();
    cargarProyecto();
    cargarObjetivosSMART();
    cargarCancionesRecientes();
    
    // Cargar datos en formularios si existen
    if (proyectoVida.vision) document.getElementById('proyecto-vision').value = proyectoVida.vision;
    if (proyectoVida.objetivos) document.getElementById('proyecto-objetivos').value = proyectoVida.objetivos;
    if (proyectoVida.fortalezas) document.getElementById('proyecto-fortalezas').value = proyectoVida.fortalezas;
    if (proyectoVida.valores) document.getElementById('proyecto-valores').value = proyectoVida.valores;
    if (proyectoVida.plan) document.getElementById('proyecto-plan').value = proyectoVida.plan;
    if (proyectoVida.progreso) document.getElementById('proyecto-progreso').value = proyectoVida.progreso;
    
    // Configurar funcionalidad de música
    configurarMusica();
    
    // Configurar funcionalidad de película mental
    configurarCargaImagenes();
    
    // Actualizar la interfaz con los datos cargados
    actualizarMetas();
    actualizarEmociones();
    actualizarVistaProyecto();
    actualizarObjetivosSMART();
    actualizarInicio();
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', inicializarApp);