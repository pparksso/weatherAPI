const body = document.querySelector("body");
const city = document.querySelector("#header .city");
const amPmBox = document.querySelector("#header .amPm");
const hourBox = document.querySelector("#header .hour");
const minBox = document.querySelector("#header .min");
const todayWeatherList = document.querySelector("#top .todayList ul");
// const ctx = document.querySelector("#myChart").getContext("2d");
let tempRegion = "";
let cityName = "";
//시간
const today = () => {
  const hour = new Date().getHours();
  const min = new Date().getMinutes();
  const resultHour = hour < 10 ? `0${hour}` : hour;
  const resultMin = min < 10 ? `0${min}` : min;
  const amPm = hour < 11 ? "AM" : "PM";
  hourBox.innerHTML = resultHour;
  minBox.innerHTML = resultMin;
  amPmBox.innerHTML = amPm;
};

//현재 위치(위도,경도)로 날씨를 구하고, 언어감지를 통해 한국어로 번역
const currentLocation = navigator.geolocation.getCurrentPosition(async (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  await axios({
    url: `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
    headers: {
      Authorization: `KakaoAK ${kakaoKey}`,
    },
  }).then((res) => {
    const region01 = res.data.documents[0].region_1depth_name;
    const region02 = res.data.documents[0].region_2depth_name;
    city.innerHTML = `${region01} ${region02}`;
  });
  await axios({
    url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}&units=metric`,
  })
    .then((res) => {
      const data = res.data;
      console.log(data);
      cityName = data.name;
      todayWeatherList.innerHTML = `
      <li class="today">
                <span class="">Today</span>
                <div class="todayIcon"><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}"></div>
                <p><span class="todayMax circle">${Math.floor(data.main.temp_max)}</span><span class="todayMin circle">${Math.floor(data.main.temp_min)}</span></p>
              </li>
      `;
    })
    .then(() => {
      // axios({
      //   method: "POST",
      //   url: "http://127.0.0.1:8099/detectlang",
      //   data: {
      //     cityName,
      //   },
      // }).then((response) => {
      //   const translate = response.data.message.result.translatedText;
      //   city.innerHTML = translate;
      // });
    })
    .catch((err) => {
      console.log(err);
    });
  await axios({
    url: `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}&cnt=8&units=metric`,
  })
    .then((res) => {
      const list = res.data.list;
      // let tempArr = [];
      // for (let i = 0; i < list.length; i++) {
      //   tempArr.push(Math.floor(list[i].main.temp));
      // }
      // const mixedChart = new Chart(ctx, {
      //   data: {
      //     datasets: [
      //       {
      //         type: "bar",
      //         label: "Bar Dataset",
      //         data: tempArr,
      //         backgroundColor: "rgba(255,255,255,0.3)",
      //         order: 2,
      //       },
      //       {
      //         type: "line",
      //         label: "Line Dataset",
      //         data: tempArr,
      //         fill: false,
      //         borderColor: "#fff",
      //         order: 1,
      //       },
      //     ],
      //     labels: ["12PM", "3AM", "6AM", "9AM", "12AM", "3PM", "6PM", "9PM"],
      //   },
      //   options: {},
      // });
    })
    .catch((err) => {
      console.log(err);
    });
});

today();
