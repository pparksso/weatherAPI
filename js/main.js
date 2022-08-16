const body = document.querySelector("body");
const city = document.querySelector("#header .city");
const hourBox = document.querySelector("#header .hour");
const minBox = document.querySelector("#header .min");
const nowTemper = document.querySelector("#top .nowTemper");
const todayWeatherList = document.querySelector("#top .todayList ul");
const ctx = document.querySelector("#myChart").getContext("2d");
let tempRegion = "";
let cityName = "";
//시간
const today = () => {
  const hour = new Date().getHours();
  const min = new Date().getMinutes();
  const resultHour = hour < 10 ? `0${hour}` : hour;
  const resultMin = min < 10 ? `0${min}` : min;
  hourBox.innerHTML = resultHour;
  minBox.innerHTML = resultMin;
};
// 백그라운드
const backgroundApi = (cityName) => {
  axios({
    url: `https://api.unsplash.com/photos/?client_id=${unsplashKey}&query=${cityName}`,
  })
    .then((res) => {
      const backImg = res.data[0].urls.regular;
      body.style.backgroundImage = `url('${backImg}')`;
    })
    .catch((err) => {
      console.log(err);
    });
};
//현재 위치(위도,경도)로 날씨를 구하고, 언어감지를 통해 한국어로 번역
const currentLocation = navigator.geolocation.getCurrentPosition(async (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  await axios({
    url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}&units=metric`,
  })
    .then((res) => {
      const data = res.data;
      cityName = data.name;
      backgroundApi(cityName);
      nowTemper.innerHTML = `${Math.floor(data.main.temp)}`;
      todayWeatherList.innerHTML = `
      <li class="today">
                <span class="">Today</span>
                <div class="todayIcon"><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}"></div>
                <p><span class="todayMax circle">${Math.floor(data.main.temp_max)}</span><span class="todayMin circle">${Math.floor(data.main.temp_min)}</span></p>
              </li>
      `;
    })
    .then(() => {
      axios({
        method: "POST",
        url: "http://127.0.0.1:8099/detectlang",
        data: {
          cityName,
        },
      }).then((response) => {
        const translate = response.data.message.result.translatedText;
        city.innerHTML = translate;
      });
    })
    .catch((err) => {
      console.log(err);
    });
  await axios({
    url: `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}&cnt=8&units=metric`,
  })
    .then((res) => {
      const list = res.data.list;
      let tempArr = [];
      for (let i = 0; i < list.length; i++) {
        tempArr.push(Math.floor(list[i].main.temp));
      }
      const mixedChart = new Chart(ctx, {
        data: {
          datasets: [
            {
              type: "bar",
              label: "Bar Dataset",
              data: tempArr,
              backgroundColor: "rgba(255,255,255,0.3)",
              order: 2,
            },
            {
              type: "line",
              label: "Line Dataset",
              data: tempArr,
              fill: false,
              borderColor: "#fff",
              order: 1,
            },
          ],
          labels: ["12PM", "3AM", "6AM", "9AM", "12AM", "3PM", "6PM", "9PM"],
        },
        options: {
          tooltips: {
            enabled: false,
          },
          hover: {
            animationDuration: 0,
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontSize: 11, //x축 텍스트 폰트 사이즈
                  fontColor: "rgba(0,0,0,0)", //x축 레이브 안보이게
                },
                gridLines: {
                  display: false,
                  lineWidth: 0,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  display: false, //y축 텍스트 삭제
                  beginAtZero: false, //y축값이 0부터 시작
                  display: false,
                },
                gridLines: {
                  display: false,
                  lineWidth: 0,
                },
              },
            ],
          },
          legend: {
            display: true,
            labels: {
              boxWidth: 0,
              fontColor: "rgba(0,0,0,0)",
              fontSize: 20,
            },
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

today();
