import * as React from 'react';
import { DefaultButton, Panel, Dropdown, Label } from '@fluentui/react';

const colorOptions = [
    { key: '#0078d4', text: 'Blue' },
    { key: '#e81123', text: 'Red' },
    { key: '#107c10', text: 'Green' },
    { key: '#605e5c', text: 'Gray' }
];

const fontOptions = [
    { key: 'Segoe UI', text: 'Segoe UI' },
    { key: 'Arial', text: 'Arial' },
    { key: 'Courier New', text: 'Courier New' },
    { key: 'Verdana', text: 'Verdana' }
];

export const CustomNav: React.FC = () => {
    // Load settings from localStorage or set defaults
    const [color, setColor] = React.useState(localStorage.getItem('navColor') || '#0078d4');
    const [font, setFont] = React.useState(localStorage.getItem('navFont') || 'Segoe UI');
    const [showPanel, setShowPanel] = React.useState(false);

    // Example nav items
    const navItems = [
        { title: 'Home', url: '/' },
        { title: 'Projects', url: '/sites/projects' },
        { title: 'Reports', url: '/sites/reports' }
    ];

    const openPanel = () => setShowPanel(true);
    const closePanel = () => setShowPanel(false);

    // Update settings and persist to localStorage
    const onColorChange = (_: any, option: any) => {
        setColor(option.key);
        localStorage.setItem('navColor', option.key);
    };
    const onFontChange = (_: any, option: any) => {
        setFont(option.key);
        localStorage.setItem('navFont', option.key);
    };

    return (
        <>
            <nav
                style={{
                    background: color,
                    color: '#fff',
                    padding: '12px 24px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    display: 'flex',
                    fontFamily: font
                }}
            >
                <div style={{ flex: 1 }}>
                    {navItems.map(item => (
                        <a
                            key={item.title}
                            href={item.url}
                            style={{
                                color: '#fff',
                                textDecoration: 'none',
                                marginRight: '24px',
                                fontFamily: font
                            }}
                        >
                            {item.title}
                        </a>
                    ))}
                </div>
                <DefaultButton text="⚙️" onClick={openPanel} />
            </nav>
            <Panel
                isOpen={showPanel}
                onDismiss={closePanel}
                headerText="Customize Navigation"
                closeButtonAriaLabel="Close"
            >
                <Label>Choose Nav Color</Label>
                <Dropdown
                    options={colorOptions}
                    selectedKey={color}
                    onChange={onColorChange}
                />
                <Label>Choose Font</Label>
                <Dropdown
                    options={fontOptions}
                    selectedKey={font}
                    onChange={onFontChange}
                />
            </Panel>
        </>
    );
};
export default CustomNav;
