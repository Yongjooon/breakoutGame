// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserIndex } from '../utils/session';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL ?? 'http://3.36.53.174')

    if (!API_BASE_URL) {
      alert('API 서버 주소가 설정되지 않았습니다. VITE_API_BASE_URL를 확인해주세요.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      if (!res.ok) {
        // 401 등 실패
        alert('아이디,비밀번호가 다릅니다.');
        return;
      }

      const data: { index: number } = await res.json();

      // 세션에 index 저장
      setUserIndex(data.index);

      // Start 페이지로 이동
      navigate('/start');
    } catch (error) {
      console.error(error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
      }}
    >
      <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>싸탈을 향하여</h1>

      <form
        onSubmit={handleLogin}
        style={{
          width: '100%',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default Login;
