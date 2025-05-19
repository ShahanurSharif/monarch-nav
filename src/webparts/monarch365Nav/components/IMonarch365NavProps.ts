import {WebPartContext} from "@microsoft/sp-webpart-base";

export interface IMonarch365NavProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  // Add new properties for navigation
  listName: string;
  spContext: WebPartContext; // Will use this to pass the SharePoint context
}

// Define a navigation item interface
export interface INavigationItem {
  id: number;
  title: string;
  url: string;
  iconName?: string; // For optional icons
  openInNewTab?: boolean;
  parentId?: number; // For hierarchical structure
  children?: INavigationItem[]; // For dropdown menus
  order: number; // For sorting
  isActive?: boolean; // To mark the active navigation item
}