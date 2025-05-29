Chart.register(ChartDataLabels);

const ctxMensal = document.getElementById('chartMensal');
const chartMensal = new Chart(ctxMensal, {
    type: 'bar',
    data: {
        labels: ['Dezembro', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
        datasets: [
            {
                label: 'CPU',
                backgroundColor: '#2e8b57',
                data: [5, 3, 4, 7, 9, 5],
                hidden: false },
            {
                label: 'RAM',
                backgroundColor: '#5f9ea0',
                data: [1, 1, 4, 1, 2, 2],
                hidden: true },
            {
                label: 'Disco',
                backgroundColor: '#f4c542',
                data: [2, 4, 4, 4, 3, 2],
                hidden: true },
            {
                label: 'REDE',
                backgroundColor: '#8a2be2',
                data: [4, 4, 5, 2, 4, 1],
                hidden: true }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            datalabels: {
                color: '#ffffff',
                font: { weight: 'bold', size: 20 }
            }
        },
        scales: { y: { beginAtZero: true } }
    },
    plugins: [ChartDataLabels]
});

const ctxFiliais = document.getElementById('chartFiliais');
const chartFiliais = new Chart(ctxFiliais, {
    type: 'bar',
    data: {
        labels: ['Guarulhos', 'Galeão', 'BHorizonte', 'Brasília', 'Confins', 'Viracopos', 'Congonhas', 'Salvador'],
        datasets: [{
            backgroundColor: ['green', '#e6e604', 'red', 'red', '#e6e604', '#e6e604', 'red', '#e6e604'],
            data: [15, 35, 98, 52, 25, 38, 71, 25]
        }],
        ids: ['1', '2', '3', '4', '5', '6', '7', '8']
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: trocarMensal,
        plugins: {
            datalabels: {
                color: '#ffffff',
                font: { weight: 'bold', size: 20 }
            },
            legend: {
                position: 'top',
                labels: {
                    generateLabels: function(chart) {
                        return [
                            { text: 'OK (0 - 20)', fillStyle: 'green', strokeStyle: '#000', lineWidth: 1 },
                            { text: 'Atenção (21 - 50)', fillStyle: '#e6e604', strokeStyle: '#000', lineWidth: 1 },
                            { text: 'Crítico (51 - ~)', fillStyle: 'red', strokeStyle: '#000', lineWidth: 1 }
                        ];
                    }
                }
            }
        },
        scales: { y: { beginAtZero: true } }
    },
    plugins: [ChartDataLabels]
});

function trocarMensal(evt, elements) {
    if (elements.length > 0) {
        const firstElement = elements[0];
        const label = chartFiliais.data.labels[firstElement.index];
        const ids = chartFiliais.data.ids[firstElement.index];
        // window.location.reload();
        // alert('Você clicou em ' + label+', coom o id:'+ids);

        // for (let index = 0; index < array.length; index++) {
            chartMensal.data.datasets[0].data = [50, 30, 40, 70, 90, 50];
            chartMensal.update();
        // }
    }
}