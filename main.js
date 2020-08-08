var vm = new Vue({
    el: "#app",
    data() {
        return {
            togglePage: "",
            locations: [],
            locationWeatherData: null,
            locationName: '',
            cityWeatherData: null,
        }
    },
    methods: {
        getLocations(){
            axios.get("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-418C5921-689A-4793-A78B-7D3027C772CD")
            .then(res=>{
                res.data.records.location.forEach(location => {
                    let locationObj = {
                        name: location.locationName,
                        img: `./accest/img/${location.locationName}.jpg`
                    }
                    this.locations.push(locationObj);
                });
            })
        },
        getLocationWeather(location){
            this.locationWeatherData = null;
            let city = "";
            switch (location) {
                case "基隆市":
                    city = "051";
                    break;
                case "臺北市":
                    city = "063";
                    break;
                case "新北市":
                    city = "071";
                    break;
                case "桃園市":
                    city = "007";
                    break;
                case "新竹市":
                    city = "055";
                    break;
                case "新竹縣":
                    city = "011";
                    break;
                case "苗栗縣":
                    city = "015";
                    break;
                case "臺中市":
                    city = "075";
                    break;
                case "彰化縣":
                    city = "019";
                    break;
                case "雲林縣":
                    city = "027";
                    break;
                case "嘉義市":
                    city = "059";
                    break;
                case "嘉義縣":
                    city = "031";
                    break;
                case "臺南市":
                    city = "079";
                    break;
                case "高雄市":
                    city = "067";
                    break;
                case "屏東縣":
                    city = "035";
                    break;
                case "宜蘭縣":
                    city = "003";
                    break;
                case "花蓮縣":
                    city = "043";
                    break;
                case "臺東縣":
                    city = "039";
                    break;
                case "南投縣":
                    city = "023";
                    break;
                case "金門縣":
                    city = "087";
                    break;
                case "澎湖縣":
                    city = "047";
                    break;
                case "連江縣":
                    city = "083";
                    break;
                default:
                    city = "No result";
                    break;
            }
            axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-${city}?Authorization=CWB-418C5921-689A-4793-A78B-7D3027C772CD`)
            .then(res=>{
                this.locationName = res.data.records.locations[0].locationsName
                this.locationWeatherData = res.data.records.locations[0].location;
            })
            .then(()=>{
                $('#myModal').modal('toggle');
            })
        },
        cityWeatherTypeSelect(e){
            let tempData = [];
            this.cityWeatherData.weatherElement.forEach(status=>{
                if(status.elementName == e.target.value){
                    status.time.forEach(time=>{
                        tempData.push(time);
                        // console.log(time);
                        // console.log(`${time.elementValue[0].value} ${time.elementValue[0].measures}`);
                        // console.log('start', time.startTime, new Date(time.startTime).getDay());
                        // console.log('end  ',time.endTime, new Date(time.endTime).getDay());
                        // console.log('=================================');
                    })
                }
            });
            this.setChart(tempData);
        },
        setChart(data){
            var myChart = new Chart(document.getElementById('myChart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: data.map(time=> {
                        let startTime = new Date(time.startTime);
                        let endTime = new Date(time.endTime);
                        return `${startTime.getMonth() + 1}/${startTime.getDate()}-${startTime.getHours()}:00~${endTime.getMonth() + 1}/${endTime.getDate() + 1}-${endTime.getHours()}:00`;
                    }),
                    datasets: [{
                        label: '# of Votes',
                        data: data.map(time=>{
                            return parseInt(time.elementValue[0].value)
                        }),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        },
        getCityWeather(cityId){
            this.locationWeatherData.forEach(city=>{
                if(city.geocode == cityId){
                    this.cityWeatherData = city;
                }
            });
            // this.weatherAnalysis(this.cityWeatherData.weatherElement);
            this.togglePage = "cityWeather";
            $('#myModal').modal('toggle');
        }
    },
    computed: {
        
    },
    created() {
        this.getLocations();
    },
})

// NAV 點擊轉換四大頁面
document.getElementById("toogle-page").addEventListener("click", e=>{
    let _id = parseInt(e.target.dataset.id);
    switch (_id) {
        case 1:
            vm.togglePage = 'weather'
            break;
        case 2:
            vm.togglePage = 'observe'
            break;
        case 3:
            vm.togglePage = 'earthquake&'
            break; 
        default:
            vm.togglePage= 'climate'
            break;
    };
})