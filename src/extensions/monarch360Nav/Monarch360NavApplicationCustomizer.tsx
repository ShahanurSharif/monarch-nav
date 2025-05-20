import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer, PlaceholderName, PlaceholderContent } from '@microsoft/sp-application-base';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CustomNav from '../components/CustomNav';

export interface IMonarch360NavApplicationCustomizerProps {}

export default class Monarch360NavApplicationCustomizer
    extends BaseApplicationCustomizer<IMonarch360NavApplicationCustomizerProps> {
  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(
        this,
        this._renderPlaceholders
    );
    return Promise.resolve();
  }

  private _renderPlaceholders(): void {
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose }
      );
      if (this._topPlaceholder && this._topPlaceholder.domElement) {
        ReactDOM.render(<CustomNav context={this.context} />, this._topPlaceholder.domElement);
      }
    }
  }

  private _onDispose(): void {
    if (this._topPlaceholder && this._topPlaceholder.domElement) {
      ReactDOM.unmountComponentAtNode(this._topPlaceholder.domElement);
    }
  }
}
