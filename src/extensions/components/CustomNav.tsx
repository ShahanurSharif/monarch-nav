import * as React from 'react';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';

export interface ICustomNavProps {
    context: ApplicationCustomizerContext;
}

const navItems = [
    { title: 'Home', url: '/' },
    { title: 'Projects', url: '/sites/projects' },
    { title: 'Reports', url: '/sites/reports' }
];

const CustomNav: React.FC<ICustomNavProps> = (props): JSX.Element => {
    return (
        <nav style={{ background: '#323130', color: '#fff', padding: '10px' }}>
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                {navItems.map(item => (
                    <li key={item.title} style={{ marginRight: 24 }}>
                        <a href={item.url} style={{ color: '#fff', textDecoration: 'none' }}>
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default CustomNav;
