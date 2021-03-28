<script>
import { Doughnut } from 'vue-chartjs';

export default {
    extends: Doughnut,

    props: {
        chartdata: {
            type: Object,
            default: null,
        },
    },

    data: () => ({
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            legend: { position: 'left' },
        },
    }),

    watch: {
        chartdata() {
            this._data._chart.destroy();
            this.renderChart(this.chartdata, this.options);
        },
    },

    mounted() {
        this.renderChart(this.chartdata, this.options);
    },
};
</script>
