import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, NavLink, Routes, Navigate, useLocation } from 'react-router-dom';
import tabData from './data/tabs.json';

// import './index.css';

const tabs = tabData.sort((a, b) => a.order - b.order);

const TabContent = () => {
    const location = useLocation();
    const currentTab = tabs.find((tab) => location.pathname.endsWith(tab.id));

    if (!currentTab) {
        return <Navigate to={`/${tabs[0].id}`} />;
    }

    const TabComponent = React.lazy(() => import(`./${currentTab.path}`));

    return (
        <div>
            <React.Suspense fallback={<div>Loading...</div>}>
                <TabComponent />
            </React.Suspense>
        </div>
    );
};

const App = () => (
    <BrowserRouter>
        <div>
            <h1>Primitive CMS</h1>
            <nav>
                <ul className={'nav'}>
                    {tabs.map((tab) => (
                        <li key={tab.id}>
                            <NavLink to={`/${tab.id}`}
                                className={({ isActive }) => isActive ? 'active' : '' }
                            >
                                {tab.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
        <div>
            <Routes>
                <Route path="/" element={<TabContent />} />
                {tabs.map((tab) => (
                    <Route key={tab.id} path={`/${tab.id}`} element={<TabContent />} />
                ))}
            </Routes>
        </div>
    </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
