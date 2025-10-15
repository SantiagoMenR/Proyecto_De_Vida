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
                
                // Guardar en localStorage
                guardarProyecto();
                guardarObjetivosSMART();
                guardarMetas();
                guardarEmociones();
                
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

// Inicializar aplicación
function inicializarApp() {
    // Cargar datos desde localStorage
    cargarMetas();
    cargarEmociones();
    cargarProyecto();
    cargarObjetivosSMART();
    
    // Cargar datos en formularios si existen
    if (proyectoVida.vision) document.getElementById('proyecto-vision').value = proyectoVida.vision;
    if (proyectoVida.objetivos) document.getElementById('proyecto-objetivos').value = proyectoVida.objetivos;
    if (proyectoVida.fortalezas) document.getElementById('proyecto-fortalezas').value = proyectoVida.fortalezas;
    if (proyectoVida.valores) document.getElementById('proyecto-valores').value = proyectoVida.valores;
    if (proyectoVida.plan) document.getElementById('proyecto-plan').value = proyectoVida.plan;
    if (proyectoVida.progreso) document.getElementById('proyecto-progreso').value = proyectoVida.progreso;
    
    // Actualizar la interfaz con los datos cargados
    actualizarMetas();
    actualizarEmociones();
    actualizarVistaProyecto();
    actualizarObjetivosSMART();
    actualizarInicio();
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', inicializarApp);