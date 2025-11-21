// Start.tsx — ★★ 여기 새 기능 포함됨 ★★

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserIndex } from '../utils/session';

const INITIAL_WORDS = Array(6).fill('?');

const Start: React.FC = () => {
  const navigate = useNavigate();

  const [index, setIndex] = useState<number | null>(null);
  const [words, setWords] = useState<string[]>(INITIAL_WORDS);
  const [inputWord, setInputWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingWords, setFetchingWords] = useState(false);

  const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL ?? 'http://3.36.53.174')

  /** 로그인 index 가져오기 */
  useEffect(() => {
    const storedIndex = getUserIndex();
    if (storedIndex == null) {
      alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      navigate('/');
      return;
    }
    setIndex(storedIndex);
  }, [navigate]);

  /** words fetch */
  const fetchWords = async (userIndex: number) => {
    try {
      setFetchingWords(true);

      const res = await fetch(`${API_BASE_URL}/api/words?index=${userIndex}`);
      if (!res.ok) return;

      const data: { words: string[] } = await res.json();
      const padded = [...data.words];
      while (padded.length < 6) padded.push('?');

      setWords(padded.slice(0, 6));
    } finally {
      setFetchingWords(false);
    }
  };

  /** index 있을 때 단어 가져오기 */
  useEffect(() => {
    if (index != null) {
      fetchWords(index);
    }
  }, [index]);

  /** ★★ 새 기능: 모든 단어가 다 채워졌다면 축하 팝업 ★★ */
  useEffect(() => {
    if (words.length === 6 && words.every((w) => w !== '?')) {
      alert('축하합니다 싸탈하셨습니다!!');
    }
  }, [words]);

  /** 단어 입력 처리 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = inputWord.trim();
    if (!trimmed) return;

    switch (trimmed) {
      case 'ZoHoEnn': navigate('/mission15345'); break;
      case 'SSaFY': navigate('/mission223542452'); break;
      case '취뽀': navigate('/mission33462462'); break;
      case '우주최강존잘남한현진': navigate('/mission413451345'); break;

      case 'a':
        alert('축하합니다! 숨겨진 단어를 찾으셨습니다.');
        await updateWordOnServer(0, 'S');
        break;

      case 'ㄱ':
        alert('축하합니다! 숨겨진 단어를 찾으셨습니다.');
        await updateWordOnServer(5, 'L');
        break;

      default:
        alert('등록되지 않은 단어입니다.');
    }

    setInputWord('');
  };

  /** DB update */
  const updateWordOnServer = async (position: number, value: string) => {
    if (index == null || !API_BASE_URL) return;

    await fetch(`${API_BASE_URL}/api/words`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index, position, value }),
    });

    await fetchWords(index);
  };

  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px' }}>싸탈을 향하여</h1>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
        {words.map((w, idx) => (
          <div key={idx} style={{
            width: '40px',
            height: '40px',
            border: '1px solid #ccc',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {fetchingWords ? '' : w}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
        <input
          type="text"
          value={inputWord}
          placeholder="단어를 입력하세요"
          onChange={(e) => setInputWord(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <button type="submit" style={{ marginTop: '12px', padding: '10px' }}>
          확인
        </button>
      </form>
    </div>
  );
};

export default Start;
