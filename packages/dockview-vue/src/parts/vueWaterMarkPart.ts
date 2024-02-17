import type {
    PanelUpdateEvent,
    DockviewGroupPanel,
    GroupPanelPartInitParameters,
    IWatermarkRenderer,
    WatermarkRendererInitParameters,
    DockviewApi,
    IDockviewGroupPanel,
} from 'dockview-core';
import { render, type Component, h, reactive, getCurrentInstance, type VNode } from 'vue';

export interface IWatermarkPanelProps {
    containerApi: DockviewApi;
    group?: IDockviewGroupPanel;
    close: () => void;
}

export class VueWatermarkPart implements IWatermarkRenderer {
    private _element: HTMLElement;
    private part?: VNode;

    private props: any;

    get element(): HTMLElement {
        return this._element;
    }

    constructor(
        public readonly id: string,
        private readonly component: Component<IWatermarkPanelProps>
    ) {
        this._element = document.createElement('div');
        this._element.className = 'dockview-vue-part';
    }

    init(parameters: WatermarkRendererInitParameters): void {
        this.props = reactive({
            api: parameters.containerApi,
            containerApi: parameters.containerApi,
            close: () => {
                if (parameters.group) {
                    parameters.containerApi.removeGroup(parameters.group);
                }
            },
        })
        this.part = h(this.component, this.props);
        this.part.appContext = getCurrentInstance()?.appContext ?? null;
        render(h(this.part), this._element);
    }

    focus(): void {
        // noop
    }

    update(event: PanelUpdateEvent): void {
        if (!this.part) return;

        this.props.params = event.params;
        this.part.props = this.props;

        render(this.part, this._element);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    layout(_width: number, _height: number): void {
        // noop - retrieval from api
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateParentGroup(
        _group: DockviewGroupPanel,
        _isPanelVisible: boolean
    ): void {
        // noop
    }

    dispose(): void {
        if(this.part) {
            render(null, this._element)
        }
    }
}
