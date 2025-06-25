// ===== VARIABLES GLOBALES MEJORADAS =====
let allRawData = [];
let currentFilteredData = [];
let currentEvolutionData = []; 
let charts = {};
let previousStats = null;
let currentTheme = localStorage.getItem('theme') || 'light';
let sidebarOpen = false;
let currentSubcontractData = [];
let currentSubcontractName = '';
let currentTab = 'overview';
let currentMainTab = 'dashboard';
let detailsPage = 1;
let detailsPerPage = 494;

// ===== CONSTANTES =====
const requiredFields = ['ID', 'ID_Corregido', 'Documento', 'Estado', 'Elaborador', 'Revisor', 'Coordinador', 'FechaReporte', 'Semana', 'Tematica', 'Item'];

const ESTADO_ORDER = [
    'En elaboración',
    'En elaboración cartografía',
    'Subcontrato',
    'En revisor técnico',
    'En coordinador',
    'En revisor editorial',
    'Incorporada'
];

const estadoColores = {
    'En elaboración': '#E76F51',
    'En elaboración cartografía': '#FFCA3A',
    'En revisor técnico': '#43AA8B',
    'En coordinador': '#577590',
    'En revisor editorial': '#B56576',
    'Incorporada': '#90BE6D',
    'default': '#9CA3AF'
};

const estadoFuenteColores = {
    'En elaboración': '#FFFFFF',
    'En elaboración de cartografía': '#000000',
    'En revisor técnico': '#FFFFFF',
    'En coordinador': '#FFFFFF',
    'En revisor editorial': '#FFFFFF',
    'Incorporada': '#000000',
    'default': '#FFFFFF'
};

const predefinedPeople = [
    "Nicolas Ibañez", "Oscar Perez", "Eduardo Elgueta", "Tomás Fernández", 
    "Sofia Ramos Basulto", "Felipe Lobo", "Marcelo Araya", "Chi-le Sun", 
    "Gloria Arriagada", "Vivian Hernandez"
];

const predefinedSubcontracts = [
    "SEDNA - Arqueología", "FISIOAQUA - Medio marino", "ECODIVERSIDAD - Chinchilla",
    "EIS AMBIENTAL - Medio humano", "CELAB - Infiltraciones PAS 138", 
    "PAISAJE AMBIENTAL - Paisaje", "HUGO DÍAZ - Microrruteo y avifauna",
    "ECOTECNOS - Modelación pluma salina", "RUIDO AMBIENTAL - Ruido",
    "CRAMSA-ECOS"
];

const predefinedTematicas = [
    "Descripción proyecto", "Medio marino", "Hidro", "Calidad aire, emisiones",
    "Fauna", "Misceláneas", "Arqueología", "Turismo, paisaje", "Medio humano",
    "GGP", "Flora y vegetación", "Flora, fauna, Ecosistemas Marinos", "Luminosidad", "PAS (DP)", "Ruido y vibraciones",
    "Flora, fauna", "Suelos"
];

const predefinedItems = {
    "01. Descripción Proyecto": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/01%20%C3%8DTEM%2001_25.docx?d=wa1498256a7bc48a4a281a6e046e8de15&csf=1&web=1&e=xlt7LU",
    "02. Determinación y justificación del área de influencia (AI) del proyecto o actividad": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/02%20%C3%8DTEM%2002_25.docx?d=w36a8d1c2aa804313935a973c5d630edc&csf=1&web=1&e=dPdlf8",
    "03. Línea de Base (LDB)": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/03%20%C3%8DTEM%2003_25.docx?d=w0a4e5eb2c93444709fc734bacdf9e493&csf=1&web=1&e=ymba5u",
    "04. Normativa Ambiental Aplicable": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/04%20%C3%8DTEM%2004_25.docx?d=w096542e0ca59476993983599714a6997&csf=1&web=1&e=WPsMek",
    "05. Permisos Ambientales Sectoriales.": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/05%20%C3%8DTEM%2005_25.docx?d=wf630e909fcbc4535830858e4a693d0fa&csf=1&web=1&e=uUApZR",
    "06. Efectos, características o circunstancias del Artículo 11 de la Ley que dan origen a la necesidad de efectuar un EIA.": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/06%20%C3%8DTEM%2006_25.docx?d=we055ec9a60fd4b52830ea53cfd0a48d3&csf=1&web=1&e=K4uqbN",
    "07. Predicción y evaluación del impacto ambiental del proyecto o actividad": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/07%20%C3%8DTEM%2007_25.docx?d=w95284611e737418880042791b23be25c&csf=1&web=1&e=cnAXeT",
    "08. Plan de medidas de mitigación, reparación y compensación": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/08%20%C3%8DTEM%2008_25.docx?d=wd7a46e13f7084516be20ae39856557e0&csf=1&web=1&e=n95Vwe",
    "09. Plan de prevención de contingencias y de emergencias": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/09%20%C3%8DTEM%2009_25.docx?d=we2467fe92e1947ddbadfc68f5f878258&csf=1&web=1&e=8ECCF3",
    "10. Plan de seguimiento de las variables ambientales relevantes": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/10%20%C3%8DTEM%2010_25.docx?d=w9dd6e59d58be42198c357a7450d8bd3d&csf=1&web=1&e=9Gf4QY",
    "11. Ficha resumen para cada fase del proyecto o actividad": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/11%20%C3%8DTEM%2011_25.docx?d=wd120f9437c504deeb7e413f2c66528b3&csf=1&web=1&e=xuJCI6",
    "12. Relación con las políticas, planes y programas de desarrollo regional": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/12%20%C3%8DTEM%2012_25.docx?d=wcc415c6c6db543c6ac6261d84844d0f3&csf=1&web=1&e=P6ZOzk",
    "13. Compromisos ambientales voluntarios": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/13%20%C3%8DTEM%2013_25.docx?d=wfcf82136aeb0452db8306d000ca530da&csf=1&web=1&e=MQWwDK",
    "14. Otras Consideraciones Relacionadas con el Proceso de Evaluación de Impacto Ambiental del Proyecto": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/14%20%C3%8DTEM%2014_25.docx?d=we47c246bee6844cea0a665ffc1857216&csf=1&web=1&e=CBsMdm",
    "15. Participación Ciudadana": "https://cramsacl.sharepoint.com/:w:/r/sites/ConsultoresCramsa/adc2025/ADC2025/15%20%C3%8DTEM%2015_25.docx?d=w3ef27d33bed646e0a6c062c481394def&csf=1&web=1&e=9zwM8L",
    "Anexo PAC ADC": "https://cramsacl.sharepoint.com/sites/ConsultoresCramsa/adc2025/ADCPAC2025/Forms/AllItems.aspx"
};

// ===== REFERENCIAS DOM MEJORADAS =====
const dom = {
    // Contenedores principales
    analysisContainer: document.getElementById('analysisContainer'),
    subcontractView: document.getElementById('subcontractView'),
    subcontractProgressContainer: document.getElementById('subcontractProgressContainer'),
    noDataMessage: document.getElementById('noDataMessage'),
    
    // Controles
    fileInput: document.getElementById('fileInput'),
    fileNameDisplay: document.getElementById('fileNameDisplay'),
    weekSelect: document.getElementById('weekSelect'),
    daySelect: document.getElementById('daySelect'),
    tematicaSelect: document.getElementById('tematicaSelect'),
    itemSelect: document.getElementById('itemSelect'),
    personSelect: document.getElementById('personSelect'),
    stateSelect: document.getElementById('stateSelect'),
    subcontractSelect: document.getElementById('subcontractSelect'),
    
    // Indicadores
    loadingIndicator: document.getElementById('loadingIndicator'),
    alertBox: document.getElementById('alertBox'),
    globalLoader: document.getElementById('globalLoader'),
    
    // Estadísticas header
    headerTotalItems: document.getElementById('headerTotalItems'),
    headerIncorporated: document.getElementById('headerIncorporated'),
    headerEditorial: document.getElementById('headerEditorial'),
    
    // Modales
    questionsModal: document.getElementById('questionsModal'),
    modalTitle: document.getElementById('modalTitle'),
    questionsList: document.getElementById('questionsList'),
    modalOverflowNote: document.getElementById('modalOverflowNote'),
    
    // Estadísticas
    totalItems: document.getElementById('totalItems'),
    totalADC: document.getElementById('totalADC'),
    totalPAC: document.getElementById('totalPAC'),
    totalItemsPrev: document.getElementById('totalItemsPrev'),
    totalADCPrev: document.getElementById('totalADCPrev'),
    totalPACPrev: document.getElementById('totalPACPrev'),
    
    // Tablas de leyenda
    legendADCBody: document.getElementById('legendADC')?.querySelector('tbody'),
    legendPACBody: document.getElementById('legendPAC')?.querySelector('tbody'),
    legendTotalBody: document.getElementById('legendTotal')?.querySelector('tbody'),
    
    // Otros
    roleStats: document.getElementById('roleStats'),
    evolutionContainer: document.getElementById('evolutionContainer'),
    comparisonContainer: document.getElementById('comparisonContainer'),
    comparisonResults: document.getElementById('comparisonResults'),
    
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    toastContainer: document.getElementById('toastContainer')
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Configurar Chart.js
    Chart.register(ChartDataLabels);
    if (typeof chartjsPluginAnnotation !== 'undefined') {
        Chart.register(chartjsPluginAnnotation);
    } else if (window['chartjsPluginAnnotation']) {
        Chart.register(window['chartjsPluginAnnotation']);
    } else {
        console.warn('Chart.js Annotation plugin not found. Milestone will not be displayed.');
    }
    Chart.register(centerTextPlugin);

    // Aplicar tema guardado
    applyTheme(currentTheme);
    
    // Configurar eventos
    setupEventListeners();
    
    // Inicializar datos y filtros
    initializeDataAndFilters();

    // Forzar vista carrusel por defecto en gráficos de Distribución por Estado
    setTimeout(() => switchChartsView('carousel'), 0);
}

function setupEventListeners() {
    // Carga de archivos
    dom.fileInput.addEventListener('change', handleFileUpload);
    
    // Filtros
    [dom.weekSelect, dom.daySelect, dom.tematicaSelect, dom.itemSelect, 
     dom.personSelect, dom.stateSelect, dom.subcontractSelect].forEach(sel => 
        sel.addEventListener('change', applyAllFiltersAndAnalyze)
    );
    
    // Eventos de teclado para accesibilidad
    document.addEventListener('keydown', handleKeyboard);
    
    // Eventos para cerrar modales
    document.addEventListener('click', handleOutsideClick);
    
    // Resize para responsividad
    window.addEventListener('resize', handleResize);
}

// ===== FUNCIONES DE TEMA =====
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ===== FUNCIONES DE SIDEBAR =====
function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    dom.sidebar.classList.toggle('open', sidebarOpen);
    
    // Añadir overlay en mobile
    if (window.innerWidth <= 768) {
        if (sidebarOpen) {
            createOverlay();
        } else {
            removeOverlay();
        }
    }
}

function createOverlay() {
    const existing = document.querySelector('.sidebar-overlay');
    if (existing) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 90;
        backdrop-filter: blur(2px);
    `;
    overlay.addEventListener('click', toggleSidebar);
    document.body.appendChild(overlay);
}

function removeOverlay() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// ===== FUNCIONES DE NOTIFICACIONES =====
function showToast(message, type = 'info', duration = 2000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    dom.toastContainer.appendChild(toast);
    
    // Animación de entrada
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto-remove
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

function getToastIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function showAlert(message, type = 'info', duration = 5000) {
    if (!dom.alertBox) return;
    
    dom.alertBox.className = `alert alert-${type}`;
    dom.alertBox.innerHTML = `
        <i class="${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    dom.alertBox.classList.remove('hidden');
    
    if (duration > 0) {
        setTimeout(() => {
            dom.alertBox.classList.add('hidden');
        }, duration);
    }
}

// ===== MANEJO DE TECLADO =====
function handleKeyboard(event) {
    // ESC para cerrar modales
    if (event.key === 'Escape') {
        closeAllModals();
        if (sidebarOpen && window.innerWidth <= 768) {
            toggleSidebar();
        }
    }
    
    // Ctrl+S para guardar/exportar
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        exportToExcel();
    }
}

function handleOutsideClick(event) {
    // Cerrar modales si se hace click fuera
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
}

function handleResize() {
    // Cerrar sidebar en desktop
    if (window.innerWidth > 768 && sidebarOpen) {
        removeOverlay();
        sidebarOpen = false;
        dom.sidebar.classList.remove('open');
    }
}

// ===== GESTIÓN DE DATOS MEJORADA =====
function initializeDataAndFilters() {
    const storedData = localStorage.getItem('adcReportData_v3');
    allRawData = storedData ? JSON.parse(storedData) : [];
    
    // Ocultar indicador de carga por defecto
    if (dom.loadingIndicator) {
        dom.loadingIndicator.classList.add('hidden');
    }
    
    populateStaticSelectors();
    updateDynamicSelectors();
    
    if (allRawData.length > 0) {
        const weeks = [...new Set(allRawData.map(item => String(item.Semana)))].sort((a, b) => parseInt(b) - parseInt(a));
        dom.weekSelect.value = weeks.length > 0 ? weeks[0] : "all";
        updateDaySelectorForWeek(dom.weekSelect.value, true);
        applyAllFiltersAndAnalyze();
        dom.noDataMessage.classList.add('hidden');
    } else {
        disableFilterControls();
        dom.noDataMessage.classList.remove('hidden');
        dom.analysisContainer.classList.add('hidden');
        dom.subcontractView.classList.add('hidden');
    }
}

async function handleFileUpload(event) {
    const files = event.target.files;
    if (!files.length) {
        dom.fileNameDisplay.innerHTML = '<i class="fas fa-info-circle"></i><span>Ningún archivo seleccionado</span>';
        return;
    }

    // Mostrar loader global
    showGlobalLoader('Procesando archivos...');
    if (dom.loadingIndicator) {
        dom.loadingIndicator.classList.remove('hidden');
    }
    showAlert('Procesando archivos...', 'info', 0);
    
    const fileNames = Array.from(files).map(f => f.name);
    dom.fileNameDisplay.innerHTML = `
        <i class="fas fa-file-alt"></i>
        <span>${fileNames.length} archivo(s): ${fileNames.join(', ').substring(0, 60)}${fileNames.join(', ').length > 60 ? '...' : ''}</span>
    `;
    
    let newFilesProcessed = 0;
    let totalItemsAddedOrUpdated = 0;

    for (const file of files) {
        try {
            const fileContent = await readFileAsync(file);
            let jsonData = JSON.parse(fileContent);
            let dataToProcess = (jsonData.body && Array.isArray(jsonData.body)) ? 
                jsonData.body : (Array.isArray(jsonData) ? jsonData : null);
            
            if (!dataToProcess) {
                showToast(`Formato JSON no válido: ${file.name}`, 'error');
                continue;
            }
            
            if (dataToProcess.length === 0) continue;
            
            if (!dataToProcess.every(item => requiredFields.every(field => field in item))) {
                showToast(`Estructura JSON incorrecta: ${file.name}`, 'error');
                continue;
            }
            
            dataToProcess.forEach(newItem => {
                // Crear una clave única más robusta para evitar duplicados
                const uniqueKey = `${newItem.ID}_${newItem.Semana}_${newItem.FechaReporte}_${newItem.Item}_${newItem.Documento}`;
                
                const index = allRawData.findIndex(ex => {
                    const existingKey = `${ex.ID}_${ex.Semana}_${ex.FechaReporte}_${ex.Item}_${ex.Documento}`;
                    return existingKey === uniqueKey;
                });
                
                if (index === -1) {
                    // Nuevo item
                    allRawData.push(newItem);
                    totalItemsAddedOrUpdated++;
                } else {
                    // Actualizar item existente solo si hay cambios
                    const existing = allRawData[index];
                    const hasChanges = JSON.stringify(existing) !== JSON.stringify(newItem);
                    if (hasChanges) {
                        allRawData[index] = newItem; 
                        totalItemsAddedOrUpdated++;
                    }
                }
            });
            
            newFilesProcessed++;
        } catch (error) {
            showToast(`Error procesando ${file.name}: ${error.message}`, 'error');
        }
    }

    hideGlobalLoader();
    if (dom.loadingIndicator) {
        dom.loadingIndicator.classList.add('hidden');
    }
       if (dom.alertBox) {
        dom.alertBox.classList.add('hidden');
    }
    if (newFilesProcessed > 0) {
        localStorage.setItem('adcReportData_v3', JSON.stringify(allRawData));
        updateDynamicSelectors();
        
        const currentSelectedWeek = dom.weekSelect.value;
        const weeks = [...new Set(allRawData.map(item => String(item.Semana)))].sort((a, b) => parseInt(b) - parseInt(a));
        dom.weekSelect.value = weeks.includes(currentSelectedWeek) ? currentSelectedWeek : (weeks.length > 0 ? weeks[0] : "all");
        updateDaySelectorForWeek(dom.weekSelect.value, true);
        applyAllFiltersAndAnalyze();
        
        if (allRawData.length > 0) {
            dom.noDataMessage.classList.add('hidden');
        }
        
        showToast(`${newFilesProcessed} archivo(s) procesados. ${totalItemsAddedOrUpdated} items añadidos/actualizados.`, 'success');
    } else if (files.length > 0) {
        showAlert('No se procesaron nuevos datos válidos.', 'warning');
    }
    
    event.target.value = ''; 
}

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// ===== FUNCIONES DE FILTROS MEJORADAS =====
function populateStaticSelectors() {
    // Temáticas
    dom.tematicaSelect.innerHTML = `<option value="all">Todas las temáticas</option>`;
    predefinedTematicas.forEach(val => dom.tematicaSelect.add(new Option(val, val)));
    
    // Items
    dom.itemSelect.innerHTML = `<option value="all">Todos los ítems</option>`;
    Object.keys(predefinedItems).forEach(val => dom.itemSelect.add(new Option(val, val)));

    // Personas
    dom.personSelect.innerHTML = `<option value="all">Todas las personas</option>`;
    predefinedPeople.sort().forEach(val => dom.personSelect.add(new Option(val, val)));

    // Estados
    dom.stateSelect.innerHTML = `<option value="all">Todos los estados</option>`;
    Object.keys(estadoColores).filter(s => s !== 'default').sort().forEach(val => dom.stateSelect.add(new Option(val, val)));
    
    // Subcontratos
    dom.subcontractSelect.innerHTML = `<option value="all">Todos los subcontratos</option>`;
    predefinedSubcontracts.sort().forEach(val => dom.subcontractSelect.add(new Option(val, val)));
}

