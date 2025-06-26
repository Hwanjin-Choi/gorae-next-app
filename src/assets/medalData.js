import {
  FaRegHeart,
  FaHeart,
  FaStar,
  FaFire,
  FaSun,
  FaSeedling,
  FaGraduationCap,
  FaBookOpen,
  FaGem,
  FaCrown,
} from "react-icons/fa";

// 좋아요(Likes) 훈장 데이터
export const likeMedals = [
  { level: 1, name: "작은 온기", Icon: FaRegHeart, color: "error" },
  { level: 2, name: "따스한 마음", Icon: FaHeart, color: "error" },
  { level: 3, name: "빛나는 별", Icon: FaStar, color: "accent" },
  { level: 4, name: "타오르는 열정", Icon: FaFire, color: "accent" },
  { level: 5, name: "눈부신 태양", Icon: FaSun, color: "accent" },
];

// 채택률(Adoption) 훈장 데이터
export const adoptionMedals = [
  { level: 1, name: "새싹 지식인", Icon: FaSeedling, color: "success" },
  { level: 2, name: "학사 지식인", Icon: FaGraduationCap, color: "success" },
  { level: 3, name: "석학 지식인", Icon: FaBookOpen, color: "primary" },
  { level: 4, name: "박사 지식인", Icon: FaGem, color: "primary" },
  { level: 5, name: "지식왕", Icon: FaCrown, color: "secondary" },
];
