import type {
    PanelUpdateEvent,
    ITabRenderer,
    GroupPanelPartInitParameters,
} from 'dockview-core';
import type { IGroupPanelBaseProps } from '../types/panel';
import { render, type Component, h } from 'vue';

export class VuePanelHeaderPart implements ITabRenderer {
    private _element: HTMLElement;
    private part?: Component<IGroupPanelBaseProps>;
    private elRef: any;

    get element(): HTMLElement {
        return this._element;
    }

    constructor(
        public readonly id: string,
        private readonly component: Component<IGroupPanelBaseProps>
    ) {
        this._element = document.createElement('div');
        this._element.className = 'dockview-vue-part';
    }

    focus(): void {
        //noop
    }

    public init(parameters: GroupPanelPartInitParameters): void {
        this.part = h(this.component, {
            api: parameters.api,
            containerApi: parameters.containerApi,
            params: parameters.params,
        });
        render(h(this.part), this._element);
    }

    public update(event: PanelUpdateEvent): void {
        if(!this.part) return
        // this.part?.update(event.params)

        // this.part = h(this.component, {
        //   api: event.params.api,
        //   containerApi: event.params.containerApi,
        //   params: event.params.params
        // })
        render(h(this.part), this._element);
        // console.log('HEADER UPDATE EVENT', event)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public layout(_width: number, _height: number): void {
        // noop - retrieval from api
    }

    public dispose(): void {
        // this.part?.dispose()
    }
}
