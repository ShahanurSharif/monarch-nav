import * as React from 'react';
import { DefaultButton, Panel, Dropdown, Label, IDropdownOption } from '@fluentui/react';
import {ApplicationCustomizerContext} from "@microsoft/sp-application-base";
import styles from './CustomNav.module.scss';

const colorOptions: IDropdownOption[] = [
    { key: '#0078d4', text: 'Blue' },
    { key: '#e81123', text: 'Red' },
    { key: '#107c10', text: 'Green' },
    { key: '#605e5c', text: 'Gray' }
];

const fontOptions: IDropdownOption[] = [
    { key: 'Segoe UI', text: 'Segoe UI' },
    { key: 'Arial', text: 'Arial' },
    { key: 'Courier New', text: 'Courier New' },
    { key: 'Verdana', text: 'Verdana' }
];

export interface ICustomNavProps {
    context: ApplicationCustomizerContext;
}
const CustomNav: React.FC<ICustomNavProps> = () => {
    const [color, setColor] = React.useState<string>(localStorage.getItem('navColor') || '#0078d4');
    const [font, setFont] = React.useState<string>(localStorage.getItem('navFont') || 'Segoe UI');
    const [showPanel, setShowPanel] = React.useState<boolean>(false);
    const navStyle: React.CSSProperties = {
        // Regular styles go here
        color: '#fff',
        padding: '12px 24px',
        fontSize: '18px',
        fontWeight: 'bold',
        display: 'flex',
        // ...other static styles
    };

// Add dynamic CSS variables separately (avoids 'as any')
    const cssVars = {
        '--nav-bg': color,
        '--nav-font': font
    } as React.CSSProperties;
    const navItems = [
        { title: 'Home', url: '/' },
        { title: 'Projects', url: '/sites/projects' },
        { title: 'Reports', url: '/sites/reports' }
    ];

    const openPanel = (): void => setShowPanel(true);
    const closePanel = (): void => setShowPanel(false);

    const onColorChange = (
        event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption
    ): void => {
        if (option) {
            setColor(option.key as string);
            localStorage.setItem('navColor', option.key as string);
        }
    };

    const onFontChange = (
        event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption
    ): void => {
        if (option) {
            setFont(option.key as string);
            localStorage.setItem('navFont', option.key as string);
        }
    };

    return (
        <>
            <nav className={styles.customNavBar} style={{ ...navStyle, ...cssVars }}>
                <div style={{ flex: 1 }}>
                    {navItems.map(item => (
                        <a key={item.title} href={item.url} className={styles.customNavLink}>
                            {item.title}
                        </a>
                    ))}
                </div>
                <DefaultButton text="monarch edit" onClick={openPanel} className={styles.settingsButton}/>
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
