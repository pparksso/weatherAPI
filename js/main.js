const body = document.querySelector("body");
const city = document.querySelector("#header .city");
const hourBox = document.querySelector("#header .hour");
const minBox = document.querySelector("#header .min");

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
    url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}&lang=kr&units=metric`,
  })
    .then((res) => {
      console.log(res.data);
      const data = res.data;
      cityName = data.name;
      backgroundApi();
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
});

today();
