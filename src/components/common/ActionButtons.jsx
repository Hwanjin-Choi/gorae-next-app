import styled from "styled-components";
import {
  AiOutlineLike,
  AiFillLike,
  AiTwotoneCrown,
  AiFillCrown,
} from "react-icons/ai";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem; /* 16px */
  padding: 1.5rem; /* 24px */
  border-radius: 8px;
  transition: background-color 0.3s ease;
  font-family: ${({ theme }) => theme.font.family.main};
`;

const LikeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  gap: 0.5rem; /* 8px */

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.font.size.h4}; /* 24px */
  color: ${({ theme, $isLiked }) =>
    $isLiked ? theme.error : theme.text_subtle};
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const LikeCount = styled.span`
  font-size: ${({ theme }) => theme.font.size.body}; /* 16px */
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.text};
  min-width: 20px;
`;

const AdoptButton = styled.button`
  background-color: ${({ theme }) => theme.success};
  color: ${({ theme }) =>
    theme.bg_page}; /* 성공 버튼의 텍스트는 밝은 색이 어울립니다 */
  border: none;
  border-radius: 6px;
  padding: 0.625rem 1.25rem; /* 10px 20px */
  font-size: ${({ theme }) => theme.font.size.caption}; /* 14px */
  font-weight: ${({ theme }) => theme.font.weight.bold};
  cursor: pointer;
  transition: background-color 0.2s ease, filter 0.2s ease;

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.text_subtle};
    color: ${({ theme }) => theme.text};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// =============================================================================
// 3. ⚙️ 핵심 버튼 컴포넌트
// =============================================================================

const ActionButtons = ({
  likeCount,
  likeStatus,
  onLikeClick,
  onAdoptClick,
  adopt,
  isAuthor,
  isAdopted,
}) => {
  return (
    <Wrapper>
      <LikeContainer onClick={onLikeClick}>
        <LikeButton
          $likeStatus={likeStatus}
          aria-label="좋아요 버튼"
          disabled={likeStatus}
        >
          {likeStatus ? <AiFillLike /> : <AiOutlineLike />}
        </LikeButton>
        <LikeCount>{likeCount} 개</LikeCount>
      </LikeContainer>

      {!isAdopted && isAuthor && (
        <LikeContainer onClick={onAdoptClick}>
          <LikeButton aria-label="채택 버튼">{<AiTwotoneCrown />}</LikeButton>
          <LikeCount>{"채택하기"}</LikeCount>
        </LikeContainer>
      )}

      {isAdopted && adopt && (
        <LikeContainer>
          <LikeButton aria-label="채택 버튼">{<AiFillCrown />}</LikeButton>
          <LikeCount>{"채택 된 답변"}</LikeCount>
        </LikeContainer>
      )}
    </Wrapper>
  );
};

export default ActionButtons;
