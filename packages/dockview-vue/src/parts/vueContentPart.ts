import {
    DockviewApi,
    DockviewEmitter,
    DockviewEvent,
    type DockviewPanelApi,
    type GroupPanelContentPartInitParameters,
    type IContentRenderer,
    type PanelUpdateEvent,
} from 'dockview-core';
import {
    type VNode,
    render,
    type Component,
    h,
    reactive,
    getCurrentInstance,
} from 'vue';
import type { IDockviewPanelProps } from '../types/panel';

export class VuePanelContentPart implements IContentRenderer {
    private _element: HTMLElement;
    private part?: VNode; // globalThis.Component<IDockviewPanelProps>

    private props: any;

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
        this.props = reactive({
            api: parameters.api,
            containerApi: parameters.containerApi,
            params: parameters.params,
        });
        this.part = h(this.component, this.props);
        this.part.appContext = getCurrentInstance()?.appContext ?? null;
        render(h(this.part), this._element);
    }

    public update(event: PanelUpdateEvent) {
        if (!this.part) {
            return;
        }

        this.props.params = event.params;
        this.part.props = this.props;

        render(this.part, this._element);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public layout(_width: number, _height: number): void {}

    public dispose(): void {
        this._onDidFocus.dispose();
        this._onDidBlur.dispose();

        if (this.part) {
            render(null, this._element);
        }
    }
}