function updateDynamicSelectors() {
    const currentWeek = dom.weekSelect.value;
    dom.weekSelect.innerHTML = '';
    const weeks = [...new Set(allRawData.map(item => String(item.Semana)))].sort((a, b) => parseInt(b) - parseInt(a));
    
    dom.weekSelect.innerHTML = weeks.length === 0 ? 
        '<option value="">Cargue datos</option>' : 
        '<option value="all">Todas las semanas</option>';
    
    weeks.forEach(w => dom.weekSelect.add(new Option(`Semana ${w}`, w)));
    dom.weekSelect.value = weeks.includes(currentWeek) ? currentWeek : 
        (weeks.length > 0 && currentWeek !== "all" ? weeks[0] : "all");

    // Estados dinámicos
    const allStatesInData = [...new Set(allRawData.map(item => item.Estado))].sort();
    dom.stateSelect.innerHTML = `<option value="all">Todos los estados</option>`;
    allStatesInData.forEach(val => dom.stateSelect.add(new Option(val, val)));

    // Subcontratos dinámicos
    let subcontractsToShow = [];
    
    if (allRawData.length > 0) {
           const allDates = [...new Set(allRawData.map(item => item.FechaReporte))].sort();
        const latestDate = allDates[allDates.length - 1]; 
        const latestReportData = allRawData.filter(item => item.FechaReporte === latestDate);
        subcontractsToShow = [...new Set(latestReportData.map(item => item.Subcontrato).filter(Boolean))].sort();
        if (subcontractsToShow.length === 0) {
            console.warn("El último reporte no contiene subcontratos. Mostrando todos los históricos como fallback.");
            subcontractsToShow = [...new Set(allRawData.map(item => item.Subcontrato).filter(Boolean))].sort();
        }

    } else {
        // Si no hay datos, se usa la lista predefinida (opcional, pero buena práctica).
        subcontractsToShow = [...predefinedSubcontracts].sort();
    }

    // 5. Poblar el selector de Subcontratos con la lista determinada.
    dom.subcontractSelect.innerHTML = `<option value="all">Todos los subcontratos</option>`;
    subcontractsToShow.forEach(val => dom.subcontractSelect.add(new Option(val, val)));
}

function updateDaySelectorForWeek(selectedWeek, selectLastDate = false) {
    const currentDayVal = dom.daySelect.value;
    dom.daySelect.innerHTML = '';
    
    let relevantData = (selectedWeek === 'all' || selectedWeek === '') ? 
        allRawData : allRawData.filter(item => String(item.Semana) === selectedWeek);
    
    const dates = [...new Set(relevantData.map(item => item.FechaReporte))]
        .sort((a, b) => b.localeCompare(a)); 

    if (dates.length > 0) {
        dates.forEach(date => {
            const parts = date.split('-');
            const optionText = `${parts[2]}/${parts[1]}/${parts[0]}`; 
            dom.daySelect.add(new Option(optionText, date)); 
        });
        dom.daySelect.value = selectLastDate ? dates[0] : (dates.includes(currentDayVal) ? currentDayVal : dates[0]);
    } else {
        dom.daySelect.innerHTML = '<option value="">No hay fechas</option>';
    }
    
    dom.daySelect.disabled = selectedWeek === '' || dates.length === 0;
    [dom.tematicaSelect, dom.itemSelect, dom.personSelect, dom.stateSelect, dom.subcontractSelect].forEach(sel => sel.disabled = selectedWeek === '');
}

function clearAllFilters() {
    dom.weekSelect.value = 'all';
    dom.daySelect.value = '';
    dom.tematicaSelect.value = 'all';
    dom.itemSelect.value = 'all';
    dom.personSelect.value = 'all';
    dom.stateSelect.value = 'all';
    dom.subcontractSelect.value = 'all';
    
    updateDaySelectorForWeek(dom.weekSelect.value, true);
    applyAllFiltersAndAnalyze();
    showToast('Filtros eliminados', 'info');
}

function disableFilterControls(disable = true) {
    [dom.weekSelect, dom.daySelect, dom.tematicaSelect, dom.itemSelect, 
     dom.personSelect, dom.stateSelect, dom.subcontractSelect].forEach(sel => sel.disabled = disable);
}

// ===== ANÁLISIS Y FILTRADO =====
// Reemplaza la función completa con esta versión
function applyAllFiltersAndAnalyze() {
    // 1. Verificación inicial
    if (allRawData.length === 0) {
        clearDisplayElements();
        dom.analysisContainer.classList.add('hidden');
        dom.subcontractView.classList.add('hidden');
        dom.noDataMessage.classList.remove('hidden');
        disableFilterControls();
        return;
    }
    
    disableFilterControls(false);

    // 2. Guardar estado previo para comparaciones
    if (currentFilteredData.length > 0 && dom.totalItems.textContent !== '0') { 
        previousStats = {
            totalItems: parseInt(dom.totalItems.textContent),
            totalADC: parseInt(dom.totalADC.textContent),
            totalPAC: parseInt(dom.totalPAC.textContent),
            date: dom.daySelect.options[dom.daySelect.selectedIndex]?.text
        };
    } else {
        previousStats = null;
    }

    // 3. Obtener valores de los filtros
    const selWeek = dom.weekSelect.value;
    let selDay = dom.daySelect.value;
    const selTem = dom.tematicaSelect.value;
    const selItm = dom.itemSelect.value;
    const selPerson = dom.personSelect.value;
    const selState = dom.stateSelect.value;
    const selSubcontract = dom.subcontractSelect.value;
    
    if (this && this.id === 'weekSelect') {
        updateDaySelectorForWeek(selWeek, true);
        selDay = dom.daySelect.value; 
        previousStats = null; 
    }

    // 4. Filtrar datos para VISTAS PUNTUALES (Stats, Pie Charts) - Respeta la fecha
    currentFilteredData = allRawData.filter(item => 
        (selWeek === 'all' || String(item.Semana) === selWeek) &&
        (selDay === '' || !selDay || item.FechaReporte === selDay) &&
        (selTem === 'all' || item.Tematica === selTem) &&
        (selItm === 'all' || item.Item === selItm) &&
        (selState === 'all' || item.Estado === selState) &&
        (selSubcontract === 'all' || item.Subcontrato === selSubcontract) &&
        (selPerson === 'all' || item.Elaborador === selPerson || item.Revisor === selPerson || item.Coordinador === selPerson)
    );

    // 5. Filtrar datos para VISTA DE EVOLUCIÓN - Ignora la fecha
    currentEvolutionData = allRawData.filter(item =>
        // OMITIMOS los filtros de selWeek y selDay aquí
        (selTem === 'all' || item.Tematica === selTem) &&
        (selItm === 'all' || item.Item === selItm) &&
        (selState === 'all' || item.Estado === selState) &&
        (selSubcontract === 'all' || item.Subcontrato === selSubcontract) &&
        (selPerson === 'all' || item.Elaborador === selPerson || item.Revisor === selPerson || item.Coordinador === selPerson)
    );

    // 6. Lógica de renderizado de vistas
    if (selSubcontract !== 'all') {
        dom.analysisContainer.classList.add('hidden');
        dom.subcontractView.classList.remove('hidden');
        renderSubcontractView(currentFilteredData, selSubcontract);
    } else {
        dom.subcontractView.classList.add('hidden');
        dom.analysisContainer.classList.remove('hidden');
        if (currentFilteredData.length > 0) {
            dom.noDataMessage.classList.add('hidden');
            analyzeAndDisplayData(currentFilteredData);
        } else {
            clearDisplayElements();
            showAlert('No se encontraron items con los filtros seleccionados para la fecha.', 'warning');
        }
    }
    
    // 7. Actualizar siempre el gráfico de evolución y los stats del header
    // Usa los datos históricos y el filtro de ADC/PAC se aplicará dentro de la función.
    updateEvolutionChart(currentEvolutionData);
    updateHeaderStats();
}

function updateHeaderStats() {
    // Usar datos filtrados actuales en lugar de todos los datos
    const dataToUse = currentFilteredData.length > 0 ? currentFilteredData : allRawData;
    
    const total = dataToUse.length;
    const incorporated = dataToUse.filter(item => item.Estado === 'Incorporada').length;
    
    // CÁLCULO AÑADIDO
    const editorial = dataToUse.filter(item => item.Estado === 'En revisor editorial').length;
    
    if (dom.headerTotalItems) {
        animateNumber(dom.headerTotalItems, total);
    }
    if (dom.headerIncorporated) {
        animateNumber(dom.headerIncorporated, incorporated);
    }
    // ACTUALIZACIÓN DEL NUEVO ELEMENTO AÑADIDA
    if (dom.headerEditorial) {
        animateNumber(dom.headerEditorial, editorial);
    }
}

// ===== VISTA DE SUBCONTRATOS CON PESTAÑAS =====
function renderSubcontractView(data, subcontractName) {
    currentSubcontractData = data;
    currentSubcontractName = subcontractName;
    
    // Renderizar la pestaña activa
    switch(currentTab) {
        case 'overview':
            renderSubcontractOverview();
            break;
        case 'details':
            renderSubcontractDetails();
            break;
        case 'timeline':
            renderSubcontractTimeline();
            break;
    }
}

