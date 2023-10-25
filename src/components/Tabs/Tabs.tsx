import {ReactNode, useEffect, useState, lazy, Suspense} from "react";
import {Link, useLocation} from "react-router-dom";

import tabs from "../../assets/tabs.json";

import styles from './tabs.module.css';

const sortedTabs = tabs.sort((a, b) => a.order > b.order ? 1 : -1);

export const Tabs = () => {
    const [activeTab, setActiveTab] = useState(null);
    const [Comp, setComp] = useState<ReactNode>(null);
    const { pathname } = useLocation();

    const getFile = (path: string) => {
        const folderPath = `./${path}`;

        setComp(lazy(() => import(folderPath)));
    }

    useEffect(() => {
        const openTab = sortedTabs.find((tab) => pathname.includes(tab.id));


        if (!openTab) {
            window.open(sortedTabs[0].id, '_self' ); // it's necessary for the default first page
        } else {
            setActiveTab(openTab);
            getFile(openTab.path);

        }

    }, []);

    const handleChange = (value: number) => {
        const activeTab = sortedTabs[value];

        setActiveTab(activeTab);
        getFile(activeTab.path);
    }

    return (activeTab &&
        <div>
            <div className={styles.tabList}>
                {sortedTabs.map((tab) => {
                    return <Link className={activeTab.order === tab.order ? styles.activeTab : styles.tab} key={tab.id} to={tab.id} onClick={() => handleChange(tab.order)}>{tab.title}</Link>
                })}
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                {Comp && <Comp />}
            </Suspense>
        </div>
    );
};
