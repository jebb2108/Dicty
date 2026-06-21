import { useEffect, useState } from 'react';
import { fetchLeaderboard, fetchStats } from '../shared/api/dictionaryApi';

export default function StatsPage({ userId }) {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setStats(null);
      setLeaderboard([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [statsPayload, leaderboardPayload] = await Promise.all([
          fetchStats(userId),
          fetchLeaderboard(userId)
        ]);

        if (cancelled) return;
        setStats(statsPayload);
        setLeaderboard(leaderboardPayload);
      } catch (requestError) {
        if (cancelled) return;
        setError(requestError.message || 'Не удалось загрузить статистику');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const metrics = [
    { label: 'слов в словаре', value: stats?.total ?? '—' },
    {
      label: 'частей речи',
      value: stats
        ? Object.keys(stats)
            .filter((key) =>
              ['noun', 'verb', 'adjective', 'adverb', 'other'].includes(key)
            )
            .filter((key) => (stats[key] ?? 0) > 0).length
        : '—'
    },
    { label: 'выучено', value: stats?.learned ?? '—' },
    {
      label: 'точность',
      value: stats?.accuracy != null ? `${Math.round(stats.accuracy)}%` : '—'
    }
  ];

  return (
    <section className="page-shell">
      <section className="paper-section">
        <div className="section-heading">
          <div>
            <span>Ваша статистика</span>
            <p>Используются те же `/api/dict/stats` и `/api/dict/leaderboard` endpoints.</p>
          </div>
        </div>

        {error && <p className="page-error">{error}</p>}
        {isLoading && <p className="page-muted">Загрузка статистики…</p>}

        <div className="stats-grid">
          {metrics.map((metric) => (
            <article key={metric.label} className="stat-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="paper-section">
        <div className="section-heading">
          <div>
            <span>Таблица лидеров</span>
            <p>Текущий leaderboard рендерится без изменения backend-формата.</p>
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <div className="empty-state">
            <h3>Пока пусто</h3>
            <p>Лидеры появятся после первых записей.</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((row, index) => (
              <article
                key={`${row.nickname || 'user'}-${index}`}
                className={`leaderboard-row${row.is_me ? ' leaderboard-row--me' : ''}`}
              >
                <span>{index + 1}</span>
                <strong>{row.nickname || 'anonymous'}</strong>
                <em>{row.score ?? row.total ?? 0}</em>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
