// src/pages/Mission3.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserIndex } from '../utils/session';

const Mission3: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

      const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL ?? 'http://3.36.53.174:81')

  useEffect(() => {
    const storedIndex = getUserIndex();
    if (storedIndex == null) {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      navigate('/');
      return;
    }
    setIndex(storedIndex);
  }, [navigate]);

  const updateWordAndGoStart = async () => {
    if (!API_BASE_URL) {
      alert('API 서버 주소가 설정되지 않았습니다.');
      return;
    }
    if (index == null) {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      navigate('/');
      return;
    }

    try {
      setLoading(true);

      await fetch(`${API_BASE_URL}/words`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index,
          position: 2, // w2
          value: 'T',
        }),
      });

      navigate('/start');
    } catch (error) {
      console.error(error);
      alert('단어 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = answer.trim();

    if (trimmed === '김용준') {
      alert('정답!');
      await updateWordAndGoStart();
    } else {
      alert('땡!!');
    }

    setAnswer('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        padding: '24px',
      }}
    >
      <h1 style={{ fontSize: '28px' }}>퀴즈 퀴즈!!</h1>

      <div style={{ textAlign: 'center', marginTop: '8px', lineHeight: 1.6 }}>
        <div>지난 싸피 회식 가장 늦게 온 사람의 이름은??</div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '360px',
        }}
      >
        <input
          type="text"
          placeholder="이름을 입력하세요"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? '처리 중...' : '제출'}
        </button>
      </form>
    </div>
  );
};

export default Mission3;