function renderSubcontractOverview() {
    const container = dom.subcontractProgressContainer;
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!currentSubcontractData || currentSubcontractData.length === 0) {
        container.innerHTML = `
            <div class="no-data-state">
                <div class="no-data-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>Sin datos para subcontrato</h3>
                <p>No hay items para el subcontrato '${currentSubcontractName}' con los filtros actuales.</p>
            </div>
        `;
        return;
    }

    const totalItems = currentSubcontractData.length;
    const stateCounts = currentSubcontractData.reduce((acc, item) => {
        acc[item.Estado] = (acc[item.Estado] || 0) + 1;
        return acc;
    }, {});

    const sortedStates = Object.keys(stateCounts).sort((a, b) => {
        const indexA = ESTADO_ORDER.indexOf(a);
        const indexB = ESTADO_ORDER.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    let progressBarHtml = '<div class="progress-bar-container" style="display: flex; height: 40px; border-radius: 8px; overflow: hidden; margin-bottom: 20px; box-shadow: var(--shadow-sm);">';
    let legendHtml = '<div class="progress-legend" style="display: grid; gap: 12px; margin-bottom: 20px;">';

    sortedStates.forEach(state => {
        const count = stateCounts[state];
        const percentage = (count / totalItems * 100);
        const bgColor = estadoColores[state] || estadoColores.default;
        const fontColor = estadoFuenteColores[state] || estadoFuenteColores.default;

        progressBarHtml += `
            <div class="progress-bar-segment" style="
                width: ${percentage}%; 
                background-color: ${bgColor}; 
                color: ${fontColor};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: 600;
                transition: all 0.3s ease;
                cursor: pointer;
            " title="${state}: ${count} (${percentage.toFixed(1)}%)" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                ${percentage > 10 ? `<span>${percentage.toFixed(0)}%</span>` : ''}
            </div>`;

        legendHtml += `
            <div class="legend-item" style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: var(--bg-secondary);
                border-radius: 8px;
                border: 1px solid var(--border-color);
                transition: all 0.2s ease;
            " onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
                <div class="color-box" style="
                    width: 16px;
                    height: 16px;
                    background-color: ${bgColor};
                    border-radius: 4px;
                    flex-shrink: 0;
                "></div>
                <span style="color: var(--text-primary); font-weight: 500;">${state}: <strong>${count}</strong> (${percentage.toFixed(1)}%)</span>
            </div>`;
    });

    progressBarHtml += '</div>';
    legendHtml += '</div>';
    
    const totalSummary = `
        <div style="
            margin-top: 20px; 
            padding: 20px;
            background: var(--bg-secondary);
            border-radius: 12px;
            border: 1px solid var(--border-color);
        ">
            <h3 style="font-size: 1.2rem; margin-bottom: 8px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-chart-bar" style="color: var(--primary-500);"></i>
                Resumen para: ${currentSubcontractName}
            </h3>
            <p style="font-size: 1rem; color: var(--text-secondary);"><strong>Total de items:</strong> ${totalItems}</p>
        </div>
    `;

    container.innerHTML = progressBarHtml + legendHtml + totalSummary;
}

function renderSubcontractDetails() {
    const container = document.getElementById('subcontractDetailsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!currentSubcontractData || currentSubcontractData.length === 0) {
        container.innerHTML = `
            <div class="no-data-state">
                <div class="no-data-icon">
                    <i class="fas fa-list-alt"></i>
                </div>
                <h3>Sin detalles disponibles</h3>
                <p>No hay items para mostrar detalles del subcontrato '${currentSubcontractName}'.</p>
            </div>
        `;
        return;
    }

    // Filtros de búsqueda
    const searchHtml = `
        <div class="search-filter-container">
            <input type="text" id="detailsSearch" class="search-input" placeholder="Buscar por pregunta, ID o estado..." onkeyup="filterDetails()">
            <select id="detailsStateFilter" class="filter-select-small" onchange="filterDetails()">
                <option value="">Todos los estados</option>
                ${Object.keys(estadoColores).filter(s => s !== 'default').map(state => 
                    `<option value="${state}">${state}</option>`
                ).join('')}
            </select>
            <button class="btn-icon" onclick="clearDetailsFilters()" title="Limpiar filtros">
                <i class="fas fa-eraser"></i>
            </button>
        </div>
    `;

    // Tabla de detalles con paginación
    const startIndex = (detailsPage - 1) * detailsPerPage;
    const endIndex = startIndex + detailsPerPage;
    const paginatedData = currentSubcontractData.slice(startIndex, endIndex);
    
    const tableHtml = `
        <div class="details-table-container">
            <table class="details-table">
                <thead>
                    <tr>
                        <th style="width: 80px;">ID</th>
                        <th style="width: 80px;">Doc</th>
                        <th style="width: 120px;">Estado</th>
                        <th style="width: 400px;">Pregunta</th>
                        <th style="width: 150px;">Temática</th>
                        <th style="width: 120px;">Elaborador</th>
                        <th style="width: 120px;">Revisor</th>
                        <th style="width: 100px;">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedData.map(item => `
                        <tr>
                            <td style="font-weight: 600;">${item.ID_Corregido || item.ID}</td>
                            <td>
                                <span style="
                                    background: ${item.Documento === 'ADC' ? 'var(--success-50)' : 'var(--warning-50)'};
                                    color: ${item.Documento === 'ADC' ? 'var(--success-600)' : 'var(--warning-600)'};
                                    padding: 2px 6px;
                                    border-radius: 3px;
                                    font-size: 0.75rem;
                                    font-weight: 600;
                                ">${item.Documento || 'N/A'}</span>
                            </td>
                            <td>
                                <span class="status-badge" style="
                                    background: ${estadoColores[item.Estado] || estadoColores.default};
                                    color: ${estadoFuenteColores[item.Estado] || estadoFuenteColores.default};
                                ">${item.Estado || 'N/A'}</span>
                            </td>
                            <td class="question-cell">${item.Pregunta || item.Item || 'Sin pregunta disponible'}</td>
                            <td>${item.Tematica || 'N/A'}</td>
                            <td>${item.Elaborador || 'N/A'}</td>
                            <td>${item.Revisor || 'N/A'}</td>
                            <td style="font-size: 0.8rem;">${formatDate(item.FechaReporte) || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Paginación
    const totalPages = Math.ceil(currentSubcontractData.length / detailsPerPage);
    const paginationHtml = `
        <div class="pagination-container">
            <div class="pagination-info">
                Mostrando ${startIndex + 1}-${Math.min(endIndex, currentSubcontractData.length)} de ${currentSubcontractData.length} items
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" onclick="changeDetailsPage(${detailsPage - 1})" ${detailsPage <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Anterior
                </button>
                <span style="padding: 0 16px; color: var(--text-secondary);">
                    Página ${detailsPage} de ${totalPages}
                </span>
                <button class="pagination-btn" onclick="changeDetailsPage(${detailsPage + 1})" ${detailsPage >= totalPages ? 'disabled' : ''}>
                    Siguiente <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;

    container.innerHTML = searchHtml + tableHtml + paginationHtml;
}

function renderSubcontractTimeline() {
    const container = document.getElementById('subcontractTimelineContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!currentSubcontractData || currentSubcontractData.length === 0) {
        container.innerHTML = `
            <div class="no-data-state">
                <div class="no-data-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <h3>Sin cronograma disponible</h3>
                <p>No hay datos temporales para el subcontrato '${currentSubcontractName}'.</p>
            </div>
        `;
        return;
    }

    // Procesar y organizar datos de cronograma
    const timelineData = processTimelineData(currentSubcontractData);
    
    const cronogramaHtml = `
        <div class="modern-timeline-container">
            <!-- Header del cronograma -->
            <div class="timeline-header">
                <div class="timeline-title">
                    <h3>
                        <i class="fas fa-tasks"></i>
                        Cronograma de Entregas - ${currentSubcontractName}
                    </h3>
                    <div class="timeline-stats">
                        <span class="stat-badge completed">${timelineData.completed} Completados</span>
                        <span class="stat-badge in-progress">${timelineData.inProgress} En Progreso</span>
                        <span class="stat-badge pending">${timelineData.pending} Pendientes</span>
                    </div>
                </div>
                <div class="timeline-actions">
                    <button class="timeline-btn" onclick="exportTimelineToExcel()" title="Exportar cronograma">
                        <i class="fas fa-file-excel"></i>
                        <span>Exportar</span>
                    </button>
                    <button class="timeline-btn" onclick="refreshTimeline()" title="Actualizar">
                        <i class="fas fa-sync-alt"></i>
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            <!-- Filtros y vista -->
            <div class="timeline-controls">
                <div class="view-options">
                    <button class="view-btn active" onclick="switchTimelineView('card')" data-view="card">
                        <i class="fas fa-th-large"></i> Vista Tarjetas
                    </button>
                    <button class="view-btn" onclick="switchTimelineView('gantt')" data-view="gantt">
                        <i class="fas fa-chart-gantt"></i> Vista Gantt
                    </button>
                    <button class="view-btn" onclick="switchTimelineView('calendar')" data-view="calendar">
                        <i class="fas fa-calendar-week"></i> Vista Calendario
                    </button>
                </div>
                <div class="filter-options">
                    <select id="stateFilter" onchange="filterTimelineByState(this.value)" class="timeline-select">
                        <option value="all">Todos los estados</option>
                        <option value="En elaboración">En elaboración</option>
                        <option value="En revisor técnico">En revisor técnico</option>
                        <option value="En coordinador">En coordinador</option>
                        <option value="En revisor editorial">En revisor editorial</option>
                        <option value="Incorporada">Incorporada</option>
                    </select>
                </div>
            </div>

            <!-- Contenedor de vista de cronograma -->
            <div id="timelineViewContainer" class="timeline-view-container">
                ${renderCardView(timelineData.items)}
            </div>
        </div>
    `;

    container.innerHTML = cronogramaHtml;
    
    // Inicializar datos del cronograma
    initializeTimelineData();
}

// ===== FUNCIONES DE PROCESAMIENTO DE CRONOGRAMA =====
function processTimelineData(data) {
    const itemsMap = {};
    let completed = 0, inProgress = 0, pending = 0;
    
    // Agrupar por item ID
    data.forEach(item => {
        const itemId = item.ID_Corregido || item.ID;
        if (!itemsMap[itemId]) {
            itemsMap[itemId] = {
                id: itemId,
                titulo: item.Pregunta || item.Item || `Item ${itemId}`,
                estado: item.Estado,
                tematica: item.Tematica,
                elaborador: item.Elaborador,
                revisor: item.Revisor,
                documento: item.Documento,
                fechaInicio: item.FechaReporte,
                fechaUltimaActualizacion: item.FechaReporte,
                semana: item.Semana,
                historico: []
            };
        }
        
        // Actualizar fechas
        if (item.FechaReporte < itemsMap[itemId].fechaInicio) {
            itemsMap[itemId].fechaInicio = item.FechaReporte;
        }
        if (item.FechaReporte > itemsMap[itemId].fechaUltimaActualizacion) {
            itemsMap[itemId].fechaUltimaActualizacion = item.FechaReporte;
            itemsMap[itemId].estado = item.Estado;
        }
        
        itemsMap[itemId].historico.push({
            fecha: item.FechaReporte,
            estado: item.Estado,
            semana: item.Semana
        });
    });
    
    // Calcular fechas de entrega y estadísticas
    const items = Object.values(itemsMap).map(item => {
        const fechaEntrega = calculateDeliveryDate(item.estado, item.fechaUltimaActualizacion);
        const urgencia = calculateUrgency(item.estado, fechaEntrega);
        const progreso = calculateProgress(item.estado);
        
        // Contar para estadísticas
        if (item.estado === 'Incorporada') completed++;
        else if (['En elaboración', 'En elaboración de cartografía'].includes(item.estado)) pending++;
        else inProgress++;
        
        return {
            ...item,
            fechaEntregaEstimada: fechaEntrega,
            urgencia: urgencia,
            progreso: progreso,
            diasRestantes: calculateDaysRemaining(fechaEntrega),
            tendencia: calculateTrend(item.historico)
        };
    });
    
    // Ordenar por urgencia y fecha de entrega
    items.sort((a, b) => {
        if (a.urgencia !== b.urgencia) {
            const urgencyOrder = { 'critica': 0, 'alta': 1, 'media': 2, 'baja': 3 };
            return urgencyOrder[a.urgencia] - urgencyOrder[b.urgencia];
        }
        return new Date(a.fechaEntregaEstimada) - new Date(b.fechaEntregaEstimada);
    });
    
    return { items, completed, inProgress, pending };
}

function calculateDeliveryDate(estado, fechaBase) {
    const today = new Date();
    const baseDate = new Date(fechaBase);
    const referenceDate = baseDate > today ? baseDate : today;
    
    const deliveryDays = {
        'En elaboración': 20,
        'En elaboración de cartografía': 15,
        'En revisor técnico': 10,
        'En coordinador': 7,
        'En revisor editorial': 3,
        'Incorporada': 0
    };
    
    const days = deliveryDays[estado] || 14;
    const deliveryDate = new Date(referenceDate);
    deliveryDate.setDate(deliveryDate.getDate() + days);
    
    return deliveryDate.toISOString().split('T')[0];
}

function calculateUrgency(estado, fechaEntrega) {
    const today = new Date();
    const delivery = new Date(fechaEntrega);
    const daysRemaining = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
    
    if (estado === 'Incorporada') return 'baja';
    if (daysRemaining <= 3) return 'critica';
    if (daysRemaining <= 7) return 'alta';
    if (daysRemaining <= 14) return 'media';
    return 'baja';
}

function calculateProgress(estado) {
    const progressMap = {
        'En elaboración': 20,
        'En elaboración de cartografía': 30,
        'En revisor técnico': 50,
        'En coordinador': 70,
        'En revisor editorial': 90,
        'Incorporada': 100
    };
    return progressMap[estado] || 10;
}

function calculateDaysRemaining(fechaEntrega) {
    const today = new Date();
    const delivery = new Date(fechaEntrega);
    const days = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
}

function calculateTrend(historico) {
    if (historico.length < 2) return 'estable';
    
    const recent = historico.slice(-2);
    const progressValues = recent.map(h => calculateProgress(h.estado));
    
    if (progressValues[1] > progressValues[0]) return 'mejorando';
    if (progressValues[1] < progressValues[0]) return 'retrocediendo';
    return 'estable';
}

// ===== VISTAS DE CRONOGRAMA =====
function renderCardView(items) {
    return `
        <div class="timeline-cards-grid">
            ${items.map(item => `
                <div class="timeline-card ${item.urgencia}" data-estado="${item.estado}">
                    <div class="card-header">
                        <div class="card-id">ID: ${item.id}</div>
                        <div class="card-urgency urgency-${item.urgencia}">
                            ${getUrgencyIcon(item.urgencia)} ${item.urgencia.toUpperCase()}
                        </div>
                    </div>
                    
                    <div class="card-content">
                        <h4 class="card-title" title="${item.titulo}">
                            ${item.titulo.length > 60 ? item.titulo.substring(0, 60) + '...' : item.titulo}
                        </h4>
                        
                        <div class="card-meta">
                            <div class="meta-item">
                                <i class="fas fa-tag"></i>
                                <span>${item.tematica || 'Sin temática'}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-user"></i>
                                <span>${item.elaborador || 'Sin asignar'}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-file-alt"></i>
                                <span>${item.documento}</span>
                            </div>
                        </div>
                        
                        <div class="card-progress">
                            <div class="progress-header">
                                <span class="progress-label">${item.estado}</span>
                                <span class="progress-percentage">${item.progreso}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill estado-${item.estado.replace(/\s+/g, '-').toLowerCase()}" 
                                     style="width: ${item.progreso}%"></div>
                            </div>
                        </div>
                        
                        <div class="card-dates">
                            <div class="date-item">
                                <label><i class="fas fa-play"></i> Inicio:</label>
                                <span>${formatDateShort(item.fechaInicio)}</span>
                            </div>
                            <div class="date-item">
                                <label><i class="fas fa-clock"></i> Última actualización:</label>
                                <span>${formatDateShort(item.fechaUltimaActualizacion)}</span>
                            </div>
                            <div class="date-item delivery">
                                <label><i class="fas fa-flag-checkered"></i> Entrega estimada:</label>
                                <span class="delivery-date">${formatDateShort(item.fechaEntregaEstimada)}</span>
                            </div>
                        </div>
                        
                        <div class="card-footer">
                            <div class="days-remaining ${item.urgencia}">
                                <i class="fas fa-calendar-day"></i>
                                ${item.diasRestantes === 0 ? 'Hoy' : 
                                  item.diasRestantes === 1 ? '1 día restante' : 
                                  `${item.diasRestantes} días restantes`}
                            </div>
                            <div class="trend-indicator trend-${item.tendencia}">
                                ${getTrendIcon(item.tendencia)} ${item.tendencia}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderGanttView(items) {
    if (items.length === 0) return '<div class="no-data">No hay items para mostrar</div>';
    
    // Calcular rango de fechas para el Gantt
    const allDates = items.flatMap(item => [item.fechaInicio, item.fechaEntregaEstimada]);
    const minDate = new Date(Math.min(...allDates.map(d => new Date(d))));
    const maxDate = new Date(Math.max(...allDates.map(d => new Date(d))));
    
    // Añadir márgenes
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 14);
    
    const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
    
    return `
        <div class="gantt-view">
            <div class="gantt-header-row">
                <div class="gantt-task-column">Tarea</div>
                <div class="gantt-timeline-column">
                    <div class="gantt-dates">
                        ${generateDateHeaders(minDate, maxDate)}
                    </div>
                </div>
            </div>
            
            <div class="gantt-body">
                ${items.map(item => {
                    const startPos = calculatePosition(item.fechaInicio, minDate, totalDays);
                    const endPos = calculatePosition(item.fechaEntregaEstimada, minDate, totalDays);
                    const duration = endPos - startPos;
                    
                    return `
                        <div class="gantt-row">
                            <div class="gantt-task-info">
                                <div class="task-title">${item.titulo.substring(0, 40)}...</div>
                                <div class="task-meta">ID: ${item.id} • ${item.estado}</div>
                            </div>
                            <div class="gantt-timeline">
                                <div class="gantt-bar-container">
                                    <div class="gantt-bar estado-${item.estado.replace(/\s+/g, '-').toLowerCase()}" 
                                         style="left: ${startPos}%; width: ${duration}%"
                                         title="${item.titulo} | ${item.estado} | Entrega: ${formatDateShort(item.fechaEntregaEstimada)}">
                                        <span class="bar-label">${item.progreso}%</span>
                                    </div>
                                    <div class="gantt-milestone" 
                                         style="left: ${endPos}%"
                                         title="Fecha entrega estimada: ${formatDateShort(item.fechaEntregaEstimada)}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderCalendarView(items) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weeks = [];
    for (let i = 0; i < 8; i++) { // Mostrar 8 semanas
        const weekStart = new Date(startOfWeek);
        weekStart.setDate(startOfWeek.getDate() + (i * 7));
        weeks.push(weekStart);
    }
    
    return `
        <div class="calendar-view">
            <div class="calendar-header">
                <div class="week-header">Semana</div>
                <div class="days-header">
                    <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div>
                    <div>Jue</div><div>Vie</div><div>Sáb</div>
                </div>
            </div>
            
            <div class="calendar-body">
                ${weeks.map(weekStart => {
                    const weekItems = getItemsForWeek(items, weekStart);
                    return `
                        <div class="calendar-week">
                            <div class="week-label">
                                Sem ${getWeekNumber(weekStart)}
                                <small>${formatDateShort(weekStart)}</small>
                            </div>
                            <div class="week-days">
                                ${Array.from({length: 7}, (_, dayIndex) => {
                                    const currentDay = new Date(weekStart);
                                    currentDay.setDate(weekStart.getDate() + dayIndex);
                                    const dayItems = getItemsForDay(weekItems, currentDay);
                                    
                                    return `
                                        <div class="calendar-day ${isToday(currentDay) ? 'today' : ''}">
                                            <div class="day-number">${currentDay.getDate()}</div>
                                            <div class="day-items">
                                                ${dayItems.map(item => `
                                                    <div class="day-item urgency-${item.urgencia}" title="${item.titulo}">
                                                        <span class="item-id">${item.id}</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ===== FUNCIONES AUXILIARES PARA VISTAS =====
function getUrgencyIcon(urgency) {
    const icons = {
        'critica': '<i class="fas fa-exclamation-triangle"></i>',
        'alta': '<i class="fas fa-exclamation-circle"></i>',
        'media': '<i class="fas fa-clock"></i>',
        'baja': '<i class="fas fa-check-circle"></i>'
    };
    return icons[urgency] || '<i class="fas fa-circle"></i>';
}

function getTrendIcon(trend) {
    const icons = {
        'mejorando': '<i class="fas fa-arrow-up"></i>',
        'retrocediendo': '<i class="fas fa-arrow-down"></i>',
        'estable': '<i class="fas fa-minus"></i>'
    };
    return icons[trend] || '<i class="fas fa-minus"></i>';
}

function formatDateShort(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
    });
}

function generateDateHeaders(startDate, endDate) {
    const headers = [];
    const current = new Date(startDate);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    while (current <= endDate) {
        headers.push(`
            <div class="date-header">
                <div class="date-week">Sem ${getWeekNumber(current)}</div>
                <div class="date-day">${formatDateShort(current.toISOString().split('T')[0])}</div>
            </div>
        `);
        current.setTime(current.getTime() + oneWeek);
    }
    
    return headers.join('');
}

function calculatePosition(date, startDate, totalDays) {
    const targetDate = new Date(date);
    const daysDiff = (targetDate - startDate) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.min(100, (daysDiff / totalDays) * 100));
}

function getItemsForWeek(items, weekStart) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return items.filter(item => {
        const deliveryDate = new Date(item.fechaEntregaEstimada);
        return deliveryDate >= weekStart && deliveryDate <= weekEnd;
    });
}

function getItemsForDay(items, targetDay) {
    const dayStr = targetDay.toISOString().split('T')[0];
    return items.filter(item => item.fechaEntregaEstimada === dayStr);
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

// ===== FUNCIONES DE CONTROL DE VISTAS =====
let currentTimelineView = 'card';
let filteredTimelineData = null;

function switchTimelineView(viewType) {
    if (!filteredTimelineData) return;
    
    currentTimelineView = viewType;
    
    // Actualizar botones
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
    
    // Renderizar vista
    const container = document.getElementById('timelineViewContainer');
    if (!container) return;
    
    switch(viewType) {
        case 'card':
            container.innerHTML = renderCardView(filteredTimelineData.items);
            break;
        case 'gantt':
            container.innerHTML = renderGanttView(filteredTimelineData.items);
            break;
        case 'calendar':
            container.innerHTML = renderCalendarView(filteredTimelineData.items);
            break;
    }
    
    
}

function filterTimelineByState(estado) {
    if (!filteredTimelineData) return;
    
    const originalData = processTimelineData(currentSubcontractData);
    
    if (estado === 'all') {
        filteredTimelineData = originalData;
    } else {
        filteredTimelineData = {
            ...originalData,
            items: originalData.items.filter(item => item.estado === estado)
        };
    }
    
    // Actualizar estadísticas
    updateTimelineStats(filteredTimelineData);
    
    // Re-renderizar vista actual
    switchTimelineView(currentTimelineView);
}

function updateTimelineStats(data) {
    const statBadges = document.querySelectorAll('.stat-badge');
    if (statBadges.length >= 3) {
        statBadges[0].textContent = `${data.completed} Completados`;
        statBadges[1].textContent = `${data.inProgress} En Progreso`;
        statBadges[2].textContent = `${data.pending} Pendientes`;
    }
}

function refreshTimeline() {
    if (!currentSubcontractData) return;
    
    // Recargar datos
    filteredTimelineData = processTimelineData(currentSubcontractData);
    
    // Resetear filtro
    const stateFilter = document.getElementById('stateFilter');
    if (stateFilter) stateFilter.value = 'all';
    
    // Re-renderizar
    switchTimelineView(currentTimelineView);

}

// Inicializar datos del cronograma cuando se renderiza
function initializeTimelineData() {
    if (currentSubcontractData && currentSubcontractData.length > 0) {
        filteredTimelineData = processTimelineData(currentSubcontractData);
    }
}

function getDeliveryWeeksForState(estado) {
    const deliveryWeeks = {
        'En elaboración': 4,
        'En elaboración de cartografía': 3,
        'En revisor técnico': 2,
        'En coordinador': 2,
        'En revisor editorial': 1,
        'Incorporada': 0
    };
    return deliveryWeeks[estado] || 3;
}

function addWeeksToDate(dateStr, weeks) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + (weeks * 7));
    return date.toISOString().split('T')[0];
}

function getDatePosition(dateStr, dateSpan) {
    const index = dateSpan.findIndex(d => d.date === dateStr);
    if (index === -1) {
        // Si no está en el span, calcular posición aproximada
        const targetDate = new Date(dateStr);
        const startDate = new Date(dateSpan[0].date);
        const daysDiff = (targetDate - startDate) / (1000 * 60 * 60 * 24);
        const weeksDiff = daysDiff / 7;
        return Math.max(0, Math.min(100, (weeksDiff / dateSpan.length) * 100));
    }
    return (index / (dateSpan.length - 1)) * 100;
}

function getProgressClass(estado) {
    switch(estado) {
        case 'Incorporada':
            return 'completed';
        case 'En elaboración':
        case 'En elaboración de cartografía':
            return 'in-progress';
        case 'En revisor técnico':
        case 'En coordinador':
        case 'En revisor editorial':
            return 'in-progress';
        default:
            return 'planned';
    }
}

function getProgressIcon(estado) {
    switch(estado) {
        case 'En elaboración':
        case 'En elaboración de cartografía':
            return '✏️';
        case 'En revisor técnico':
        case 'En coordinador':
        case 'En revisor editorial':
            return '📋';
        default:
            return '⏳';
    }
}

function addGanttTooltips() {
    const ganttBars = document.querySelectorAll('.gantt-task-bar');
    const milestones = document.querySelectorAll('.gantt-milestone');
    
    [...ganttBars, ...milestones].forEach(element => {
        element.addEventListener('mouseenter', showGanttTooltip);
        element.addEventListener('mouseleave', hideGanttTooltip);
    });
}

function showGanttTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'gantt-tooltip';
    tooltip.innerHTML = event.target.title;
    tooltip.style.left = event.pageX + 'px';
    tooltip.style.top = (event.pageY - 40) + 'px';
    document.body.appendChild(tooltip);
    
    event.target.tooltipElement = tooltip;
}

function hideGanttTooltip(event) {
    if (event.target.tooltipElement) {
        event.target.tooltipElement.remove();
        delete event.target.tooltipElement;
    }
}

// ===== ANÁLISIS Y VISUALIZACIÓN =====
function analyzeAndDisplayData(data) {
    clearDisplayElements(); 
    if (!data || data.length === 0) return;
    
    const currentStats = {
        totalItems: data.length,
        totalADC: data.filter(item => item.Documento === 'ADC').length,
        totalPAC: data.filter(item => item.Documento === 'PAC').length
    };

    // Actualizar estadísticas principales
    animateNumber(dom.totalItems, currentStats.totalItems);
    animateNumber(dom.totalADC, currentStats.totalADC);
    animateNumber(dom.totalPAC, currentStats.totalPAC);

    // Mostrar comparaciones
    if (previousStats && previousStats.date !== dom.daySelect.options[dom.daySelect.selectedIndex]?.text) {
        displayStatComparison('totalItemsPrev', currentStats.totalItems, previousStats.totalItems);
        displayStatComparison('totalADCPrev', currentStats.totalADC, previousStats.totalADC);
        displayStatComparison('totalPACPrev', currentStats.totalPAC, previousStats.totalPAC);
    } else {
        ['totalItemsPrev', 'totalADCPrev', 'totalPACPrev'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.classList.add('hidden'); el.innerHTML = ''; }
        });
    }
    
    // El gráfico de evolución se actualiza siempre, independientemente de la pestaña.
    // Se filtra por "TODOS" por defecto. Los botones lo cambiarán.
    updateEvolutionChart(data, 'TODOS'); 
    
    // Renderizar según la pestaña activa
    const stateAnalysis = analyzeStates(data);
    switch(currentMainTab) {
        case 'dashboard':
            updateAllCharts(stateAnalysis, data);
            break;
        case 'roles':
            analyzeRoles(data);
            break;
        case 'reports':
            renderReportsSection();
            break;
    }
    
    updateQuickStats();
}

function animateNumber(element, targetNumber) {
    if (!element) return;
    
    const startNumber = parseInt(element.textContent) || 0;
    const duration = 500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentNumber = Math.round(startNumber + (targetNumber - startNumber) * progress);
        element.textContent = currentNumber;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function displayStatComparison(elementId, currentValue, previousValue) {
    const diff = currentValue - previousValue;
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.classList.remove('hidden');
    
    if (diff > 0) {
        element.innerHTML = `<i class="fas fa-arrow-up"></i> +${diff} vs anterior`;
        element.className = 'stat-comparison increase';
    } else if (diff < 0) {
        element.innerHTML = `<i class="fas fa-arrow-down"></i> ${diff} vs anterior`;
        element.className = 'stat-comparison decrease';
    } else {
        element.innerHTML = `<i class="fas fa-equals"></i> Sin cambios`;
        element.className = 'stat-comparison neutral';
    }
}

function clearDisplayElements() {
    [dom.totalItems, dom.totalADC, dom.totalPAC].forEach(el => {
        if (el) el.textContent = '0';
    });
    
    ['totalItemsPrev', 'totalADCPrev', 'totalPACPrev'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
            el.innerHTML = '';
        }
    });
    
    destroyDonutCharts(); 
    [dom.legendADCBody, dom.legendPACBody, dom.legendTotalBody].forEach(el => {
        if (el) el.innerHTML = '';
    });
    
    if (dom.roleStats) dom.roleStats.innerHTML = '';
}

function analyzeStates(data) {
    const analysis = { ADC: {}, PAC: {}, total: {} };
    data.forEach(item => {
        if (item.Documento === 'ADC' || item.Documento === 'PAC') {
            analysis[item.Documento][item.Estado] = (analysis[item.Documento][item.Estado] || 0) + 1;
        }
        analysis.total[item.Estado] = (analysis.total[item.Estado] || 0) + 1;
    });
    return analysis;
}

// ===== GRÁFICOS =====
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function(chart) {
        // Asegurarse que el plugin está activado y es un gráfico de dona
        if (chart.config.type === 'doughnut' && chart.config.options.plugins.centerText?.display) {
            const ctx = chart.ctx;
            const { top, right, bottom, left } = chart.chartArea;
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            const config = chart.config.options.plugins.centerText;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Texto principal (el número grande)
            ctx.font = `bold ${config.fontSize || '32'}px ${config.fontFamily || 'Inter, sans-serif'}`;
            // Obtener color desde las variables CSS para que funcione con el cambio de tema
            ctx.fillStyle = config.color || getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
            ctx.fillText(config.text, centerX, centerY - 8);

            // Subtítulo (el texto pequeño debajo)
            if (config.subText) {
                ctx.font = `normal ${config.subFontSize || '14'}px ${config.fontFamily || 'Inter, sans-serif'}`;
                ctx.fillStyle = config.subColor || getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
                ctx.fillText(config.subText, centerX, centerY + 16);
            }
            ctx.restore();
        }
    }
};

/**
 * Destruye todas las instancias de los gráficos de dona.
 */
function destroyDonutCharts() { 
    ['ADC', 'PAC', 'total'].forEach(key => {
        if (charts[key]) {
            charts[key].destroy();
            delete charts[key];
        }
    });
}

/**
 * Actualiza todos los gráficos de dona en el dashboard.
 * @param {object} stateAnalysis - El objeto con los datos analizados por estado.
 * @param {Array} sourceDataForClick - Los datos filtrados actuales para la interactividad.
 */
function updateAllCharts(stateAnalysis, sourceDataForClick) {
    destroyDonutCharts(); 
    
    // Opciones base para todos los gráficos de dona
    const getChartBaseOptions = (chartType, totalItems) => {
        const subTextMap = {
            'total': totalItems === 1 ? 'Pregunta' : 'Preguntas',
            'ADC': 'ADC',
            'PAC': 'PAC'
        };
        
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            cutout: '50%', // Aumentado para dar más espacio al texto central
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const chart = elements[0].chart;
                    const activeElement = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)[0];
                    if (activeElement) {
                        const dataIndex = activeElement.index;
                        const clickedLabel = chart.data.labels[dataIndex];
                        showQuestionsInModal(clickedLabel, chartType, sourceDataForClick);
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 12, weight: '600' },
                    bodyFont: { size: 11 },
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw} (${(ctx.raw / ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0) * 100).toFixed(1)}%)`
                    }
                },
                // Configuración para nuestro plugin de texto central
                centerText: {
                    display: true,
                    text: totalItems.toString(),
                    subText: subTextMap[chartType] || 'Items',
                    fontSize: 28, // Tamaño del número
                    subFontSize: 12, // Tamaño del subtítulo
                },
                datalabels: {
                    display: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        if (total === 0) return false; 
                        const percentage = (value / total * 100);
                        return percentage > 5; // Mostrar solo si es mayor al 5%
                    },
                    color: (ctx) => estadoFuenteColores[ctx.chart.data.labels[ctx.dataIndex]] || '#fff',
                    font: {
                        weight: 'bold',
                        size: 11
                    },
                    formatter: (value, ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                         if (total === 0) return '';
                        const percentage = (value / total * 100).toFixed(0);
                        return percentage + '%';
                    }
                }
            }
        };
    };
    
    // Función interna para crear cada gráfico
    function createDonutChart(canvasId, legendTableBody, data, cardId, chartKey) {
        if (!legendTableBody) return;
        
        legendTableBody.innerHTML = ''; 
        const canvas = document.getElementById(canvasId);
        const chartCard = document.getElementById(cardId);
        
        if (!canvas || !chartCard) return;

        const sortedStates = Object.keys(data).sort((a, b) => {
            const indexA = ESTADO_ORDER.indexOf(a);
            const indexB = ESTADO_ORDER.indexOf(b);
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

        const total = Object.values(data).reduce((acc, val) => acc + val, 0);
        
        if (total === 0) {
            chartCard.style.display = 'none';
            return;
        }
        
        chartCard.style.display = 'block';

        const chartData = {
            labels: sortedStates,
            datasets: [{
                data: sortedStates.map(state => data[state]),
                backgroundColor: sortedStates.map(state => estadoColores[state] || estadoColores.default),
                borderWidth: 2,
                // Usar variable CSS para el borde, para que se adapte al tema
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim(),
            }]
        };
        
        // Crear el gráfico con las opciones base, pasando el total
        charts[chartKey] = new Chart(canvas, {
            type: 'doughnut',
            data: chartData,
            options: getChartBaseOptions(chartKey, total)
        });

        // Llenar la tabla de leyenda (esto no cambia)
        sortedStates.forEach(state => {
            const count = data[state];
            const percentage = (count / total * 100).toFixed(1);
            const row = legendTableBody.insertRow();
            
            row.innerHTML = `
                <td style="display: flex; align-items: center; gap: 8px;">
                    <div style="
                        width: 12px; 
                        height: 12px; 
                        background-color: ${estadoColores[state] || estadoColores.default}; 
                        border-radius: 3px;
                        flex-shrink: 0;
                    "></div>
                    ${state}
                </td>
                <td style="text-align: right; font-weight: 600;">${count}</td>
                <td style="text-align: right; color: var(--text-secondary);">${percentage}%</td>
            `;
            
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => {
                showQuestionsInModal(state, chartKey, sourceDataForClick);
            });
            
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'var(--bg-tertiary)';
            });
            
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
        });
    }

    // Crear los gráficos
    if (Object.keys(stateAnalysis.total).length > 0) {
        createDonutChart('chartTotal', dom.legendTotalBody, stateAnalysis.total, 'chartTotalCard', 'total');
    }
    if (Object.keys(stateAnalysis.ADC).length > 0) {
        createDonutChart('chartADC', dom.legendADCBody, stateAnalysis.ADC, 'chartADCCard', 'ADC');
    }
    if (Object.keys(stateAnalysis.PAC).length > 0) {
        createDonutChart('chartPAC', dom.legendPACBody, stateAnalysis.PAC, 'chartPACCard', 'PAC');
    }
}

// ===== ANÁLISIS POR ROLES =====
function analyzeRoles(data) {
    if (!document.getElementById('rolesChart')) return;
    
    const roleAnalysis = {};
    data.forEach(item => {
        [item.Elaborador, item.Revisor, item.Coordinador].forEach(person => {
            if (person && person.trim() !== '') {
                if (!roleAnalysis[person]) {
                    roleAnalysis[person] = {};
                }
                roleAnalysis[person][item.Estado] = (roleAnalysis[person][item.Estado] || 0) + 1;
            }
        });
    });

    // --- ORDENAMIENTO ---
    const orderSelect = document.getElementById('rolesOrderSelect');
    let personas = Object.keys(roleAnalysis);
    let orden = orderSelect ? orderSelect.value : 'alfabetico';
    if (orden === 'carga') {
        personas.sort((a, b) => {
            const totalA = Object.values(roleAnalysis[a]).reduce((acc, val) => acc + val, 0);
            const totalB = Object.values(roleAnalysis[b]).reduce((acc, val) => acc + val, 0);
            return totalB - totalA || a.localeCompare(b);
        });
    } else {
        personas.sort((a, b) => a.localeCompare(b));
    }

    const estados = ESTADO_ORDER.concat(
        ...personas.map(p => Object.keys(roleAnalysis[p]).filter(e => !ESTADO_ORDER.includes(e)))
    ).filter((v, i, arr) => arr.indexOf(v) === i); // Unicos y ordenados

    // Construir datasets para Chart.js
    const datasets = estados.map(estado => ({
        label: estado,
        data: personas.map(persona => roleAnalysis[persona][estado] || 0),
        backgroundColor: estadoColores[estado] || estadoColores.default,
        stack: 'roles'
    }));

    // Destruir gráfico anterior si existe
    if (charts.rolesChart) {
        charts.rolesChart.destroy();
    }
    const ctx = document.getElementById('rolesChart').getContext('2d');
    charts.rolesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: personas,
            datasets: datasets
        },
        options: {
            indexAxis: 'y', // Barras horizontales
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Comparativo de Roles por Estado' },
                datalabels: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const idx = context[0].dataIndex;
                            return personas[idx];
                        }
                    }
                }
            },
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { stacked: true, title: { display: true, text: 'Cantidad' }, beginAtZero: true },
                y: { stacked: true, title: { display: true, text: 'Persona' } }
            }
        }
    });
}

