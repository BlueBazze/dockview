import { DockviewApi } from '../api/component.api';
import {
    DockviewPanelApi,
    DockviewPanelApiImpl,
} from '../api/dockviewPanelApi';
import { GroupviewPanelState, IGroupPanelInitParameters } from './types';
import { DockviewGroupPanel } from './dockviewGroupPanel';
import { CompositeDisposable, IDisposable } from '../lifecycle';
import { IPanel, PanelUpdateEvent, Parameters } from '../panel/types';
import { IDockviewPanelModel } from './dockviewPanelModel';
import { DockviewComponent } from './dockviewComponent';
import { DockviewPanelRenderer } from '../overlayRenderContainer';
import { WillFocusEvent } from '../api/panelApi';

export interface IDockviewPanel extends IDisposable, IPanel {
    readonly view: IDockviewPanelModel;
    readonly group: DockviewGroupPanel;
    readonly api: DockviewPanelApi;
    readonly title: string | undefined;
    readonly params: Parameters | undefined;
    updateParentGroup(
        group: DockviewGroupPanel,
        options?: { skipSetActive?: boolean }
    ): void;
    init(params: IGroupPanelInitParameters): void;
    toJSON(): GroupviewPanelState;
    setTitle(title: string): void;
    update(event: PanelUpdateEvent): void;
    runEvents(): void;
}

export class DockviewPanel
    extends CompositeDisposable
    implements IDockviewPanel
{
    readonly api: DockviewPanelApiImpl;

    private _group: DockviewGroupPanel;
    private _params?: Parameters;
    private _title: string | undefined;
    private _renderer: DockviewPanelRenderer | undefined;

    get params(): Parameters | undefined {
        return this._params;
    }

    get title(): string | undefined {
        return this._title;
    }

    get group(): DockviewGroupPanel {
        return this._group;
    }

    get renderer(): DockviewPanelRenderer {
        return this._renderer ?? this.accessor.renderer;
    }

    constructor(
        public readonly id: string,
        private readonly accessor: DockviewComponent,
        private readonly containerApi: DockviewApi,
        group: DockviewGroupPanel,
        readonly view: IDockviewPanelModel,
        options: { renderer?: DockviewPanelRenderer }
    ) {
        super();
        this._renderer = options.renderer;
        this._group = group;

        this.api = new DockviewPanelApiImpl(this, this._group, accessor);

        this.addDisposables(
            this.api.onActiveChange(() => {
                accessor.setActivePanel(this);
            }),
            this.api.onDidSizeChange((event) => {
                // forward the resize event to the group since if you want to resize a panel
                // you are actually just resizing the panels parent which is the group
                this.group.api.setSize(event);
            }),
            this.api.onDidRendererChange((event) => {
                this.group.model.rerender(this);
            })
        );
    }

    public init(params: IGroupPanelInitParameters): void {
        this._params = params.params;

        this.view.init({
            ...params,
            api: this.api,
            containerApi: this.containerApi,
        });

        this.setTitle(params.title);
    }

    focus(): void {
        const event = new WillFocusEvent();
        this.api._onWillFocus.fire(event);

        if (event.defaultPrevented) {
            return;
        }

        if (!this.api.isActive) {
            this.api.setActive();
        }
    }

    public toJSON(): GroupviewPanelState {
        return <GroupviewPanelState>{
            id: this.id,
            contentComponent: this.view.contentComponent,
            tabComponent: this.view.tabComponent,
            params:
                Object.keys(this._params || {}).length > 0
                    ? this._params
                    : undefined,
            title: this.title,
            renderer: this._renderer,
        };
    }

    setTitle(title: string): void {
        const didTitleChange = title !== this.title;

        if (didTitleChange) {
            this._title = title;

            this.view.update({
                params: {
                    params: this._params,
                    title: this.title,
                },
            });
            this.api._onDidTitleChange.fire({ title });
        }
    }

    setRenderer(renderer: DockviewPanelRenderer): void {
        const didChange = renderer !== this.renderer;

        if (didChange) {
            this._renderer = renderer;
            this.api._onDidRendererChange.fire({
                renderer: renderer,
            });
        }
    }

    public update(event: PanelUpdateEvent): void {
        // merge the new parameters with the existing parameters
        this._params = {
            ...(this._params ?? {}),
            ...event.params,
        };

        /**
         * delete new keys that have a value of undefined,
         * allow values of null
         */
        for (const key of Object.keys(event.params)) {
            if (event.params[key] === undefined) {
                delete this._params[key];
            }
        }

        // update the view with the updated props
        this.view.update({
            params: {
                params: this._params,
                title: this.title,
            },
        });
    }

    public updateParentGroup(
        group: DockviewGroupPanel,
        options?: { skipSetActive?: boolean }
    ): void {
        this._group = group;
        this.api.group = this._group;

        const isPanelVisible = this._group.model.isPanelActive(this);
        const isActive = this.group.api.isActive && isPanelVisible;

        if (!options?.skipSetActive) {
            if (this.api.isActive !== isActive) {
                this.api._onDidActiveChange.fire({
                    isActive: this.group.api.isActive && isPanelVisible,
                });
            }
        }

        if (this.api.isVisible !== isPanelVisible) {
            this.api._onDidVisibilityChange.fire({
                isVisible: isPanelVisible,
            });
        }
    }

    runEvents(): void {
        const isPanelVisible = this._group.model.isPanelActive(this);

        const isActive = this.group.api.isActive && isPanelVisible;

        if (this.api.isActive !== isActive) {
            this.api._onDidActiveChange.fire({
                isActive: this.group.api.isActive && isPanelVisible,
            });
        }

        if (this.api.isVisible !== isPanelVisible) {
            this.api._onDidVisibilityChange.fire({
                isVisible: isPanelVisible,
            });
        }
    }

    public layout(width: number, height: number): void {
        // TODO: Can we somehow do height without header height or indicate what the header height is?
        this.api._onDidDimensionChange.fire({
            width,
            height: height,
        });

        this.view.layout(width, height);
    }

    public dispose(): void {
        this.api.dispose();
        this.view.dispose();
    }
}
