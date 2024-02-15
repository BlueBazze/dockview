import {
    DockviewApi,
    DockviewEmitter,
    DockviewEvent,
    type DockviewPanelApi,
    type GroupPanelContentPartInitParameters,
    type IContentRenderer,
    type PanelUpdateEvent,
} from 'dockview-core';
import { type VNode, render, type Component, h } from 'vue';
import type { IDockviewPanelProps } from '../types/panel';

export class VuePanelContentPart implements IContentRenderer {
    private _element: HTMLElement;
    private part?: VNode; // globalThis.Component<IDockviewPanelProps>

    private _api: DockviewPanelApi | undefined;
    private _containerApi: DockviewApi | undefined;

    private readonly _onDidFocus = new DockviewEmitter<void>();
    readonly onDidFocus: DockviewEvent<void> = this._onDidFocus.event;

    private readonly _onDidBlur = new DockviewEmitter<void>();
    readonly onDidBlur: DockviewEvent<void> = this._onDidBlur.event;

    get element(): HTMLElement {
        return this._element;
    }

    constructor(
        public readonly id: string,
        private readonly component: Component<IDockviewPanelProps>
    ) {
        this._element = document.createElement('div');
        this._element.className = 'dockview-vue-part';
    }

    focus(): void {
        // TODO
    }

    public init(parameters: GroupPanelContentPartInitParameters): void {
        this._api = parameters.api;
        this._containerApi = parameters.containerApi;

        this.part = h(this.component, {
            api: parameters.api,
            containerApi: parameters.containerApi,
            params: parameters.params,
        });
        render(h(this.part), this._element);
        // this.part = new ReactPart(
        //     this.element,
        //     this.component,
        //     {
        //         params: parameters.params,
        //         api: parameters.api,
        //         containerApi: parameters.containerApi,
        //     }
        // );
    }

    public update(event: PanelUpdateEvent) {
        if (!this.part || !this._api || !this._containerApi) {
            this.dispose();
            return;
        }
        // this.part? //.update(event.params)
        if (this.part?.props?.params) this.part.props.params = event.params;
        // event
        this.part = h(this.component, {
            api: this._api,
            containerApi: this._containerApi,
            params: event.params,
        });
        render(h(this.part), this._element);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public layout(_width: number, _height: number): void {}

    public dispose(): void {
        this._onDidFocus.dispose();
        this._onDidBlur.dispose();
        // this.part?.dispose()
    }
}