// Evento para actualizar el gráfico al cambiar el orden
if (document.getElementById('rolesOrderSelect')) {
    document.getElementById('rolesOrderSelect').addEventListener('change', function() {
        analyzeRoles(currentFilteredData);
    });
}

// ===== EVOLUCIÓN TEMPORAL - VERSIÓN LIMPIA =====

/**
 * @param {Array} data - El conjunto de datos crudos completo.
 * @param {string} [filterType='TODOS'] - El tipo de documento a filtrar ('TODOS', 'ADC', 'PAC').
 */
function updateEvolutionChart(data, filterType = 'TODOS') {
  const evolutionContainer = dom.evolutionContainer;
  if (!evolutionContainer) return;

  // --- Definir meta global según filtro principal ---
  let META_TOTAL_ITEMS = 494;
  if (filterType === 'ADC') META_TOTAL_ITEMS = 318;
  if (filterType === 'PAC') META_TOTAL_ITEMS = 176;

  // --- 1. Filtrado inicial de datos por tipo ---
  let filteredData = data;
  if (filterType === 'ADC') {
    filteredData = data.filter(item => item.Documento === 'ADC');
  } else if (filterType === 'PAC') {
    filteredData = data.filter(item => item.Documento === 'PAC');
  }

  // Si no hay datos después de filtrar, ocultar y salir
  if (filteredData.length === 0) {
    evolutionContainer.classList.add('hidden');
    if (charts.evolution) charts.evolution.destroy();
    return;
  }

  evolutionContainer.classList.remove('hidden');

  // --- 2. Preparar el rango completo de semanas para el eje X ---
  const START_WEEK = 23;
  const END_WEEK = 35;
  const allWeeksInRange = Array.from({ length: END_WEEK - START_WEEK + 1 }, (_, i) => START_WEEK + i);

  // --- 3. Función para obtener la fecha de inicio de una semana del año ---
  function getWeekStartDate(weekNumber, year = 2024) {
    // Para la semana 23, sabemos que empieza el 2 de junio
    const baseDate = new Date(2024, 5, 2); // 2 de junio de 2024 (mes 5 = junio en JavaScript)
    const baseWeek = 23;
    
    // Calcular la diferencia de semanas
    const weekDifference = weekNumber - baseWeek;
    
    // Calcular la fecha sumando los días necesarios
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + (weekDifference * 7));
    
    return targetDate;
  }

  // --- 4. Obtener el conteo del último día para cada semana ---
  const incorporatedCounts = [];
  const editorialCounts = [];

  for (const week of allWeeksInRange) {
    const weekData = filteredData.filter(item => parseInt(item.Semana) === week);

    if (weekData.length === 0) {
      incorporatedCounts.push(null);
      editorialCounts.push(null);
    } else {
      // Encontrar la fecha más reciente de esta semana
      const latestDateInWeek = new Date(
        Math.max(...weekData.map(item => new Date(item.FechaReporte)))
      );

      // Filtrar solo los datos de ese último día
      const latestDayData = weekData.filter(item => {
        const itemDate = new Date(item.FechaReporte);
        return itemDate.toDateString() === latestDateInWeek.toDateString();
      });

      const incorporatedCount = latestDayData.filter(item => item.Estado === 'Incorporada').length;
      const editorialCount = latestDayData.filter(item => item.Estado === 'En revisor editorial').length;

      incorporatedCounts.push(incorporatedCount);
      editorialCounts.push(editorialCount);
    }
  }

  // --- 5. Crear labels con formato S. X y fecha ---
  const labels = allWeeksInRange.map(week => {
    const weekStart = getWeekStartDate(week);
    const day = weekStart.getDate();
    const month = weekStart.toLocaleDateString('es-CL', { month: 'short' });
    return [`S. ${week}`, `${day}/${month}`];
  });

  const canvas = document.getElementById('evolutionChart');
  if (!canvas) return;

  // Destruir gráfico existente
  if (charts.evolution) {
    charts.evolution.destroy();
  }

  // --- 6. Crear gradientes ---
  const ctx = canvas.getContext('2d');
  
  const gradientIncorporated = ctx.createLinearGradient(0, 0, 0, 400);
  gradientIncorporated.addColorStop(0, 'rgba(144, 190, 109, 0.4)');
  gradientIncorporated.addColorStop(1, 'rgba(144, 190, 109, 0.05)');
  
  const gradientEditorial = ctx.createLinearGradient(0, 0, 0, 400);
  gradientEditorial.addColorStop(0, 'rgba(181, 101, 118, 0.4)');
  gradientEditorial.addColorStop(1, 'rgba(181, 101, 118, 0.05)');

  // --- 7. Creación del gráfico ---
  charts.evolution = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'En Revisor Editorial',
          data: editorialCounts,
          borderColor: '#B56576',
          backgroundColor: gradientEditorial,
          borderWidth: 3,
          fill: true,
          tension: 0,
          spanGaps: false,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#B56576',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#B56576',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 2,
        },
        {
          label: 'Preguntas Incorporadas',
          data: incorporatedCounts,
          borderColor: '#90BE6D',
          backgroundColor: gradientIncorporated,
          borderWidth: 3,
          fill: true,
          tension: 0,
          spanGaps: false,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#90BE6D',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#90BE6D',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'center',
          labels: {
            usePointStyle: true,
            padding: 25,
            font: {
              size: 12,
              family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              weight: 'bold'
            },
            color: '#4A5568'
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#F9FAFB',
          bodyColor: '#E5E7EB',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 16,
          cornerRadius: 12,
          displayColors: true,
          titleFont: {
            size: 14,
            weight: '600',
            family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          },
          bodyFont: {
            size: 13,
            family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          },
          callbacks: {
            title: function(tooltipItems) {
              // Mostrar solo "Semana X" en el título del tooltip
              const weekNumber = tooltipItems[0].label.replace('S. ', 'Semana ');
              return weekNumber;
            }, 
            label: function(context) {
              const value = context.parsed.y;
              if (value === null) return null;
              
              return ' ' + context.dataset.label + ': ' + value.toLocaleString('es-CL');
            },
            afterLabel: function(context) {
              if (context.parsed.y === null) return null;
              
              const percentage = ((context.parsed.y / META_TOTAL_ITEMS) * 100).toFixed(1);
              return `  (${percentage}% del total)`;
            }
          }
        },
        datalabels: {
          display: function(context) {
            return context.dataset.label !== '' && context.dataset.data[context.dataIndex] !== null;
          },
          align: function(context) {
            // Si es "En Revisor Editorial", alinear abajo
            if (context.dataset.label === 'En Revisor Editorial') {
              return 'bottom';
            }
            // Si es "Preguntas Incorporadas", alinear arriba
            return 'top';
          },
          anchor: function(context) {
            // Si es "En Revisor Editorial", anclar al inicio (bottom del canvas)
            if (context.dataset.label === 'En Revisor Editorial') {
              return 'top';
            }
            // Si es "Preguntas Incorporadas", anclar al punto
            return 'start';
          },
          offset: function(context) {
            // Si es "En Revisor Editorial", sin offset (pegado al eje)
            if (context.dataset.label === 'En Revisor Editorial') {
              return -35;
            }
            // Si es "Preguntas Incorporadas", 4px sobre el punto
            return -35;
          },
          backgroundColor: function(context) {
            return context.dataset.borderColor;
          },
          borderColor: 'white',
          borderRadius: 4,
          borderWidth: 2,
          color: 'white',
          font: {
            weight: '500',
            size: 11
          },
          padding: {
            top: 4,
            bottom: 4,
            left: 6,
            right: 6
          },
          formatter: function(value) {
            return value;
          }
        },
        annotation: {
          annotations: {
            metaLine: {
              type: 'line',
              yMin: META_TOTAL_ITEMS,
              yMax: META_TOTAL_ITEMS,
              borderColor: 'rgba(0, 127, 163, 0.3)',
              borderWidth: 2,
              borderDash: [15, 10],
            },
            metaLabel: {
              type: 'label',
              xValue: labels.length - 1,
              yValue: META_TOTAL_ITEMS,
              backgroundColor: 'rgba(0, 127, 163, 0.1)',
              color: '#007FA3',
              font: {
                size: 12,
                weight: '600'
              },
              padding: {
                top: 4,
                bottom: 4,
                left: 8,
                right: 8
              },
              borderRadius: 4,
              content: [`Meta: ${META_TOTAL_ITEMS} preguntas`],
              callout: {
                display: false
              },
              textAlign: 'left',
              xAdjust: -100,
              yAdjust: 0
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(
            META_TOTAL_ITEMS + 50, 
            ...incorporatedCounts.filter(v => v !== null), 
            ...editorialCounts.filter(v => v !== null)
          ) + 20,
          grid: {
            color: 'rgba(0, 0, 0, 0.04)',
            drawBorder: false,
          },
          ticks: {
            padding: 10,
            font: {
              size: 12,
              family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            },
            color: '#6B7280',
            callback: function(value) {
              return value.toLocaleString('es-CL');
            }
          }
        },
        x: {
          grid: {
            display: true,
            drawBorder: false,
          },
          ticks: {
            padding: 35,
            font: {
              size: 11,
              family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            },
            color: '#6B7280',
            // Mostrar labels en dos líneas
            callback: function(value, index) {
              return this.getLabelForValue(index);
            }
          }
        }
      },
      animation: {
        duration: 750,
        easing: 'easeInOutQuart'
      }
    }
  });
}


