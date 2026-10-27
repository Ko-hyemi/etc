// 댓글 키워드 → 자동 DM 규칙
//
// - mediaId: 특정 게시물에만 적용하려면 게시물 ID를 적어요. 생략하면 모든 게시물에 적용돼요.
//   (게시물 ID는 댓글이 달렸을 때 Vercel 로그에 찍혀요)
// - keywords: 댓글에 이 중 하나라도 들어 있으면 DM을 보내요. 대소문자와 띄어쓰기는 무시해요.
// - message: 댓글 작성자에게 보낼 DM 내용
// - publicReply: (선택) 댓글에 공개로 달 답글. 생략하면 답글을 달지 않아요.
//
// 위에서부터 차례로 확인해서 처음 맞는 규칙 하나만 적용해요.
export const rules = [
  {
    keywords: ['링크', 'link'],
    message: '안녕하세요! 요청하신 링크 보내드려요 👉 https://example.com',
    publicReply: 'DM으로 보내드렸어요! 💌',
  },
];
