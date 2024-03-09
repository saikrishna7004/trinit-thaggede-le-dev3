import React, { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChartComponent = ({ marksData, timeTakenData }) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('chart.js');
        }
    }, []);

    const getRandomColors = (numColors) => {
        const letters = '0123456789ABCDEF';
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            let color = '#';
            for (let j = 0; j < 6; j++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            colors.push(color);
        }
        return colors;
    };

    const generateChartOptions = (labels) => ({
        plugins: {
            title: {
                display: true,
                text: 'Analysis by Subject',
                color: 'black',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true
                }
            }
        },
        elements: {
            arc: {
                borderWidth: 0
            }
        }
    });

    const generateChartData = (data) => {
        const subjectLabels = Object.keys(data);
        const backgroundColors = getRandomColors(subjectLabels.length);
        const chartData = {
            labels: subjectLabels,
            datasets: [{
                data: Object.values(data),
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        };
        return chartData;
    };

    const marksChartData = generateChartData(marksData);
    const timeTakenChartData = generateChartData(timeTakenData);

    return (
        <div className='container my-4'>
            <div className=' mt-5 row'>
                <div className='col-md-4'>
                    <h2>Marks Achieved</h2>
                    <Doughnut data={marksChartData} options={generateChartOptions(marksChartData.labels)} />
                </div>
                <div className='col-md-4'>
                    <h2>Time Taken</h2>
                    <Doughnut data={timeTakenChartData} options={generateChartOptions(timeTakenChartData.labels)} />
                </div>
            </div>
        </div>
    );
};

export default DoughnutChartComponent;
