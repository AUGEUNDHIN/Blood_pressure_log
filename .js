
        let allUsersData = {};
        let currentUserName = "";
        let myChart = null; // Экземпляр графика Chart.js

        window.addEventListener('DOMContentLoaded', () => {
            resetDateTimeInputs();

            const savedData = localStorage.getItem('familyBloodPressureLog');
            if (savedData) {
                allUsersData = JSON.parse(savedData);
            } else {
                allUsersData = { "Пациент 1": [] };
            }

            const userNames = Object.keys(allUsersData);
            if (userNames.length > 0) currentUserName = userNames[0];

            refreshUserDropdown();

            document.getElementById('filterStart').addEventListener('change', updateUI);
            document.getElementById('filterEnd').addEventListener('change', updateUI);
            document.getElementById('clearFilters').addEventListener('click', () => {
                document.getElementById('filterStart').value = '';
                document.getElementById('filterEnd').value = '';
                updateUI();
            });

            updateUI();
        });

        function resetDateTimeInputs() {
            const now = new Date();
            document.getElementById('bpDate').value = now.toISOString().split('T')[0];
            document.getElementById('bpTime').value = now.toTimeString().slice(0, 5);
        }

        function refreshUserDropdown() {
            const select = document.getElementById('userSelect');
            select.innerHTML = '';
            Object.keys(allUsersData).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                if (name === currentUserName) option.selected = true;
                select.appendChild(option);
            });
        }

        function getFilteredRecords() {
            const records = allUsersData[currentUserName] || [];
            const startDate = document.getElementById('filterStart').value;
            const endDate = document.getElementById('filterEnd').value;

            return records.filter(r => {
                if (startDate && r.date < startDate) return false;
                if (endDate && r.date > endDate) return false;
                return true;
            });
        }

        // Расчет комплексной статистики с учетом Пульсового Давления
        function calculateStats(records) {
            if (records.length === 0) {
                document.getElementById('statMin').innerHTML = '--';
                document.getElementById('statAvg').innerHTML = '--';
                document.getElementById('statMax').innerHTML = '--';
                return;
            }
        }

        let sysSum = 0, diaSum = 0, pulseSum = 0, pdSum = 0;
        let minSys = Infinity, minDia = Infinity, minPulse = Infinity;
