import * as React from 'react';
import styles from './Monarch365Nav.module.scss';
import {IMonarch365NavProps, INavigationItem} from './IMonarch365NavProps';
// import { escape } from '@microsoft/sp-lodash-subset';

// Import Fluent UI components
import {
    CommandBar,
    ICommandBarItemProps,
    IContextualMenuItem,
    // ContextualMenu,
    // IButtonStyles,
    // mergeStyles
} from '@fluentui/react';

// Import PnP SP for data fetching
import {spfi, SPFx} from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

interface ISharePointNavigationItem {
    ID: number;
    Title: string;
    URL?: { Url: string };
    ParentID?: number;
    OpenInNewTab?: boolean;
    IconName?: string;
    Order?: number;
}

export default class Monarch365Nav extends React.Component<IMonarch365NavProps, {
    navItems: INavigationItem[];
    isLoading: boolean;
    error: string | undefined;
}> {
    private sp;

    constructor(props: IMonarch365NavProps) {
        super(props);
        this.state = {
            navItems: [],
            isLoading: true,
            error: undefined
        };

        // Initialize PnP SP with context
        this.sp = spfi().using(SPFx(this.props.spContext));
    }

    public async componentDidMount(): Promise<void> {
        if (this.props.listName) {
            await this.fetchNavigationItems();
        } else {
            this.setState({
                isLoading: false,
                error: "Please configure the navigation list name in the web part properties."
            });
        }
    }
    public componentDidUpdate(prevProps: IMonarch365NavProps): void {
        if (prevProps.listName !== this.props.listName && this.props.listName) {
            this.fetchNavigationItems().catch(error => {
                console.error("Error in componentDidUpdate:", error);
            });
        }
    }
    private async fetchNavigationItems(): Promise<void> {
        try {
            this.setState({isLoading: true, error: undefined});

            // Fetch items from the specified SharePoint list
            const items = await this.sp.web.lists.getByTitle(this.props.listName)
                .items.select("ID", "Title", "URL", "ParentID", "OpenInNewTab", "IconName", "Order")
                .orderBy("Order", true)();

            // Transform the flat list into a hierarchical structure
            const navItems = this.buildNavigationHierarchy(items);

            this.setState({
                navItems,
                isLoading: false
            });
        } catch (error) {
            console.error("Error fetching navigation items:", error);
            this.setState({
                isLoading: false,
                error: "Failed to load navigation items. Please check the list name and permissions."
            });
        }
    }

    // Transform flat list items into a hierarchical structure
    private buildNavigationHierarchy(items: ISharePointNavigationItem[]): INavigationItem[] {
        // First, map the SharePoint items to our navigation interface
        const navItems: INavigationItem[] = items.map(item => ({
            id: item.ID,
            title: item.Title,
            url: item.URL?.Url || '',
            iconName: item.IconName,
            openInNewTab: item.OpenInNewTab,
            parentId: item.ParentID,
            order: item.Order || 0,
            children: []
        }));

        // Create a map for quick lookups
        const navMap = new Map<number, INavigationItem>();
        navItems.forEach(item => navMap.set(item.id, item));

        // Build the hierarchy
        const rootNavItems: INavigationItem[] = [];

        navItems.forEach(item => {
            if (item.parentId) {
                // This is a child item
                const parent = navMap.get(item.parentId);
                if (parent) {
                    if (!parent.children) {
                        parent.children = [];
                    }
                    parent.children.push(item);
                }
            } else {
                // This is a root item
                rootNavItems.push(item);
            }
        });

        // Sort children by order
        navItems.forEach(item => {
            if (item.children && item.children.length > 0) {
                item.children.sort((a, b) => a.order - b.order);
            }
        });

        // Sort root items by order
        return rootNavItems.sort((a, b) => a.order - b.order);
    }

    // Convert our navigation items to CommandBar items
    private getCommandBarItems(): ICommandBarItemProps[] {
        return this.state.navItems.map(item => {
            const commandBarItem: ICommandBarItemProps = {
                key: `nav-${item.id}`,
                text: item.title,
                iconProps: item.iconName ? {iconName: item.iconName} : undefined,
                href: item.url,
                target: item.openInNewTab ? '_blank' : undefined,
                className: styles.navItem
            };

            // Add submenu items if there are children
            if (item.children && item.children.length > 0) {
                commandBarItem.subMenuProps = {
                    items: this.getSubMenuItems(item.children)
                };
            }

            return commandBarItem;
        });
    }

    // Convert child navigation items to ContextualMenu items
    private getSubMenuItems(items: INavigationItem[]): IContextualMenuItem[] {
        return items.map(item => {
            const menuItem: IContextualMenuItem = {
                key: `nav-${item.id}`,
                text: item.title,
                iconProps: item.iconName ? {iconName: item.iconName} : undefined,
                href: item.url,
                target: item.openInNewTab ? '_blank' : undefined,
                className: styles.subNavItem
            };

            // Add nested submenu items if there are children
            if (item.children && item.children.length > 0) {
                menuItem.subMenuProps = {
                    items: this.getSubMenuItems(item.children)
                };
            }

            return menuItem;
        });
    }

    public render(): React.ReactElement<IMonarch365NavProps> {
        const {isLoading, error, navItems} = this.state;
        const {isDarkTheme} = this.props;

        if (isLoading) {
            return <div className={styles.monarch365Nav}>Loading navigation...</div>;
        }

        if (error) {
            return <div className={styles.monarch365Nav}>{error}</div>;
        }

        if (navItems.length === 0) {
            return <div className={styles.monarch365Nav}>No navigation items found. Please add items to
                the &quot;{this.props.listName}&quot; list.</div>;
        }

        // CommandBar styles
        const commandBarStyles = {
            root: {
                backgroundColor: 'transparent',
                padding: 0
            }
        };

        return (
            <div className={`${styles.monarch365Nav} ${isDarkTheme ? styles.darkTheme : ''}`}>
                <div className={styles.navContainer}>
                    <CommandBar
                        items={this.getCommandBarItems()}
                        ariaLabel="Navigation menu"
                        styles={commandBarStyles}
                    />
                </div>
            </div>
        );
    }
}