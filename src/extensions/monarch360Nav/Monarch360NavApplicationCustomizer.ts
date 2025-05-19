import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PlaceholderName, Placeholder } from '@microsoft/sp-application-base';

import CustomNav from './components/CustomNav';

const LOG_SOURCE: string = 'Monarch360NavApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IMonarch360NavApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class Monarch360NavApplicationCustomizer
  extends BaseApplicationCustomizer<IMonarch360NavApplicationCustomizerProperties> {
  private _topPlaceholder: Placeholder | undefined;
  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(
        this,
        this._renderPlaceholders.bind(this)
    );
    return Promise.resolve();
  }
  
  private _renderPlaceholders(): void {
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose }
      )
      if (this._topPlaceholder && this._topPlaceholder.domElement) {
        ReactDOM.render(<CustomNav context={this.context} />, this._topPlaceholder.domElement); 
      }
    }
  }
}
