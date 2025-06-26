document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const summary = document.getElementById('summary');
    const ctx = document.getElementById('statusChart');
    let chart;

    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        let data = [];
        for (const file of files) {
            try {
                const text = await file.text();
                const json = JSON.parse(text);
                if (Array.isArray(json)) {
                    data = data.concat(json);
                } else if (json.body && Array.isArray(json.body)) {
                    data = data.concat(json.body);
                }
            } catch (err) {
                console.error('Archivo no válido', err);
            }
        }

        const counts = {};
        data.forEach(item => {
            const estado = item.Estado || 'Desconocido';
            counts[estado] = (counts[estado] || 0) + 1;
        });

        summary.innerHTML = '';
        Object.entries(counts).forEach(([estado, count]) => {
            const li = document.createElement('li');
            li.textContent = `${estado}: ${count}`;
            summary.appendChild(li);
        });

        const labels = Object.keys(counts);
        const values = Object.values(counts);
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Documentos',
                    data: values,
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    });
});
