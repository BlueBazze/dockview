import type {
    PanelUpdateEvent,
    DockviewGroupPanel,
    GroupPanelPartInitParameters,
    IWatermarkRenderer,
    WatermarkRendererInitParameters,
    DockviewApi,
    IDockviewGroupPanel,
} from 'dockview-core';
import { render, type Component, h } from 'vue';

export interface IWatermarkPanelProps {
    containerApi: DockviewApi;
    group?: IDockviewGroupPanel;
    close: () => void;
}

export class VueWatermarkPart implements IWatermarkRenderer {
    private _element: HTMLElement;
    private part?: Component<IWatermarkPanelProps>;
    private parameters: GroupPanelPartInitParameters | undefined;

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
        this.part = h(this.component, {
            api: parameters.containerApi,
            containerApi: parameters.containerApi,
            close: () => {
                if (parameters.group) {
                    parameters.containerApi.removeGroup(parameters.group);
                }
            },
        });
        render(h(this.part), this._element);
    }

    focus(): void {
        // noop
    }

    update(params: PanelUpdateEvent): void {
        if (this.parameters) {
            this.parameters.params = params.params;
        }

        // this.part?.update({ params: this.parameters?.params ?? {} })
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
        // this.part?.dispose()
    }
}
