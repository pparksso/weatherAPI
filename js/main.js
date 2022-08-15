const city = document.querySelector("#header .city");
const hourBox = document.querySelector("#header .hour");
const minBox = document.querySelector("#header .min");
let region = "";
let tempRegion = "";

//시간
const today = () => {
  const hour = new Date().getHours();
  const min = new Date().getMinutes();
  const resultHour = hour < 10 ? `0${hour}` : hour;
  const resultMin = min < 10 ? `0${min}` : min;
  hourBox.innerHTML = resultHour;
  minBox.innerHTML = resultMin;
};

// 처음 로딩됐을 때 현재 위치 지역 이름 찾기
const currentLocation = navigator.geolocation.getCurrentPosition(async (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  await axios({
    url: `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
    method: "GET",
    headers: {
      Authorization: `KakaoAK ${kakaoKey}`,
    },
  })
    .then((res) => {
      const data = res.data.documents[1];
      region = data.address_name;
      city.innerHTML = region;
    })
    .catch((err) => {
      console.log(err);
    });
});

axios({
  method: "POST",
  url: "http://127.0.0.1:8099/weatherlang",
  data: {
    region: "부산",
  },
})
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
const backgroundApi = async () => {
  await axios({
    url: `https://api.unsplash.com/photos/?client_id=${unsplashKey}&query=${region}`,
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
// backgroundApi();
today();