// ===== MODALES =====
function showQuestionsInModal(clickedState, chartType, sourceData) {
    const filteredItems = sourceData.filter(item => {
        if (chartType === 'ADC') return item.Estado === clickedState && item.Documento === 'ADC';
        if (chartType === 'PAC') return item.Estado === clickedState && item.Documento === 'PAC';
        return item.Estado === clickedState;
    });

    dom.modalTitle.textContent = `${clickedState} (${filteredItems.length} items)`;
    dom.questionsList.innerHTML = '';

    const maxDisplayItems = 50;
    const itemsToShow = filteredItems.slice(0, maxDisplayItems);

    itemsToShow.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
                <div style="flex: 1;">
                    <strong>${item.ID_Corregido || item.ID}</strong> - ${item.Documento || 'N/A'}
                    <br><small style="color: var(--text-secondary);">Temática: ${item.Tematica || 'N/A'}</small>
                    <br><small style="color: var(--text-secondary);">Elaborador: ${item.Elaborador || 'N/A'}</small>
                </div>
                <span style="
                    background: ${estadoColores[item.Estado] || estadoColores.default};
                    color: ${estadoFuenteColores[item.Estado] || estadoFuenteColores.default};
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    white-space: nowrap;
                ">${item.Estado}</span>
            </div>
        `;
        dom.questionsList.appendChild(li);
    });

    if (filteredItems.length > maxDisplayItems) {
        dom.modalOverflowNote.textContent = `Mostrando ${maxDisplayItems} de ${filteredItems.length} items. Usa filtros para ver resultados más específicos.`;
        dom.modalOverflowNote.classList.remove('hidden');
    } else {
        dom.modalOverflowNote.classList.add('hidden');
    }

    showModal('questionsModal');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal.show').forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = '';
}

// ===== COMPARACIÓN DE FECHAS =====
function showComparisonView() {
    dom.comparisonContainer.classList.remove('hidden');
    dom.comparisonContainer.scrollIntoView({ behavior: 'smooth' });
    showToast('Vista de comparación activada', 'info');
}

function hideComparisonView() {
    dom.comparisonContainer.classList.add('hidden');
    showToast('Vista de comparación cerrada', 'info');
}

function executeComparison() {
    const date1 = document.getElementById('compareDate1').value;
    const date2 = document.getElementById('compareDate2').value;
    const filter = document.getElementById('comparisonFilter').value;
    
    if (!date1 || !date2) {
        showToast('Selecciona ambas fechas para comparar', 'warning');
        return;
    }
    
    if (date1 === date2) {
        showToast('Las fechas deben ser diferentes', 'warning');
        return;
    }
    
    const data1 = allRawData.filter(item => {
        const matchesDate = item.FechaReporte === date1;
        const matchesFilter = filter === 'all' || item.Documento === filter;
        return matchesDate && matchesFilter;
    });
    
    const data2 = allRawData.filter(item => {
        const matchesDate = item.FechaReporte === date2;
        const matchesFilter = filter === 'all' || item.Documento === filter;
        return matchesDate && matchesFilter;
    });
    
    const analysis1 = analyzeStates(data1);
    const analysis2 = analyzeStates(data2);
    
    displayComparisonResults(analysis1, analysis2, date1, date2, filter);
}

function displayComparisonResults(analysis1, analysis2, date1, date2, filter) {
    const results = dom.comparisonResults;
    if (!results) return;
    
    const formatDate = (dateStr) => {
        const parts = dateStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };
    
    const total1 = Object.values(analysis1.total).reduce((a, b) => a + b, 0);
    const total2 = Object.values(analysis2.total).reduce((a, b) => a + b, 0);
    const diff = total2 - total1;
    
    let html = `
        <div style="margin-bottom: 24px;">
            <h4 style="margin-bottom: 16px; color: var(--text-primary);">Comparación: ${formatDate(date1)} vs ${formatDate(date2)}</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
                <div class="comparison-stat">
                    <div style="background: var(--primary-50); border: 1px solid var(--primary-200); border-radius: 8px; padding: 16px; text-align: center;">
                        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 4px;">${formatDate(date1)}</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-600);">${total1}</div>
                    </div>
                </div>
                <div class="comparison-stat">
                    <div style="background: var(--success-50); border: 1px solid var(--success-200); border-radius: 8px; padding: 16px; text-align: center;">
                        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 4px;">${formatDate(date2)}</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--success-600);">${total2}</div>
                    </div>
                </div>
                <div class="comparison-stat">
                    <div style="background: ${diff >= 0 ? 'var(--success-50)' : 'var(--danger-50)'}; border: 1px solid ${diff >= 0 ? 'var(--success-200)' : 'var(--danger-200)'}; border-radius: 8px; padding: 16px; text-align: center;">
                        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 4px;">Diferencia</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: ${diff >= 0 ? 'var(--success-600)' : 'var(--danger-600)'};">
                            ${diff >= 0 ? '+' : ''}${diff}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Tabla de comparación detallada
    const allStates = new Set([...Object.keys(analysis1.total), ...Object.keys(analysis2.total)]);
    
    html += `
        <div style="background: var(--bg-secondary); border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color);">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--bg-tertiary);">
                        <th style="padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color);">Estado</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 1px solid var(--border-color);">${formatDate(date1)}</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 1px solid var(--border-color);">${formatDate(date2)}</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 1px solid var(--border-color);">Diferencia</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    Array.from(allStates).sort().forEach(state => {
        const count1 = analysis1.total[state] || 0;
        const count2 = analysis2.total[state] || 0;
        const stateDiff = count2 - count1;
        
        html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px; display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; background-color: ${estadoColores[state] || estadoColores.default}; border-radius: 3px;"></div>
                    ${state}
                </td>
                <td style="padding: 12px; text-align: center; font-weight: 600;">${count1}</td>
                <td style="padding: 12px; text-align: center; font-weight: 600;">${count2}</td>
                <td style="padding: 12px; text-align: center; font-weight: 600; color: ${stateDiff >= 0 ? 'var(--success-600)' : 'var(--danger-600)'};">
                    ${stateDiff >= 0 ? '+' : ''}${stateDiff}
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    
    results.innerHTML = html;
    showToast('Comparación realizada correctamente', 'success');
}

// ===== FUNCIONES DE PESTAÑAS PRINCIPALES =====
function switchMainTab(tabName) {
    document.querySelectorAll('.main-tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    document.querySelectorAll('.main-tab-content').forEach(content => content.classList.add('hidden'));
    
    const activeContent = document.getElementById(`main-tab-${tabName}`);
    if (activeContent) activeContent.classList.remove('hidden');
    
    currentMainTab = tabName;
    
    // Renderizar contenido específico al cambiar de pestaña
    switch(tabName) {
        case 'dashboard':
            // Las estadísticas y gráficos se renderizan desde analyzeAndDisplayData
            // por lo que no se necesita acción extra aquí.
            break;
        case 'roles':
            analyzeRoles(currentFilteredData);
            break;
        case 'reports':
            renderReportsSection();
            break;
    }
}

// ===== FUNCIONES DE PESTAÑAS DE SUBCONTRATOS =====
function switchTab(tabName) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    
    // Mostrar pestaña activa
    const activeContent = document.getElementById(`tab-${tabName}`);
    if (activeContent) activeContent.classList.remove('hidden');
    
    currentTab = tabName;
    
    // Renderizar contenido de la pestaña
    switch(tabName) {
        case 'overview':
            renderSubcontractOverview();
            break;
        case 'details':
            renderSubcontractDetails();
            break;
        case 'timeline':
            renderSubcontractTimeline();
            break;
    }
}

// ===== FUNCIONES DE FILTROS Y PAGINACIÓN =====
function filterDetails() {
    const searchTerm = document.getElementById('detailsSearch')?.value.toLowerCase() || '';
    const stateFilter = document.getElementById('detailsStateFilter')?.value || '';
    
    let filteredData = currentSubcontractData;
    
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            (item.Pregunta && item.Pregunta.toLowerCase().includes(searchTerm)) ||
            (item.Item && item.Item.toLowerCase().includes(searchTerm)) ||
            (item.ID && item.ID.toString().includes(searchTerm)) ||
            (item.ID_Corregido && item.ID_Corregido.toString().includes(searchTerm)) ||
            (item.Estado && item.Estado.toLowerCase().includes(searchTerm))
        );
    }
    
    if (stateFilter) {
        filteredData = filteredData.filter(item => item.Estado === stateFilter);
    }
    
    currentSubcontractData = filteredData;
    detailsPage = 1; // Reset a primera página
    renderSubcontractDetails();
}

function clearDetailsFilters() {
    document.getElementById('detailsSearch').value = '';
    document.getElementById('detailsStateFilter').value = '';
    filterDetails();
}

function changeDetailsPage(newPage) {
    const totalPages = Math.ceil(currentSubcontractData.length / detailsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
        detailsPage = newPage;
        renderSubcontractDetails();
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

// ===== FUNCIONES DE EXPORTACIÓN MEJORADAS =====

function exportToExcel() {
    if (currentFilteredData.length === 0) {
        showToast('No hay datos para exportar', 'warning');
        return;
    }
    
    try {
        // Crear workbook
        const wb = XLSX.utils.book_new();
        
        // Preparar datos para la hoja principal
        const mainData = currentFilteredData.map(item => ({
            'ID': item.ID_Corregido || item.ID,
            'Documento': item.Documento,
            'Estado': item.Estado,
            'Pregunta/Item': item.Pregunta || item.Item,
            'Temática': item.Tematica,
            'Elaborador': item.Elaborador,
            'Revisor': item.Revisor,
            'Coordinador': item.Coordinador,
            'Fecha reporte': item.FechaReporte,
            'Semana': item.Semana,
            'Subcontrato': item.Subcontrato
        }));
        
        // Crear hoja principal
        const ws = XLSX.utils.json_to_sheet(mainData);
        
        // Ajustar ancho de columnas
        const colWidths = [
            { wch: 10 }, // ID
            { wch: 8 },  // Documento
            { wch: 20 }, // Estado
            { wch: 50 }, // Pregunta/Item
            { wch: 20 }, // Temática
            { wch: 20 }, // Elaborador
            { wch: 20 }, // Revisor
            { wch: 20 }, // Coordinador
            { wch: 12 }, // Fecha
            { wch: 8 },  // Semana
            { wch: 25 }  // Subcontrato
        ];
        ws['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(wb, ws, 'Datos Principales');
        
        // Crear hoja de resumen
        const summaryData = [
            ['Total de Items', currentFilteredData.length],
            ['Items ADC', currentFilteredData.filter(item => item.Documento === 'ADC').length],
            ['Items PAC', currentFilteredData.filter(item => item.Documento === 'PAC').length],
            [''],
            ['Distribución por Estado', '']
        ];
        
        // Agregar distribución por estado
        const stateAnalysis = analyzeStates(currentFilteredData);
        Object.entries(stateAnalysis.total).forEach(([estado, cantidad]) => {
            summaryData.push([estado, cantidad]);
        });
        
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        summaryWs['!cols'] = [{ wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumen');
        
        // Generar nombre de archivo
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const fileName = `Reporte_ADC_${dateStr}.xlsx`;
        
        // Descargar archivo
        XLSX.writeFile(wb, fileName);
        
        showToast('Archivo Excel descargado correctamente', 'success');
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        
        // Fallback: exportar como CSV
        exportToCSV();
    }
}

function exportToCSV() {
    if (currentFilteredData.length === 0) {
        showToast('No hay datos para exportar', 'warning');
        return;
    }
    
    try {
        const csvData = [
            ['ID', 'Documento', 'Estado', 'Pregunta/Item', 'Temática', 'Elaborador', 'Revisor', 'Coordinador', 'Fecha Reporte', 'Semana', 'Subcontrato']
        ];
        
        currentFilteredData.forEach(item => {
            csvData.push([
                item.ID_Corregido || item.ID,
                item.Documento,
                item.Estado,
                (item.Pregunta || item.Item || '').replace(/,/g, ';'), // Escapar comas
                item.Tematica,
                item.Elaborador,
                item.Revisor,
                item.Coordinador,
                item.FechaReporte,
                item.Semana,
                item.Subcontrato
            ]);
        });
        
        const csvContent = csvData.map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        const today = new Date().toISOString().split('T')[0];
        link.download = `Reporte_ADC_${today}.csv`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        showToast('Archivo CSV descargado correctamente', 'success');
    } catch (error) {
        console.error('Error al exportar CSV:', error);
        showToast('Error al exportar los datos', 'error');
    }
}

function exportSubcontractToExcel() {
    if (!currentSubcontractData || currentSubcontractData.length === 0) {
        showToast('No hay datos del subcontrato para exportar', 'warning');
        return;
    }
    
    try {
        const wb = XLSX.utils.book_new();
        
        // Preparar datos del subcontrato
        const subcontractExportData = currentSubcontractData.map(item => ({
            'ID': item.ID_Corregido || item.ID,
            'Documento': item.Documento,
            'Estado': item.Estado,
            'Pregunta/Item': item.Pregunta || item.Item,
            'Temática': item.Tematica,
            'Elaborador': item.Elaborador,
            'Revisor': item.Revisor,
            'Coordinador': item.Coordinador,
            'Fecha Reporte': item.FechaReporte,
            'Semana': item.Semana
        }));
        
        const ws = XLSX.utils.json_to_sheet(subcontractExportData);
        
        // Ajustar ancho de columnas
        ws['!cols'] = [
            { wch: 10 }, // ID
            { wch: 8 },  // Documento
            { wch: 20 }, // Estado
            { wch: 50 }, // Pregunta/Item
            { wch: 20 }, // Temática
            { wch: 20 }, // Elaborador
            { wch: 20 }, // Revisor
            { wch: 20 }, // Coordinador
            { wch: 12 }, // Fecha
            { wch: 8 }  // Semana
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, currentSubcontractName.substring(0, 31)); // Límite de 31 caracteres para nombres de hoja
        
        const today = new Date().toISOString().split('T')[0];
        const fileName = `Subcontrato_${currentSubcontractName.replace(/[^a-zA-Z0-9]/g, '_')}_${today}.xlsx`;
        
        XLSX.writeFile(wb, fileName);
        
        showToast('Subcontrato exportado a Excel correctamente', 'success');
    } catch (error) {
        console.error('Error al exportar subcontrato:', error);
        showToast('Error al exportar el subcontrato', 'error');
    }
}

function printReport() {
    window.print();
}

function refreshSubcontractView() {
    applyAllFiltersAndAnalyze();
    showToast('Vista actualizada', 'success');
}

function clearAllData() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
        allRawData = [];
        currentFilteredData = [];
        localStorage.removeItem('adcReportData_v3');
        
        clearDisplayElements();
        dom.analysisContainer.classList.add('hidden');
        dom.subcontractView.classList.add('hidden');
        dom.noDataMessage.classList.remove('hidden');
        
        populateStaticSelectors();
        updateDynamicSelectors();
        disableFilterControls();
        
        dom.fileNameDisplay.innerHTML = '<i class="fas fa-info-circle"></i><span>Ningún archivo seleccionado</span>';
        
        showToast('Todos los datos han sido eliminados', 'success');
    }
}

// ===== FUNCIONES DE VISTA =====
function switchStatsView(view) {
    const buttons = document.querySelectorAll('.section-header[data-section="stats"] .view-toggle');
    const statsContainer = document.getElementById('statsGrid');

    if (!statsContainer) return;

    // 1. Actualizar el estado de los botones (esto ya lo tenías)
    buttons.forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`.section-header[data-section="stats"] [data-view="${view}"]`);
    if (activeButton) activeButton.classList.add('active');
    
    // 2. (LÓGICA AÑADIDA) Cambiar la clase del contenedor de estadísticas
    if (view === 'list') {
        statsContainer.classList.add('list-view');
    } else {
        statsContainer.classList.remove('list-view');
    }

}

// ===== INICIO: CÓDIGO A REEMPLAZAR =====

function switchChartsView(view) {
    const buttons = document.querySelectorAll('.section-header[data-section="charts"] .view-toggle');
    const chartsContainer = document.getElementById('chartsContainer');

    if (!chartsContainer) return;

    // 1. Actualizar botones
    buttons.forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`.section-header[data-section="charts"] [data-view="${view}"]`);
    if (activeButton) activeButton.classList.add('active');
    
    // 2. (LÓGICA AÑADIDA) Cambiar la clase del contenedor de gráficos
    if (view === 'carousel') {
        chartsContainer.classList.add('carousel-view');
    } else {
        chartsContainer.classList.remove('carousel-view');
    }

}

// ===== FIN: CÓDIGO A REEMPLAZAR =====


function downloadChart(chartId) {
    const canvas = document.getElementById(chartId);
    const chartCard = canvas?.closest('.chart-card');
    if (!canvas || !chartCard) {
        showToast('Error: No se pudo encontrar el gráfico', 'error');
        return;
    }
    
    // Crear un canvas temporal más grande
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    // Dimensiones del canvas final
    const padding = 40;
    const titleHeight = 60;
    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    
    // Obtener datos de la tabla
    const table = chartCard.querySelector('.chart-legend-table');
    const tableRows = table ? table.querySelectorAll('tbody tr') : [];
    const tableHeight = tableRows.length > 0 ? (tableRows.length * 30) + 80 : 0;
    
    // Configurar canvas temporal
    tempCanvas.width = chartWidth + (padding * 2);
    tempCanvas.height = titleHeight + chartHeight + tableHeight + (padding * 3);
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Título
    const title = chartCard.querySelector('h3')?.textContent || 'Gráfico';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, tempCanvas.width / 2, 35);
    
    // Línea separadora
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, titleHeight - 10);
    ctx.lineTo(tempCanvas.width - padding, titleHeight - 10);
    ctx.stroke();
    
    // Dibujar gráfico
    ctx.drawImage(canvas, padding, titleHeight, chartWidth, chartHeight);
    
    // Dibujar tabla si existe
    if (tableRows.length > 0) {
        const tableStartY = titleHeight + chartHeight + padding;
        
        // Título de la tabla
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Distribución detallada:', padding, tableStartY);
        
        // Headers de la tabla
        const headerY = tableStartY + 30;
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(padding, headerY, tempCanvas.width - (padding * 2), 25);
        
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('Estado', padding + 10, headerY + 16);
        ctx.fillText('Cantidad', padding + 200, headerY + 16);
        ctx.fillText('Porcentaje', padding + 300, headerY + 16);
        
        // Filas de la tabla
        tableRows.forEach((row, index) => {
            const rowY = headerY + 25 + (index * 25);
            const cells = row.querySelectorAll('td');
            
            if (index % 2 === 0) {
                ctx.fillStyle = '#f9fafb';
                ctx.fillRect(padding, rowY, tempCanvas.width - (padding * 2), 25);
            }
            
            ctx.fillStyle = '#1f2937';
            ctx.font = '12px Inter, sans-serif';
            
            if (cells.length >= 3) {
                const estado = cells[0].textContent.trim();
                const cantidad = cells[1].textContent.trim();
                const porcentaje = cells[2].textContent.trim();
                
                // Color del estado
                const colorBox = cells[0].querySelector('div');
                if (colorBox) {
                    const bgColor = colorBox.style.backgroundColor;
                    ctx.fillStyle = bgColor || '#9ca3af';
                    ctx.fillRect(padding + 10, rowY + 8, 12, 12);
                }
                
                ctx.fillStyle = '#1f2937';
                ctx.fillText(estado, padding + 30, rowY + 16);
                ctx.fillText(cantidad, padding + 200, rowY + 16);
                ctx.fillText(porcentaje, padding + 300, rowY + 16);
            }
        });
    }
    
    // Fecha y hora de generación
    const now = new Date();
    const dateStr = now.toLocaleString('es-ES');
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Generado el: ${dateStr}`, tempCanvas.width - padding, tempCanvas.height - 10);
    
    // Descargar imagen
    const link = document.createElement('a');
    const chartType = chartId.replace('chart', '').toLowerCase();
    link.download = `reporte-${chartType}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = tempCanvas.toDataURL('image/png', 1.0);
    link.click();
    
    showToast('Reporte completo descargado', 'success');
}

// ===== FUNCIONES PARA COPIAR GRÁFICOS AL PORTAPAPELES =====
async function copyChartToClipboard(chartId) {
    try {
        const canvas = document.getElementById(chartId);
        const chartCard = canvas?.closest('.chart-card');
        if (!canvas || !chartCard) {
            showToast('Error: No se pudo encontrar el gráfico', 'error');
            return;
        }

        // Crear canvas temporal para la imagen completa (igual que downloadChart)
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        
        const padding = 40;
        const titleHeight = 60;
        const chartWidth = canvas.width;
        const chartHeight = canvas.height;
        
        // Obtener datos de la tabla
        const table = chartCard.querySelector('.chart-legend-table');
        const tableRows = table ? table.querySelectorAll('tbody tr') : [];
        const tableHeight = tableRows.length > 0 ? (tableRows.length * 30) + 80 : 0;
        
        // Configurar canvas temporal
        tempCanvas.width = chartWidth + (padding * 2);
        tempCanvas.height = titleHeight + chartHeight + tableHeight + (padding * 3);
        
        // Fondo blanco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Título
        const title = chartCard.querySelector('h3')?.textContent || 'Gráfico';
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, tempCanvas.width / 2, 35);
        
        // Línea separadora
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, titleHeight - 10);
        ctx.lineTo(tempCanvas.width - padding, titleHeight - 10);
        ctx.stroke();
        
        // Dibujar gráfico
        ctx.drawImage(canvas, padding, titleHeight, chartWidth, chartHeight);
        
        // Dibujar tabla si existe
        if (tableRows.length > 0) {
            const tableStartY = titleHeight + chartHeight + padding;
            
            // Título de la tabla
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Distribución detallada:', padding, tableStartY);
            
            // Headers de la tabla
            const headerY = tableStartY + 30;
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(padding, headerY, tempCanvas.width - (padding * 2), 25);
            
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillText('Estado', padding + 10, headerY + 16);
            ctx.fillText('Cantidad', padding + 200, headerY + 16);
            ctx.fillText('Porcentaje', padding + 300, headerY + 16);
            
            // Filas de la tabla
            tableRows.forEach((row, index) => {
                const rowY = headerY + 25 + (index * 25);
                const cells = row.querySelectorAll('td');
                
                if (index % 2 === 0) {
                    ctx.fillStyle = '#f9fafb';
                    ctx.fillRect(padding, rowY, tempCanvas.width - (padding * 2), 25);
                }
                
                ctx.fillStyle = '#1f2937';
                ctx.font = '12px Inter, sans-serif';
                
                if (cells.length >= 3) {
                    const estado = cells[0].textContent.trim();
                    const cantidad = cells[1].textContent.trim();
                    const porcentaje = cells[2].textContent.trim();
                    
                    ctx.fillText(estado, padding + 30, rowY + 16);
                    ctx.fillText(cantidad, padding + 200, rowY + 16);
                    ctx.fillText(porcentaje, padding + 300, rowY + 16);
                }
            });
        }
        
        // Fecha y hora de generación
        const now = new Date();
        const dateStr = now.toLocaleString('es-ES');
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`Generado el: ${dateStr}`, tempCanvas.width - padding, tempCanvas.height - 10);

        // Convertir a blob y copiar al portapapeles
        tempCanvas.toBlob(async (blob) => {
            try {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                
                const chartType = title || chartId;
                showToast(`Gráfico "${chartType}" copiado al portapapeles`, 'success');
            } catch (err) {
                console.error('Error al copiar al portapapeles:', err);
                // Fallback: descargar si no se puede copiar
                const link = document.createElement('a');
                const chartType = chartId.replace('chart', '').toLowerCase();
                link.download = `grafico-${chartType}-${new Date().toISOString().split('T')[0]}.png`;
                link.href = tempCanvas.toDataURL();
                link.click();
                showToast('No se pudo copiar, se descargó en su lugar', 'warning');
            }
        }, 'image/png');
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al procesar el gráfico', 'error');
    }
}

async function copyAllChartsToClipboard() {
    const chartIds = ['chartTotal', 'chartADC', 'chartPAC'];
    let copiedCount = 0;
    
    showToast('Copiando los 3 gráficos al portapapeles...', 'info');
    
    for (let i = 0; i < chartIds.length; i++) {
        const chartId = chartIds[i];
        try {
            await copyChartToClipboard(chartId);
            copiedCount++;
            
            // Esperar entre copias para evitar problemas
            if (i < chartIds.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error(`Error copiando ${chartId}:`, error);
        }
    }
    
    if (copiedCount === 3) {
        showToast('Los 3 gráficos han sido copiados al portapapeles exitosamente', 'success');
    } else {
        showToast(`${copiedCount} de 3 gráficos copiados exitosamente`, 'warning');
    }
}

function toggleChartTable(chartType) {
    const table = document.getElementById(`legend${chartType}`);
    if (!table) return;
    
    table.style.display = table.style.display === 'none' ? 'table' : 'none';
    showToast(`Tabla ${table.style.display === 'none' ? 'oculta' : 'mostrada'}`, 'info');
}

// ===== FUNCIONES DE LOADER =====
function showGlobalLoader(message = 'Cargando...') {
    if (dom.globalLoader) {
        dom.globalLoader.querySelector('p').textContent = message;
        dom.globalLoader.classList.remove('hidden');
    }
}

function hideGlobalLoader() {
    if (dom.globalLoader) {
        dom.globalLoader.classList.add('hidden');
    }
}

// ===== SECCIÓN DE REPORTES =====
function renderReportsSection() {
    const container = document.getElementById('reportStatsContainer');
    if (!container) return;
    
    const stats = generateReportStats();
    
    container.innerHTML = `
        <div class="report-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div class="stat-item">
                <h4>Total de Items</h4>
                <div class="stat-number">${stats.total}</div>
            </div>
            <div class="stat-item">
                <h4>Completados</h4>
                <div class="stat-number">${stats.completed}</div>
            </div>
            <div class="stat-item">
                <h4>En Progreso</h4>
                <div class="stat-number">${stats.inProgress}</div>
            </div>
            <div class="stat-item">
                <h4>% Completado</h4>
                <div class="stat-number">${stats.completionRate}%</div>
            </div>
        </div>
    `;
}

function generateReportStats() {
    const total = currentFilteredData.length;
    const completed = currentFilteredData.filter(item => item.Estado === 'Incorporada').length;
    const inProgress = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, inProgress, completionRate };
}

function exportDetailedReport() {
    showToast('Generando reporte detallado...', 'info');
    enhancedExportToExcel();
}

function generateExecutiveReport() {
    showToast('Generando reporte ejecutivo...', 'info');
    
    if (!currentFilteredData || currentFilteredData.length === 0) {
        showToast('No hay datos para generar el reporte', 'warning');
        return;
    }
    
    const reportData = generateExecutiveReportData();
    const reportWindow = window.open('', '_blank');
    
    const reportHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte Ejecutivo - Adenda Complementaria</title>
            <style>
                ${getExecutiveReportStyles()}
            </style>
        </head>
        <body>
            ${generateExecutiveReportHTML(reportData)}
            <script>
                // Función para imprimir automáticamente
                window.onload = function() {
                    // window.print();
                };
            </script>
        </body>
        </html>
    `;
    
    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
    
    showToast('Reporte ejecutivo generado exitosamente', 'success');
}

