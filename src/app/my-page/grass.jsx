import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./StatisticsDashboard.css"; // 새로 생성한 CSS 파일 임포트

const StatisticsDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  // API 호출 함수
  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const baseUrl =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
      const response = await fetch(`${baseUrl}/api/statistics/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setStatistics(result.data);
      } else {
        throw new Error("데이터 형식이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("통계 데이터 조회 실패:", error);

      // 개발/테스트용 목업 데이터
      const mockData = {
        userName: "사용자명",
        tierInfo: {
          currentTier: "에이스",
          nextTier: "마스터",
          progressPercent: 78,
          progressMessage: "답변 25개 더 필요",
        },
        grassData: {
          dailyActivity: generateGrassData(),
          maxConsecutiveDays: 14,
          currentStreak: 3,
          activeDates: [],
        },
        totalAverageScore: 77.2,
        totalAnswerCount: 89,
        categoryStats: {
          자료구조: { averageScore: 65, answerCount: 8 },
          알고리즘: { averageScore: 58, answerCount: 6 },
          컴퓨터구조: { averageScore: 72, answerCount: 7 },
          운영체제: { averageScore: 85, answerCount: 9 },
          네트워크: { averageScore: 70, answerCount: 5 },
          데이터베이스: { averageScore: 88, answerCount: 8 },
          소프트웨어공학: { averageScore: 92, answerCount: 4 },
          디자인패턴: { averageScore: 75, answerCount: 6 },
          웹프론트엔드: { averageScore: 80, answerCount: 12 },
          웹백엔드: { averageScore: 95, answerCount: 15 },
          클라우드: { averageScore: 82, answerCount: 9 },
        },
      };
      setStatistics(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // 잔디 데이터 생성 (최근 365일)
  function generateGrassData() {
    const today = new Date();
    const data = {};

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      // 랜덤하게 활동 여부 결정 (70% 확률로 활동)
      data[dateStr] = Math.random() > 0.3;
    }

    return data;
  }

  // 티어별 색상 및 아이콘
  const getTierInfo = (tier) => {
    const tierConfig = {
      뉴비: {
        color: "#9CA3AF",
        icon: "🌱",
        bgColor: "bg-gray-100-custom",
      } /* 커스텀 클래스 사용 */,
      루키: { color: "#10B981", icon: "🌿", bgColor: "bg-green-100-custom" },
      에이스: { color: "#3B82F6", icon: "⭐", bgColor: "bg-blue-100-custom" },
      마스터: { color: "#8B5CF6", icon: "💎", bgColor: "bg-purple-100-custom" },
      레전드: { color: "#F59E0B", icon: "👑", bgColor: "bg-yellow-100-custom" },
    };
    return tierConfig[tier] || tierConfig.뉴비;
  };

  // 잔디 컴포넌트
  const GrassCalendar = ({ dailyActivity }) => {
    const today = new Date();
    const yearAgo = new Date(today);
    yearAgo.setFullYear(today.getFullYear() - 1);

    // 요일 레이블
    const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

    // 최근 1년간의 모든 날짜를 주/요일 구조로 생성
    const weeks = [];
    const startDate = new Date(yearAgo);

    // 시작 날짜를 일요일로 맞춤
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    // 53주 정도의 데이터 생성 (1년 + 여유분)
    for (let week = 0; week < 53; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * 7 + day);

        const dateStr = currentDate.toISOString().split("T")[0];
        const isActive = dailyActivity[dateStr] || false;
        const isInRange = currentDate >= yearAgo && currentDate <= today;

        weekData.push({
          date: dateStr,
          isActive: isActive && isInRange,
          isInRange,
          day: currentDate.getDay(),
        });
      }
      weeks.push(weekData);
    }

    return (
      <div className="grass-calendar-container">
        <div className="grass-header">
          <h3 className="grass-title">📚 일일 문제 풀이</h3>
          <div className="grass-legend">
            <span>적음</span>
            <div className="flex-gap-1-custom">
              {" "}
              {/* flex gap-1 */}
              <div className="grass-legend-item-base grass-legend-item-gray-700"></div>
              <div className="grass-legend-item-base grass-legend-item-green-300"></div>
              <div className="grass-legend-item-base grass-legend-item-green-500"></div>
              <div className="grass-legend-item-base grass-legend-item-green-700"></div>
            </div>
            <span>많음</span>
          </div>
        </div>

        <div className="grass-grid-wrapper">
          {/* 요일 레이블 */}
          <div className="grass-day-labels">
            {dayLabels.map((label, index) => (
              <div key={index} className="grass-day-label-item">
                {index % 2 === 1 ? label : ""}
              </div>
            ))}
          </div>

          {/* 잔디 그리드 */}
          <div className="grass-grid">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grass-week-column">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`grass-day-cell ${
                      day.isInRange
                        ? day.isActive
                          ? "grass-day-active"
                          : "grass-day-inactive"
                        : "grass-day-out-of-range"
                    }`}
                    title={
                      day.isInRange
                        ? `${day.date} - ${
                            day.isActive ? "활동함" : "활동 없음"
                          }`
                        : ""
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-page-container">
        <div className="dashboard-loading-text">통계를 불러오는 중...</div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="dashboard-page-container">
        <div className="dashboard-loading-text">
          통계 데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo(statistics.tierInfo.currentTier);

  // 차트 데이터 준비
  const chartData = Object.entries(statistics.categoryStats).map(
    ([category, stats]) => ({
      name: category.length > 4 ? category.substring(0, 4) + ".." : category,
      fullName: category,
      score: stats.averageScore,
      count: stats.answerCount,
    })
  );

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-main-content">
        {/* 헤더 */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">CS 학습 진도표</h1>
          <div className="header-controls">
            <button
              onClick={fetchStatistics}
              className="refresh-button"
              disabled={loading}
            >
              <span>🔄</span>
              {loading ? "새로고침 중..." : "새로고침"}
            </button>
            <div className="stats-icon-text">📊 통계</div>
          </div>
        </div>

        {/* 상단 영역: 사용자 정보 + 티어 진행률 */}
        <div className="top-section-grid">
          {/* 사용자 프로필 */}
          <div className="profile-card">
            <div className="profile-avatar">
              {statistics.userName.charAt(0)}
            </div>
            <h2 className="profile-username">{statistics.userName}</h2>
            <div className={`tier-badge ${tierInfo.bgColor}`}>
              <span className="tier-badge-icon">{tierInfo.icon}</span>
              <span
                className="tier-badge-text"
                style={{ color: tierInfo.color }}
              >
                {statistics.tierInfo.currentTier}
              </span>
            </div>
          </div>

          {/* 티어 진행률 */}
          <div className="tier-progress-card">
            <div className="tier-progress-header">
              <h3 className="tier-progress-title">🏆 다음 티어까지...</h3>
              <span className="tier-progress-percent">
                {statistics.tierInfo.progressPercent}/100
              </span>
            </div>

            <div className="progress-bar-background">
              <div
                className="progress-bar-fill"
                style={{ width: `${statistics.tierInfo.progressPercent}%` }}
              />
            </div>

            <div className="tier-message-container">
              <p>{statistics.tierInfo.progressMessage}</p>
              {statistics.tierInfo.nextTier && (
                <p className="tier-next-tier-text">
                  다음 티어:{" "}
                  <span className="tier-next-tier-highlight">
                    {statistics.tierInfo.nextTier}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 잔디 영역 */}
        <div className="grass-calendar-container">
          <GrassCalendar dailyActivity={statistics.grassData.dailyActivity} />
        </div>

        {/* 카테고리별 평균 점수 차트 */}
        <div className="chart-card">
          <h3 className="chart-title">✨ 카테고리별 평균 점수</h3>
          <div className="chart-responsive-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                  formatter={(value, name) => [
                    `${value}점`,
                    name === "score" ? "평균 점수" : name,
                  ]}
                  labelFormatter={(label) => {
                    const item = chartData.find((d) => d.name === label);
                    return item ? item.fullName : label;
                  }}
                />
                <Bar dataKey="score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 하단 통계 카드들 */}
        <div className="stats-cards-grid">
          {/* 완료한 문제 */}
          <div className="stat-card">
            <div className="stat-value stat-value-blue">
              {statistics.totalAnswerCount}
            </div>
            <div className="stat-label">완료한 문제</div>
          </div>

          {/* 평균 점수 */}
          <div className="stat-card">
            <div className="stat-value stat-value-green">
              {statistics.totalAverageScore}
            </div>
            <div className="stat-label">평균 점수</div>
          </div>

          {/* 최장 연속 학습 */}
          <div className="stat-card">
            <div className="stat-value stat-value-purple">
              {statistics.grassData.maxConsecutiveDays}
            </div>
            <div className="stat-label">최장 연속 학습</div>
          </div>
        </div>

        {/* 카테고리별 상세 통계 */}
        <div className="category-stats-container">
          <h3 className="category-stats-title">📋 카테고리별 상세 통계</h3>
          <div className="category-stats-grid">
            {Object.entries(statistics.categoryStats).map(
              ([category, stats]) => (
                <div key={category} className="category-item-card">
                  <div className="category-item-header">
                    <h4 className="category-item-title">{category}</h4>
                    <span className="category-item-count">
                      {stats.answerCount}개
                    </span>
                  </div>
                  <div className="category-item-score">
                    {stats.averageScore.toFixed(1)}점
                  </div>
                  <div className="category-progress-background">
                    <div
                      className="category-progress-fill"
                      style={{ width: `${stats.averageScore}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
