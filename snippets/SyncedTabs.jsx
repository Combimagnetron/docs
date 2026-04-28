export const SyncedTab = ({ children }) => <>{children}</>;
SyncedTab.displayName = 'SyncedTab';

export const SyncedTabs = ({ children }) => {
  const tabs = React.Children.toArray(children).filter((c) => {
    if (!React.isValidElement(c)) return false;
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
    <>
      <style>{`
        .synced-tabs {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          margin: 1rem 0;
          background: #ffffff;
        }
        .synced-tabs-header {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background: #ffffff;
        }
        .synced-tabs-button {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .synced-tabs-button:hover {
          color: #000000;
        }
        .synced-tabs-button[data-active="true"] {
          color: #000000;
          border-bottom-color: #000000;
        }
        .synced-tabs-content {
          padding: 1rem;
          background: #ffffff;
        }
        .dark .synced-tabs {
          border-color: #1f1f1f;
          background: #000000;
        }
        .dark .synced-tabs-header {
          background: #000000;
          border-bottom-color: #1f1f1f;
        }
        .dark .synced-tabs-button {
          color: #9ca3af;
        }
        .dark .synced-tabs-button:hover {
          color: #ffffff;
        }
        .dark .synced-tabs-button[data-active="true"] {
          color: #ffffff;
          border-bottom-color: #ffffff;
        }
        .dark .synced-tabs-content {
          background: #000000;
        }
      `}</style>
      <div className="synced-tabs">
        <div className="synced-tabs-header">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => select(i)}
              data-active={mounted && active === i}
              className="synced-tabs-button"
              suppressHydrationWarning
            >
              {tab.props.title}
            </button>
          ))}
        </div>
        <div className="synced-tabs-content" suppressHydrationWarning>
          {tabs[active]?.props.children}
        </div>
      </div>
    </>
  );
};