import { useState, useEffect, Children, isValidElement } from 'react';

export const SyncedTab = ({ children }) => <>{children}</>;
SyncedTab.displayName = 'SyncedTab';

export const SyncedTabs = ({ children }) => {
  const tabs = Children.toArray(children).filter((c) => {
    if (!isValidElement(c)) return false;
    const t = c.type;
    return t === SyncedTab || t?.displayName === 'SyncedTab' || t?.name === 'SyncedTab';
  });

  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (e) => {
      const next = e.detail;
      setActive(next < tabs.length ? next : tabs.length - 1);
    };
    window.addEventListener('synced-tabs-change', handler);
    return () => window.removeEventListener('synced-tabs-change', handler);
  }, [tabs.length]);

  const select = (i) => {
    setActive(i);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('synced-tabs-change', { detail: i }));
    }
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', margin: '1rem 0' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => select(i)}
            suppressHydrationWarning
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: mounted && active === i ? '2px solid #3b82f6' : '2px solid transparent',
              color: mounted && active === i ? '#3b82f6' : '#6b7280',
            }}
          >
            {tab.props.title}
          </button>
        ))}
      </div>
      <div style={{ padding: '1rem' }} suppressHydrationWarning>
        {tabs[active]?.props.children}
      </div>
    </div>
  );
};