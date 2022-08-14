const city = document.querySelector("#header .city");
let region = "";
let tempRegion = "";

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

const backgroundApi = async () => {
  await axiox({
    url: `https://api.unsplash.com/photos/?client_id=${unsplashKey}&query=${con}`,
  });
};
