import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=80";

/*
  Hero
  - Main introduction section
  - Navigates to restaurants page with keyword query
*/
const Hero = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const trimmedKeyword = keyword.trim();
  const isDisabled = trimmedKeyword.length === 0;

  /* Smart Search Implementation */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isDisabled) return;

    try {
      // 1. 카카오 맵 로드 (Geocoding 사용을 위해)
      const kakaoIcons = await import("../../utils/kakaoLoader").then(m => m.loadKakaoMaps());

      const geocoder = new kakaoIcons.maps.services.Geocoder();

      // 2. 주소 검색 시도
      geocoder.addressSearch(trimmedKeyword, (result, status) => {
        if (status === kakaoIcons.maps.services.Status.OK && result.length > 0) {
          // 3-1. 주소/지역명인 경우 -> 좌표 기준 거리순 정렬
          const { x, y } = result[0];
          navigate(
            `/restaurants?lat=${y}&lng=${x}&sort=distance&locName=${encodeURIComponent(trimmedKeyword)}`
          );
        } else {
          // 3-2. 일반 키워드인 경우 -> 키워드 검색
          navigate(`/restaurants?keyword=${encodeURIComponent(trimmedKeyword)}`);
        }
      });
    } catch (error) {
      // 로드 실패 시 일반 검색으로 fallback
      console.error("Kakao Map Load Failed", error);
      navigate(`/restaurants?keyword=${encodeURIComponent(trimmedKeyword)}`);
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">최고의 레스토랑을 예약하세요</h1>
          <p className="hero-subtitle">전국 최고의 맛집을 한눈에</p>

          <form className="hero-search" onSubmit={handleSubmit}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="지역 또는 키워드를 입력하세요 (예: 부산, 스시)"
              aria-label="레스토랑 검색"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" disabled={isDisabled}>
              검색
            </button>
          </form>
        </div>

        <div className="hero-image">
          <img src={HERO_IMAGE} alt="맛있는 음식 사진" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
