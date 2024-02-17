import type {
    PanelUpdateEvent,
    ITabRenderer,
    GroupPanelPartInitParameters,
} from 'dockview-core';
import type { IGroupPanelBaseProps } from '../types/panel';
import {
    render,
    type Component,
    h,
    getCurrentInstance,
    reactive,
    type VNode,
} from 'vue';

export class VuePanelHeaderPart implements ITabRenderer {
    private _element: HTMLElement;
    private part?: VNode;
    private elRef: any;

    private props: any;

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
        this.props = reactive({
            api: parameters.api,
            containerApi: parameters.containerApi,
            params: parameters.params,
        });
        this.part = h(this.component, this.props);
        this.part.appContext = getCurrentInstance()?.appContext ?? null;
        render(this.part, this._element);
    }

    public update(event: PanelUpdateEvent): void {
        if (!this.part) return;

        this.props.params = event.params;
        this.part.props = this.props;

        render(this.part, this._element);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public layout(_width: number, _height: number): void {
        // noop - retrieval from api
    }

    public dispose(): void {
        if (this.part) {
            // This will unmount the component
            render(null, this._element);
        }
    }
}