// ===== FUNCIONES DE REPORTE EJECUTIVO =====
function generateExecutiveReportData() {
    const fechaEntregaFinal = new Date('2024-08-29');
    const hoy = new Date();
    const semanasRestantes = Math.ceil((fechaEntregaFinal - hoy) / (1000 * 60 * 60 * 24 * 7));
    
    // Solo contar elementos en línea editorial e incorporados
    const elementosEnLineaEditorial = currentFilteredData.filter(item => 
        item.Estado === 'En revisor editorial' || item.Estado === 'Incorporada'
    );
    
    const totalPreguntas = 494; // Total que debe entregarse
    const preguntasIncorporadas = currentFilteredData.filter(item => item.Estado === 'Incorporada').length;
    const preguntasEnLineaEditorial = currentFilteredData.filter(item => item.Estado === 'En revisor editorial').length;
    const preguntasPendientes = totalPreguntas - preguntasIncorporadas;
    
    // Cálculo de entregas semanales requeridas
    const entregasSemanalesRequeridas = semanasRestantes > 0 ? Math.ceil(preguntasPendientes / semanasRestantes) : preguntasPendientes;
    
    // Análisis por persona y rol
    const analisisPorPersona = generatePersonRoleAnalysis();
    
    // Análisis de tendencias semanales
    const tendenciasSemanales = analyzeTendenciasSemanales();
    
    // Identificar cuellos de botella
    const cuellosDeBottella = identifyCuellosDeBottella();
    
    // Riesgos y recomendaciones
    const riesgosYRecomendaciones = generateRiesgosYRecomendaciones(
        preguntasPendientes, 
        entregasSemanalesRequeridas, 
        semanasRestantes,
        tendenciasSemanales
    );
    
    return {
        fechaReporte: new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        fechaEntregaFinal: fechaEntregaFinal.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        semanasRestantes,
        totalPreguntas,
        preguntasIncorporadas,
        preguntasEnLineaEditorial,
        preguntasPendientes,
        entregasSemanalesRequeridas,
        porcentajeCompletado: Math.round((preguntasIncorporadas / totalPreguntas) * 100),
        porcentajeEnLinea: Math.round(((preguntasIncorporadas + preguntasEnLineaEditorial) / totalPreguntas) * 100),
        analisisPorPersona,
        tendenciasSemanales,
        cuellosDeBottella,
        riesgosYRecomendaciones,
        estadisticasGenerales: generateEstadisticasGenerales()
    };
}

function generatePersonRoleAnalysis() {
    const personasRoles = {};
    
    currentFilteredData.forEach(item => {
        const estado = item.Estado;
        
        // Análisis por elaborador (solo para estados de elaboración)
        if (item.Elaborador) {
            if (!personasRoles[item.Elaborador]) {
                personasRoles[item.Elaborador] = {
                    elaborador: {},
                    revisor: {},
                    coordinador: {},
                    total: 0
                };
            }
            
            // Contar como elaborador cuando está en estados de elaboración
            if (estado === 'En elaboración' || estado === 'En elaboración de cartografía') {
                if (!personasRoles[item.Elaborador].elaborador[estado]) {
                    personasRoles[item.Elaborador].elaborador[estado] = 0;
                }
                personasRoles[item.Elaborador].elaborador[estado]++;
                personasRoles[item.Elaborador].total++;
            }
        }
        
        // Análisis por revisor (cuando está en estados de revisión)
        if (item.Revisor) {
            if (!personasRoles[item.Revisor]) {
                personasRoles[item.Revisor] = {
                    elaborador: {},
                    revisor: {},
                    coordinador: {},
                    total: 0
                };
            }
            
            // Contar como revisor cuando está en estados de revisión
            if (estado === 'En revisor técnico' || estado === 'En revisor editorial') {
                if (!personasRoles[item.Revisor].revisor[estado]) {
                    personasRoles[item.Revisor].revisor[estado] = 0;
                }
                personasRoles[item.Revisor].revisor[estado]++;
                personasRoles[item.Revisor].total++;
            }
            
            // Contar como coordinador cuando está en coordinación
            if (estado === 'En coordinador') {
                if (!personasRoles[item.Revisor].coordinador[estado]) {
                    personasRoles[item.Revisor].coordinador[estado] = 0;
                }
                personasRoles[item.Revisor].coordinador[estado]++;
                personasRoles[item.Revisor].total++;
            }
        }
        
        // Contar incorporadas para quien corresponde
        if (estado === 'Incorporada') {
            // Asignar a elaborador si no hay revisor específico
            const persona = item.Revisor || item.Elaborador;
            if (persona) {
                if (!personasRoles[persona]) {
                    personasRoles[persona] = {
                        elaborador: {},
                        revisor: {},
                        coordinador: {},
                        total: 0
                    };
                }
                
                if (!personasRoles[persona].revisor[estado]) {
                    personasRoles[persona].revisor[estado] = 0;
                }
                personasRoles[persona].revisor[estado]++;
                personasRoles[persona].total++;
            }
        }
    });
    
    return personasRoles;
}

function analyzeTendenciasSemanales() {
    const tendencias = {};
    const semanas = {};
    
    // Agrupar por semana
    currentFilteredData.forEach(item => {
        const semana = item.Semana;
        if (!semanas[semana]) {
            semanas[semana] = {
                total: 0,
                incorporadas: 0,
                enLineaEditorial: 0
            };
        }
        
        semanas[semana].total++;
        if (item.Estado === 'Incorporada') semanas[semana].incorporadas++;
        if (item.Estado === 'En revisor editorial') semanas[semana].enLineaEditorial++;
    });
    
    const semanasOrdenadas = Object.keys(semanas).sort((a, b) => parseInt(a) - parseInt(b));
    
    // Calcular tendencias
    if (semanasOrdenadas.length >= 2) {
        const ultimasSemanas = semanasOrdenadas.slice(-4); // Últimas 4 semanas
        let promedioIncorporadas = 0;
        let promedioEnLinea = 0;
        
        ultimasSemanas.forEach(semana => {
            promedioIncorporadas += semanas[semana].incorporadas;
            promedioEnLinea += semanas[semana].enLineaEditorial;
        });
        
        promedioIncorporadas = promedioIncorporadas / ultimasSemanas.length;
        promedioEnLinea = promedioEnLinea / ultimasSemanas.length;
        
        tendencias = {
            promedioSemanalIncorporadas: Math.round(promedioIncorporadas * 10) / 10,
            promedioSemanalEnLinea: Math.round(promedioEnLinea * 10) / 10,
            ultimasSemanas: ultimasSemanas.map(semana => ({
                semana: parseInt(semana),
                incorporadas: semanas[semana].incorporadas,
                enLineaEditorial: semanas[semana].enLineaEditorial,
                total: semanas[semana].total
            }))
        };
    }
    
    return tendencias;
}

