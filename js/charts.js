let temperatureChart = null;


// ==========================================
// CRIAR GRÁFICO
// ==========================================

function renderTemperatureChart(weather) {

    const canvas =
        document.getElementById(
            "temperatureChart"
        );

    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");


    if (temperatureChart) {

        temperatureChart.destroy();

    }


    const times =
        weather.hourly.time;

    const temperatures =
        weather.hourly.temperature_2m;


    const now =
        new Date().getHours();


    const labels = [];
    const values = [];


    for (
        let i = now; i < now + 12; i++
    ) {

        if (!times[i]) continue;


        const hour =
            new Date(times[i])
            .getHours()
            .toString()
            .padStart(2, "0");


        labels.push(`${hour}h`);

        values.push(
            Math.round(
                temperatures[i]
            )
        );

    }


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            350
        );


    gradient.addColorStop(
        0,
        "rgba(37, 99, 235, 0.28)"
    );


    gradient.addColorStop(
        1,
        "rgba(37, 99, 235, 0)"
    );


    temperatureChart =
        new Chart(ctx, {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label: "Temperatura",

                        data: values,

                        borderColor: "#2563eb",

                        backgroundColor: gradient,

                        fill: true,

                        tension: 0.4,

                        pointRadius: 4,

                        pointBackgroundColor: "#ffffff",

                        pointBorderColor: "#2563eb",

                        pointBorderWidth: 2

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    intersect: false,
                    mode: "index"
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label: context =>
                                `${context.parsed.y}°C`

                        }

                    }

                },


                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {

                            color: getComputedStyle(
                                document.body
                            ).getPropertyValue(
                                "--muted"
                            )

                        }

                    },


                    y: {

                        grid: {

                            color: "rgba(100,116,139,0.1)"

                        },

                        ticks: {

                            color: getComputedStyle(
                                document.body
                            ).getPropertyValue(
                                "--muted"
                            ),

                            callback: value =>
                                `${value}°`

                        }

                    }

                }

            }

        });

}