function identifyCuellosDeBottella() {
    const estados = {};
    const elaboradores = {};
    
    // Contar por estado
    currentFilteredData.forEach(item => {
        if (!estados[item.Estado]) estados[item.Estado] = 0;
        estados[item.Estado]++;
        
        // Contar por elaborador con estados pendientes
        if (item.Estado !== 'Incorporada' && item.Elaborador) {
            if (!elaboradores[item.Elaborador]) elaboradores[item.Elaborador] = 0;
            elaboradores[item.Elaborador]++;
        }
    });
    
    // Identificar cuellos de botella
    const estadoMasCongestionado = Object.entries(estados)
        .filter(([estado]) => estado !== 'Incorporada')
        .sort(([,a], [,b]) => b - a)[0];
    
    const elaboradorMasCargado = Object.entries(elaboradores)
        .sort(([,a], [,b]) => b - a)[0];
    
    return {
        estadoMasCongestionado: estadoMasCongestionado ? {
            estado: estadoMasCongestionado[0],
            cantidad: estadoMasCongestionado[1]
        } : null,
        elaboradorMasCargado: elaboradorMasCargado ? {
            elaborador: elaboradorMasCargado[0],
            pendientes: elaboradorMasCargado[1]
        } : null,
        distribucionEstados: estados,
        distribucionElaboradores: elaboradores
    };
}

function generateRiesgosYRecomendaciones(pendientes, semanalesRequeridas, semanasRestantes, tendencias) {
    const riesgos = [];
    const recomendaciones = [];
    
    // Análisis de riesgo por tiempo
    if (semanasRestantes <= 4) {
        riesgos.push({
            nivel: 'CRÍTICO',
            descripcion: `Solo quedan ${semanasRestantes} semanas hasta la entrega final`,
            impacto: 'Alto riesgo de incumplimiento de cronograma'
        });
    } else if (semanasRestantes <= 8) {
        riesgos.push({
            nivel: 'ALTO',
            descripcion: `Tiempo limitado: ${semanasRestantes} semanas restantes`,
            impacto: 'Presión temporal significativa en el equipo'
        });
    }
    
    // Análisis de riesgo por capacidad de entrega
    if (tendencias.promedioSemanalIncorporadas && semanalesRequeridas > tendencias.promedioSemanalIncorporadas * 1.5) {
        riesgos.push({
            nivel: 'ALTO',
            descripcion: `Se requieren ${semanalesRequeridas} entregas semanales vs ${tendencias.promedioSemanalIncorporadas} promedio actual`,
            impacto: 'Capacidad insuficiente para cumplir cronograma'
        });
        
        recomendaciones.push({
            prioridad: 'ALTA',
            accion: 'Incrementar recursos de revisión editorial',
            justificacion: 'La capacidad actual es insuficiente para los requerimientos'
        });
    }
    
    // Recomendaciones generales
    if (pendientes > 100) {
        recomendaciones.push({
            prioridad: 'MEDIA',
            accion: 'Implementar revisiones paralelas',
            justificacion: 'Reducir dependencias secuenciales en el proceso'
        });
    }
    
    recomendaciones.push({
        prioridad: 'ALTA',
        accion: 'Monitoreo semanal intensivo',
        justificacion: 'Seguimiento cercano para detectar desvíos temprano'
    });
    
    return { riesgos, recomendaciones };
}

function generateEstadisticasGenerales() {
    const tematicas = {};
    const documentos = {};
    
    currentFilteredData.forEach(item => {
        // Por temática
        if (item.Tematica) {
            if (!tematicas[item.Tematica]) tematicas[item.Tematica] = { total: 0, incorporadas: 0 };
            tematicas[item.Tematica].total++;
            if (item.Estado === 'Incorporada') tematicas[item.Tematica].incorporadas++;
        }
        
        // Por documento
        if (item.Documento) {
            if (!documentos[item.Documento]) documentos[item.Documento] = { total: 0, incorporadas: 0 };
            documentos[item.Documento].total++;
            if (item.Estado === 'Incorporada') documentos[item.Documento].incorporadas++;
        }
    });
    
    return { tematicas, documentos };
}

function generateExecutiveReportHTML(data) {
    return `
        <div class="executive-report">
            <!-- Header del reporte -->
            <header class="report-header">
                <div class="header-content">
                    <h1>Reporte Ejecutivo</h1>
                    <h2>Adenda Complementaria - Estado de Avance</h2>
                    <div class="report-meta">
                        <p><strong>Fecha del Reporte:</strong> ${data.fechaReporte}</p>
                        <p><strong>Fecha Límite de Entrega:</strong> ${data.fechaEntregaFinal}</p>
                        <p><strong>Semanas Restantes:</strong> ${data.semanasRestantes}</p>
                    </div>
                </div>
                <div class="header-metrics">
                    <div class="metric ${data.porcentajeCompletado >= 80 ? 'success' : data.porcentajeCompletado >= 60 ? 'warning' : 'danger'}">
                        <span class="metric-value">${data.porcentajeCompletado}%</span>
                        <span class="metric-label">Completado</span>
                    </div>
                    <div class="metric info">
                        <span class="metric-value">${data.preguntasIncorporadas}</span>
                        <span class="metric-label">de ${data.totalPreguntas}</span>
                    </div>
                </div>
            </header>

            <!-- Resumen Ejecutivo -->
            <section class="executive-summary">
                <h3>🎯 Resumen Ejecutivo</h3>
                <div class="summary-grid">
                    <div class="summary-card ${data.porcentajeCompletado >= 75 ? 'success' : 'warning'}">
                        <h4>Estado General del Proyecto</h4>
                        <p>Se han incorporado <strong>${data.preguntasIncorporadas} de ${data.totalPreguntas} preguntas</strong> (${data.porcentajeCompletado}% completado). 
                        Con ${data.preguntasEnLineaEditorial} preguntas en línea editorial, el avance total en etapas finales es del ${data.porcentajeEnLinea}%.</p>
                        
                        <div class="critical-metrics">
                            <div class="metric-row">
                                <span>Preguntas Pendientes:</span>
                                <strong class="${data.preguntasPendientes > 100 ? 'danger' : 'warning'}">${data.preguntasPendientes}</strong>
                            </div>
                            <div class="metric-row">
                                <span>Entregas Semanales Requeridas:</span>
                                <strong class="${data.entregasSemanalesRequeridas > 25 ? 'danger' : 'warning'}">${data.entregasSemanalesRequeridas}</strong>
                            </div>
                            <div class="metric-row">
                                <span>Tiempo Restante:</span>
                                <strong class="${data.semanasRestantes <= 4 ? 'danger' : 'warning'}">${data.semanasRestantes} semanas</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Análisis Crítico -->
            <section class="critical-analysis">
                <h3>⚠️ Análisis Crítico</h3>
                
                <!-- Cuellos de Botella -->
                <div class="analysis-section">
                    <h4>Cuellos de Botella Identificados</h4>
                    ${data.cuellosDeBottella.estadoMasCongestionado ? `
                        <div class="bottleneck-alert">
                            <strong>Estado más congestionado:</strong> ${data.cuellosDeBottella.estadoMasCongestionado.estado} 
                            (${data.cuellosDeBottella.estadoMasCongestionado.cantidad} preguntas)
                        </div>
                    ` : ''}
                    
                    ${data.cuellosDeBottella.elaboradorMasCargado ? `
                        <div class="bottleneck-alert">
                            <strong>Elaborador con mayor carga:</strong> ${data.cuellosDeBottella.elaboradorMasCargado.elaborador} 
                            (${data.cuellosDeBottella.elaboradorMasCargado.pendientes} pendientes)
                        </div>
                    ` : ''}
                </div>

                <!-- Riesgos -->
                <div class="analysis-section">
                    <h4>Riesgos Identificados</h4>
                    <div class="risks-container">
                        ${data.riesgosYRecomendaciones.riesgos.map(riesgo => `
                            <div class="risk-item ${riesgo.nivel.toLowerCase()}">
                                <div class="risk-level">${riesgo.nivel}</div>
                                <div class="risk-content">
                                    <p><strong>${riesgo.descripcion}</strong></p>
                                    <p class="risk-impact">${riesgo.impacto}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Recomendaciones -->
                <div class="analysis-section">
                    <h4>Recomendaciones Estratégicas</h4>
                    <div class="recommendations-container">
                        ${data.riesgosYRecomendaciones.recomendaciones.map((rec, index) => `
                            <div class="recommendation-item priority-${rec.prioridad.toLowerCase()}">
                                <div class="rec-number">${index + 1}</div>
                                <div class="rec-content">
                                    <h5>${rec.accion}</h5>
                                    <p>${rec.justificacion}</p>
                                    <span class="priority-badge ${rec.prioridad.toLowerCase()}">${rec.prioridad}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- Análisis por Persona y Rol -->
            <section class="person-analysis">
                <h3>👥 Análisis por Persona y Rol</h3>
                <div class="person-grid">
                    ${Object.entries(data.analisisPorPersona).map(([persona, roles]) => `
                        <div class="person-card">
                            <h4>${persona}</h4>
                            
                            ${Object.keys(roles.elaborador).length > 0 ? `
                                <div class="role-section">
                                    <h5>Como Elaborador:</h5>
                                    <ul>
                                        ${Object.entries(roles.elaborador).map(([estado, cantidad]) => `
                                            <li><span class="estado-tag ${estado.replace(/\s+/g, '-').toLowerCase()}">${estado}</span>: ${cantidad}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${Object.keys(roles.revisor).length > 0 ? `
                                <div class="role-section">
                                    <h5>Como Revisor:</h5>
                                    <ul>
                                        ${Object.entries(roles.revisor).map(([estado, cantidad]) => `
                                            <li><span class="estado-tag ${estado.replace(/\s+/g, '-').toLowerCase()}">${estado}</span>: ${cantidad}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${Object.keys(roles.coordinador).length > 0 ? `
                                <div class="role-section">
                                    <h5>Como Coordinador:</h5>
                                    <ul>
                                        ${Object.entries(roles.coordinador).map(([estado, cantidad]) => `
                                            <li><span class="estado-tag ${estado.replace(/\s+/g, '-').toLowerCase()}">${estado}</span>: ${cantidad}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            <div class="person-total">
                                <strong>Total asociado: ${roles.total} preguntas</strong>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Tendencias Semanales -->
            ${data.tendenciasSemanales.ultimasSemanas ? `
                <section class="trends-analysis">
                    <h3>📈 Análisis de Tendencias Semanales</h3>
                    <div class="trends-summary">
                        <p><strong>Promedio semanal de incorporaciones:</strong> ${data.tendenciasSemanales.promedioSemanalIncorporadas} preguntas</p>
                        <p><strong>Promedio semanal en línea editorial:</strong> ${data.tendenciasSemanales.promedioSemanalEnLinea} preguntas</p>
                        
                        <div class="weekly-trend">
                            <h4>Últimas Semanas:</h4>
                            <table class="trends-table">
                                <thead>
                                    <tr>
                                        <th>Semana</th>
                                        <th>Incorporadas</th>
                                        <th>En Línea Editorial</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.tendenciasSemanales.ultimasSemanas.map(semana => `
                                        <tr>
                                            <td>Semana ${semana.semana}</td>
                                            <td class="success">${semana.incorporadas}</td>
                                            <td class="warning">${semana.enLineaEditorial}</td>
                                            <td>${semana.total}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            ` : ''}

            <!-- Proyección y Conclusiones -->
            <section class="conclusions">
                <h3>📊 Proyección y Conclusiones</h3>
                <div class="projection-analysis">
                    <div class="projection-card ${data.entregasSemanalesRequeridas > (data.tendenciasSemanales.promedioSemanalIncorporadas || 10) ? 'danger' : 'success'}">
                        <h4>Viabilidad del Cronograma</h4>
                        <p>Para cumplir con la fecha límite del <strong>${data.fechaEntregaFinal}</strong>, 
                        se requiere incorporar <strong>${data.entregasSemanalesRequeridas} preguntas por semana</strong> 
                        durante las próximas ${data.semanasRestantes} semanas.</p>
                        
                        ${data.tendenciasSemanales.promedioSemanalIncorporadas ? `
                            <p>Considerando el promedio actual de <strong>${data.tendenciasSemanales.promedioSemanalIncorporadas} 
                            incorporaciones semanales</strong>, 
                            ${data.entregasSemanalesRequeridas > data.tendenciasSemanalIncorporadas ? 
                                `<span class="danger">se requiere un incremento del ${Math.round(((data.entregasSemanalesRequeridas / data.tendenciasSemanalIncorporadas) - 1) * 100)}% en la capacidad actual.</span>` :
                                `<span class="success">el ritmo actual es suficiente para cumplir el cronograma.</span>`
                            }</p>
                        ` : ''}
                    </div>
                </div>

                <div class="final-recommendations">
                    <h4>Conclusiones Finales</h4>
                    <ol>
                        <li><strong>Estado del Proyecto:</strong> ${
                            data.porcentajeCompletado >= 80 ? 'Proyecto en excelente estado, mantener ritmo actual.' :
                            data.porcentajeCompletado >= 60 ? 'Proyecto en estado satisfactorio, pero requiere aceleración.' :
                            'Proyecto en estado crítico, requiere intervención inmediata.'
                        }</li>
                        <li><strong>Capacidad vs Demanda:</strong> ${
                            data.entregasSemanalesRequeridas <= (data.tendenciasSemanales.promedioSemanalIncorporadas || 0) * 1.2 ?
                            'La capacidad actual puede absorber la demanda requerida.' :
                            'Se requiere incremento significativo en recursos o redefinición de alcance.'
                        }</li>
                        <li><strong>Riesgo General:</strong> ${
                            data.semanasRestantes >= 8 && data.porcentajeCompletado >= 60 ? 'BAJO' :
                            data.semanasRestantes >= 4 && data.porcentajeCompletado >= 40 ? 'MEDIO' :
                            'ALTO'
                        } - ${
                            data.semanasRestantes <= 4 ? 'Tiempo crítico para la entrega.' :
                            'Tiempo suficiente con gestión adecuada.'
                        }</li>
                    </ol>
                </div>
            </section>

            <!-- Footer -->
            <footer class="report-footer">
                <p>Reporte generado automáticamente el ${data.fechaReporte}</p>
                <p>Sistema de Seguimiento de Adenda Complementaria</p>
            </footer>
        </div>
    `;
}

function getExecutiveReportStyles() {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .executive-report {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px;
            background: white;
        }
        
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            margin-bottom: 40px;
        }
        
        .header-content h1 {
            font-size: 2.5rem;
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .header-content h2 {
            font-size: 1.5rem;
            color: #64748b;
            font-weight: 400;
            margin-bottom: 20px;
        }
        
        .report-meta p {
            margin: 5px 0;
            color: #475569;
        }
        
        .header-metrics {
            display: flex;
            gap: 20px;
        }
        
        .metric {
            text-align: center;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .metric.success { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .metric.warning { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
        .metric.danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
        .metric.info { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
        
        .metric-value {
            display: block;
            font-size: 2.5rem;
            font-weight: 700;
        }
        
        .metric-label {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        section {
            margin-bottom: 40px;
        }
        
        h3 {
            font-size: 1.8rem;
            color: #1e40af;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        h4 {
            font-size: 1.3rem;
            color: #374151;
            margin: 20px 0 15px 0;
        }
        
        h5 {
            font-size: 1.1rem;
            color: #4b5563;
            margin: 15px 0 10px 0;
        }
        
        .summary-grid {
            display: grid;
            gap: 20px;
        }
        
        .summary-card {
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .summary-card.success {
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            border-left: 5px solid #10b981;
        }
        
        .summary-card.warning {
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
            border-left: 5px solid #f59e0b;
        }
        
        .critical-metrics {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(0,0,0,0.1);
        }
        
        .metric-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 1.1rem;
        }
        
        .danger { color: #dc2626; font-weight: 600; }
        .warning { color: #d97706; font-weight: 600; }
        .success { color: #059669; font-weight: 600; }
        
        .analysis-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .bottleneck-alert {
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            color: #991b1b;
        }
        
        .risks-container, .recommendations-container {
            display: grid;
            gap: 15px;
            margin-top: 15px;
        }
        
        .risk-item {
            display: flex;
            gap: 15px;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .risk-item.crítico {
            background: #fef2f2;
            border-color: #dc2626;
        }
        
        .risk-item.alto {
            background: #fffbeb;
            border-color: #f59e0b;
        }
        
        .risk-level {
            font-weight: 700;
            padding: 5px 10px;
            border-radius: 4px;
            color: white;
            font-size: 0.9rem;
            height: fit-content;
        }
        
        .risk-item.crítico .risk-level { background: #dc2626; }
        .risk-item.alto .risk-level { background: #f59e0b; }
        
        .risk-impact {
            font-style: italic;
            color: #6b7280;
        }
        
        .recommendation-item {
            display: flex;
            gap: 15px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .rec-number {
            width: 30px;
            height: 30px;
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            flex-shrink: 0;
        }
        
        .priority-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
            color: white;
        }
        
        .priority-badge.alta { background: #dc2626; }
        .priority-badge.media { background: #f59e0b; }
        .priority-badge.baja { background: #10b981; }
        
        .person-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .person-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .person-card h4 {
            color: #1f2937;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
        }
        
        .role-section {
            margin: 15px 0;
        }
        
        .role-section h5 {
            color: #4b5563;
            margin-bottom: 8px;
        }
        
        .role-section ul {
            list-style: none;
            padding-left: 10px;
        }
        
        .role-section li {
            margin: 5px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .estado-tag {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
            color: white;
            min-width: 120px;
            text-align: center;
        }
        
        .estado-tag.en-elaboración { background: #3b82f6; }
        .estado-tag.en-revisor-técnico { background: #f59e0b; }
        .estado-tag.en-coordinador { background: #ef4444; }
        .estado-tag.en-revisor-editorial { background: #10b981; }
        .estado-tag.incorporada { background: #059669; }
        
        .person-total {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            color: #374151;
        }
        
        .trends-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        .trends-table th,
        .trends-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .trends-table th {
            background: #f3f4f6;
            font-weight: 600;
            color: #374151;
        }
        
        .projection-card {
            padding: 25px;
            border-radius: 12px;
            margin: 20px 0;
        }
        
        .projection-card.success {
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            border: 2px solid #10b981;
        }
        
        .projection-card.danger {
            background: linear-gradient(135deg, #fef2f2, #fecaca);
            border: 2px solid #ef4444;
        }
        
        .final-recommendations ol {
            padding-left: 20px;
        }
        
        .final-recommendations li {
            margin: 15px 0;
            line-height: 1.6;
        }
        
        .report-footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
        }
        
        @media print {
            .executive-report {
                padding: 20px;
            }
            
            .header-metrics {
                flex-direction: column;
                gap: 10px;
            }
            
            .person-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    `;
}

function generateTimelineReport() {
    if (!currentSubcontractData || currentSubcontractData.length === 0) {
        showToast('Selecciona un subcontrato para generar cronograma', 'warning');
        return;
    }
    
    exportTimelineToExcel();
}

function exportTimelineToExcel() {
    if (!currentSubcontractData || currentSubcontractData.length === 0) {
        showToast('No hay datos de cronograma para exportar', 'warning');
        return;
    }
    
    try {
        const wb = XLSX.utils.book_new();
        
        // Preparar datos del cronograma
        const timelineData = currentSubcontractData.map(item => {
            const deliveryWeeks = getDeliveryWeeksForState(item.Estado);
            const fechaEntregaEstimada = addWeeksToDate(item.FechaReporte, deliveryWeeks);
            
            return {
                'ID': item.ID_Corregido || item.ID,
                'Pregunta/Item': item.Pregunta || item.Item,
                'Estado Actual': item.Estado,
                'Temática': item.Tematica,
                'Elaborador': item.Elaborador,
                'Revisor': item.Revisor,
                'Fecha Último Reporte': item.FechaReporte,
                'Semana': item.Semana,
                'Fecha Entrega Estimada': fechaEntregaEstimada,
                'Semanas Restantes': deliveryWeeks
            };
        });
        
        const ws = XLSX.utils.json_to_sheet(timelineData);
        
        // Ajustar ancho de columnas
        ws['!cols'] = [
            { wch: 10 }, // ID
            { wch: 50 }, // Pregunta
            { wch: 20 }, // Estado
            { wch: 20 }, // Temática
            { wch: 15 }, // Elaborador
            { wch: 15 }, // Revisor
            { wch: 12 }, // Fecha reporte
            { wch: 8 },  // Semana
            { wch: 12 }, // Fecha entrega
            { wch: 10 }  // Semanas restantes
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, 'Cronograma');
        
        const today = new Date().toISOString().split('T')[0];
        const fileName = `Cronograma_${currentSubcontractName.replace(/[^a-zA-Z0-9]/g, '_')}_${today}.xlsx`;
        
        XLSX.writeFile(wb, fileName);
        
        showToast('Cronograma exportado correctamente', 'success');
    } catch (error) {
        console.error('Error al exportar cronograma:', error);
        showToast('Error al exportar el cronograma', 'error');
    }
}

function refreshReports() {
    renderReportsSection();
    showToast('Reportes actualizados', 'info');
}

// ===== PREDICCIONES Y TENDENCIAS =====
function renderPredictions() {
    const container = document.getElementById('predictionsContainer');
    if (!container || currentFilteredData.length === 0) return;
    
    const predictions = calculatePredictions();
    
    container.innerHTML = `
        <div class="prediction-card">
            <div class="prediction-header">
                <div class="prediction-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h3>Análisis Predictivo</h3>
            </div>
            <div class="prediction-content">
                <div class="prediction-metric">
                    <div class="prediction-value">${predictions.estimatedCompletion}</div>
                    <div class="prediction-label">Semanas para completar</div>
                    <div class="prediction-trend ${predictions.trend.class}">
                        <i class="fas fa-${predictions.trend.icon}"></i>
                        ${predictions.trend.text}
                    </div>
                </div>
                <div class="prediction-metric">
                    <div class="prediction-value">${predictions.weeklyProgress}</div>
                    <div class="prediction-label">Items por semana (promedio)</div>
                </div>
                <div class="prediction-metric">
                    <div class="prediction-value">${predictions.riskLevel}%</div>
                    <div class="prediction-label">Riesgo de retraso</div>
                    <div class="prediction-trend ${predictions.riskClass}">
                        <i class="fas fa-${predictions.riskIcon}"></i>
                        ${predictions.riskText}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function calculatePredictions() {
    const total = currentFilteredData.length;
    const completed = currentFilteredData.filter(item => item.Estado === 'Incorporada').length;
    const remaining = total - completed;
    
    // Calcular progreso semanal basado en datos históricos
    const weeklyData = {};
    currentFilteredData.forEach(item => {
        if (!weeklyData[item.Semana]) {
            weeklyData[item.Semana] = { total: 0, completed: 0 };
        }
        weeklyData[item.Semana].total++;
        if (item.Estado === 'Incorporada') {
            weeklyData[item.Semana].completed++;
        }
    });
    
    const weeks = Object.keys(weeklyData).map(w => parseInt(w)).sort((a, b) => a - b);
    const recentWeeks = weeks.slice(-4); // Últimas 4 semanas
    const avgWeeklyCompletion = recentWeeks.length > 0 
        ? recentWeeks.reduce((sum, week) => sum + weeklyData[week].completed, 0) / recentWeeks.length 
        : 1;
    
    const estimatedCompletion = avgWeeklyCompletion > 0 ? Math.ceil(remaining / avgWeeklyCompletion) : 'N/A';
    
    // Determinar tendencia
    let trend = { class: 'trend-stable', icon: 'minus', text: 'Estable' };
    if (recentWeeks.length >= 2) {
        const recent = weeklyData[recentWeeks[recentWeeks.length - 1]].completed;
        const previous = weeklyData[recentWeeks[recentWeeks.length - 2]].completed;
        if (recent > previous) {
            trend = { class: 'trend-up', icon: 'arrow-up', text: 'Mejorando' };
        } else if (recent < previous) {
            trend = { class: 'trend-down', icon: 'arrow-down', text: 'Ralentizando' };
        }
    }
    
    // Calcular riesgo
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    let riskLevel = 0;
    let riskClass = 'trend-stable';
    let riskIcon = 'check';
    let riskText = 'Bajo riesgo';
    
    if (completionRate < 50) {
        riskLevel = 70;
        riskClass = 'trend-down';
        riskIcon = 'exclamation-triangle';
        riskText = 'Alto riesgo';
    } else if (completionRate < 75) {
        riskLevel = 40;
        riskClass = 'trend-stable';
        riskIcon = 'exclamation-circle';
        riskText = 'Riesgo moderado';
    } else {
        riskLevel = 15;
        riskClass = 'trend-up';
        riskIcon = 'check';
        riskText = 'Bajo riesgo';
    }
    
    return {
        estimatedCompletion,
        weeklyProgress: Math.round(avgWeeklyCompletion * 10) / 10,
        trend,
        riskLevel,
        riskClass,
        riskIcon,
        riskText
    };
}

function downloadEvolutionChart() {
    const canvas = document.getElementById('evolutionChart');
    if (!canvas) {
        showToast('No se pudo encontrar el gráfico de evolución', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.download = `evolucion-temporal-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    showToast('Gráfico de evolución descargado', 'success');
}

function downloadTimelineChart() {
    // Crear una imagen del cronograma actual
    const ganttContainer = document.querySelector('.gantt-container');
    if (!ganttContainer) {
        showToast('No hay cronograma para descargar', 'warning');
        return;
    }
    
    // TODO: Implementar captura de pantalla del cronograma
    showToast('Función de descarga de cronograma disponible próximamente', 'info');
}

// ===== INICIALIZACIÓN FINAL =====
// Asegurar que todas las funciones estén disponibles globalmente
window.toggleTheme = toggleTheme;
window.toggleSidebar = toggleSidebar;
window.showComparisonView = showComparisonView;
window.hideComparisonView = hideComparisonView;
window.executeComparison = executeComparison;
window.clearAllData = clearAllData;
window.closeModal = closeModal;
window.exportToExcel = exportToExcel;
window.exportSubcontractToExcel = exportSubcontractToExcel;
window.clearAllFilters = clearAllFilters;
window.refreshSubcontractView = refreshSubcontractView;
window.switchStatsView = switchStatsView;
window.switchChartsView = switchChartsView;
window.downloadChart = downloadChart;
window.toggleChartTable = toggleChartTable;
window.switchTab = switchTab;
window.switchMainTab = switchMainTab;
window.filterDetails = filterDetails;
window.clearDetailsFilters = clearDetailsFilters;
window.changeDetailsPage = changeDetailsPage;
window.exportDetailedReport = exportDetailedReport;
window.generateExecutiveReport = generateExecutiveReport;
window.generateTimelineReport = generateTimelineReport;
window.exportTimelineToExcel = exportTimelineToExcel;
window.refreshReports = refreshReports;
window.downloadEvolutionChart = downloadEvolutionChart;

window.showQuickActions = showQuickActions;
window.updateQuickStats = updateQuickStats;
window.switchTimelineView = switchTimelineView;
window.filterTimelineByState = filterTimelineByState;
window.refreshTimeline = refreshTimeline;
window.copyChartToClipboard = copyChartToClipboard;
window.copyAllChartsToClipboard = copyAllChartsToClipboard;

// ===== FUNCIONES DE ACCIONES RÁPIDAS =====
function showQuickActions() {
    const modal = document.getElementById('quickActionsModal');
    if (modal) {
        modal.style.display = 'flex';
        // Añadir animación de entrada
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function updateQuickStats() {
    const quickStats = document.getElementById('quickStats');
    const quickTotal = document.getElementById('quickTotal');
    const quickCompleted = document.getElementById('quickCompleted');
    const quickProgress = document.getElementById('quickProgress');
    
    if (!quickStats || !currentFilteredData) return;
    
    const total = currentFilteredData.length;
    const completed = currentFilteredData.filter(item => item.Estado === 'Incorporada').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    if (quickTotal) quickTotal.textContent = total;
    if (quickCompleted) quickCompleted.textContent = completed;
    if (quickProgress) quickProgress.textContent = progress + '%';
    
    // Mostrar/ocultar estadísticas rápidas según si hay datos
    if (total > 0) {
        quickStats.classList.remove('hidden');
        setTimeout(() => quickStats.classList.add('show'), 100);
    } else {
        quickStats.classList.add('hidden');
        quickStats.classList.remove('show');
    }
}

// ===== MEJORAS EN LA INICIALIZACIÓN =====
function initializeEnhancedFeatures() {
    // Inicializar tooltips para elementos Gantt
    addGlobalEventListeners();
    
    // Configurar observador de cambios para auto-actualizar estadísticas
    if (window.MutationObserver) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && 
                    mutation.target.id === 'totalItems') {
                    updateQuickStats();
                }
            });
        });
        
        const totalElement = document.getElementById('totalItems');
        if (totalElement) {
            observer.observe(totalElement, { childList: true, subtree: true });
        }
    }
    
    // Configurar teclado para acciones rápidas
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Inicializar estado de pestañas principales
    switchMainTab('dashboard');
}

function addGlobalEventListeners() {
    // Cerrar modal al hacer click fuera
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            e.target.classList.remove('show');
        }
    });
    
    // Mejorar la experiencia de hover en tarjetas
    document.querySelectorAll('.stat-card, .chart-card, .report-card').forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            e.target.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', (e) => {
            e.target.style.transform = 'translateY(0)';
        });
    });
}

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K para acciones rápidas
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showQuickActions();
    }
    
    // Escape para cerrar modales
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
        });
    }
    
    // Números 1-4 para cambiar pestañas principales
    if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.metaKey) {
        const target = document.activeElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'SELECT') {
            const tabs = ['dashboard', 'charts', 'reports', 'evolution'];
            const tabIndex = parseInt(e.key) - 1;
            if (tabs[tabIndex]) {
                switchMainTab(tabs[tabIndex]);
            }
        }
    }
}

// ===== FUNCIONES DE EXPORTACIÓN MEJORADAS =====
function enhancedExportToExcel() {
    if (!currentFilteredData || currentFilteredData.length === 0) {
        showToast('No hay datos para exportar', 'warning');
        return;
    }
    
    try {
        const wb = XLSX.utils.book_new();
        
        // Hoja principal con datos
        const mainData = currentFilteredData.map(item => ({
            'ID': item.ID_Corregido || item.ID,
            'Documento': item.Documento,
            'Pregunta/Item': item.Pregunta || item.Item,
            'Estado': item.Estado,
            'Temática': item.Tematica,
            'Elaborador': item.Elaborador,
            'Revisor': item.Revisor,
            'Coordinador': item.Coordinador,
            'Fecha entrega': item.FechaEntrega,
            'Fecha Reporte': item.FechaReporte,
            'Semana': item.Semana,
            'Subcontrato': item.Subcontrato
        }));
        
        const mainWs = XLSX.utils.json_to_sheet(mainData);
        XLSX.utils.book_append_sheet(wb, mainWs, 'Datos Principales');
        
        // Hoja de resumen estadístico
        const stats = generateDetailedStats();
        const statsWs = XLSX.utils.json_to_sheet(stats);
        XLSX.utils.book_append_sheet(wb, statsWs, 'Estadísticas');
        
        // Hoja de distribución por estado
        const stateDistribution = generateStateDistributionData();
        const stateWs = XLSX.utils.json_to_sheet(stateDistribution);
        XLSX.utils.book_append_sheet(wb, stateWs, 'Distribución Estados');
        
        const today = new Date().toISOString().split('T')[0];
        const fileName = `Reporte_Completo_${today}.xlsx`;
        
        XLSX.writeFile(wb, fileName);
        
        showToast(`Reporte exportado: ${fileName}`, 'success');
        
        // Actualizar estadísticas de reportes generados
        updateReportGenerationStats();
        
    } catch (error) {
        console.error('Error al exportar:', error);
        showToast('Error al generar el reporte', 'error');
    }
}

function generateDetailedStats() {
    if (!currentFilteredData) return [];
    
    const total = currentFilteredData.length;
    const adc = currentFilteredData.filter(item => item.Documento === 'ADC').length;
    const pac = currentFilteredData.filter(item => item.Documento === 'PAC').length;
    const completed = currentFilteredData.filter(item => item.Estado === 'Incorporada').length;
    
    const estados = {};
    currentFilteredData.forEach(item => {
        estados[item.Estado] = (estados[item.Estado] || 0) + 1;
    });
    
    const temáticas = {};
    currentFilteredData.forEach(item => {
        if (item.Tematica) {
            temáticas[item.Tematica] = (temáticas[item.Tematica] || 0) + 1;
        }
    });
    
    return [
        { 'Métrica': 'Total de Items', 'Valor': total },
        { 'Métrica': 'Documentos ADC', 'Valor': adc },
        { 'Métrica': 'Documentos PAC', 'Valor': pac },
        { 'Métrica': 'Items Completados', 'Valor': completed },
        { 'Métrica': 'Porcentaje Completado', 'Valor': `${Math.round((completed/total)*100)}%` },
        { 'Métrica': 'Estados Únicos', 'Valor': Object.keys(estados).length },
        { 'Métrica': 'Temáticas Únicas', 'Valor': Object.keys(temáticas).length },
        { 'Métrica': 'Fecha de Reporte', 'Valor': new Date().toLocaleDateString() }
    ];
}

function generateStateDistributionData() {
    if (!currentFilteredData) return [];
    
    const total = currentFilteredData.length;
    const distribution = {};
    
    currentFilteredData.forEach(item => {
        distribution[item.Estado] = (distribution[item.Estado] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([estado, cantidad]) => ({
        'Estado': estado,
        'Cantidad': cantidad,
        'Porcentaje': `${Math.round((cantidad/total)*100)}%`
    }));
}

function updateReportGenerationStats() {
    const stats = JSON.parse(localStorage.getItem('reportStats') || '{}');
    const today = new Date().toISOString().split('T')[0];
    
    stats[today] = (stats[today] || 0) + 1;
    stats.total = (stats.total || 0) + 1;
    
    localStorage.setItem('reportStats', JSON.stringify(stats));
}

// Filtra el gráfico de evolución por tipo de documento (TODOS, ADC, PAC)
// Reemplaza la función completa con esta versión
function filterEvolutionChart(type) {
    const controls = document.querySelectorAll('#evolution-controls .view-toggle');
    controls.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = document.querySelector(`#evolution-controls .view-toggle[onclick="filterEvolutionChart('${type}')"]`);
    if(activeButton) activeButton.classList.add('active');
    
    // ¡CORRECCIÓN CLAVE!
    // Usa 'currentEvolutionData' (el conjunto de datos histórico) en lugar de 'currentFilteredData'.
    updateEvolutionChart(currentEvolutionData, type);
    
    showToast(`Mostrando evolución para: ${type}`, 'info');
}

// Copia el gráfico de evolución al portapapeles con un formato mejorado
async function copyEvolutionChartToClipboard() {
    try {
        const canvas = document.getElementById('evolutionChart');
        if (!canvas) {
            showToast('Error: No se pudo encontrar el gráfico de evolución', 'error');
            return;
        }

        // Crear un canvas temporal para la imagen
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        const padding = 40;
        const titleHeight = 60;
        const chartWidth = canvas.width;
        const chartHeight = canvas.height;

        tempCanvas.width = chartWidth + (padding * 2);
        tempCanvas.height = titleHeight + chartHeight + (padding * 2);

        // Fondo blanco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Título
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Evolución Temporal de Avances', tempCanvas.width / 2, padding + 10);
        
        // Línea separadora
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, titleHeight);
        ctx.lineTo(tempCanvas.width - padding, titleHeight);
        ctx.stroke();

        // Dibujar el gráfico
        ctx.drawImage(canvas, padding, titleHeight + padding / 2, chartWidth, chartHeight);

        // Fecha de generación
        const now = new Date();
        const dateStr = now.toLocaleString('es-ES');
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`Generado: ${dateStr}`, tempCanvas.width - padding, tempCanvas.height - 10);

        // Convertir a blob y copiar al portapapeles
        tempCanvas.toBlob(async (blob) => {
            try {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                showToast('Gráfico de evolución copiado al portapapeles', 'success');
            } catch (err) {
                console.error('Error al copiar:', err);
                showToast('No se pudo copiar, se descargó en su lugar', 'warning');
                downloadEvolutionChart(); // Fallback a descargar
            }
        }, 'image/png');

    } catch (error) {
        console.error('Error al procesar el gráfico:', error);
        showToast('Error al procesar el gráfico de evolución', 'error');
    }
}

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que se carguen todos los elementos
    setTimeout(() => {
        initializeEnhancedFeatures();
        updateQuickStats();
    }, 500);
});

window.filterEvolutionChart = filterEvolutionChart;
window.copyEvolutionChartToClipboard = copyEvolutionChartToClipboard;