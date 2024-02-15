import type {
    DockviewApi,
    DockviewComponent,
    DockviewDndOverlayEvent,
    DockviewDropEvent,
} from 'dockview-core';
import type { VNodeRef } from 'vue';
import type {
    IDockviewPanelHeaderProps,
    IDockviewPanelProps,
    PanelCollection,
} from './panel';

export interface DockviewReadyEvent {
    api: DockviewApi;
}

export interface IDockviewVueProps {
    // onReady: (event: DockviewReadyEvent) => void
    components: PanelCollection<IDockviewPanelProps>;
    tabComponents?: PanelCollection<IDockviewPanelHeaderProps>;
    // watermarkComponent?: React.FunctionComponent<IWatermarkPanelProps>;
    onDidDrop?: (event: DockviewDropEvent) => void;
    showDndOverlay?: (event: DockviewDndOverlayEvent) => boolean;
    hideBorders?: boolean;
    className?: string;
    disableAutoResizing?: boolean;
    // defaultTabComponent?: React.FunctionComponent<IDockviewPanelHeaderProps>;
    // rightHeaderActionsComponent?: React.FunctionComponent<IDockviewHeaderActionsProps>;
    // leftHeaderActionsComponent?: React.FunctionComponent<IDockviewHeaderActionsProps>;
    // prefixHeaderActionsComponent?: React.FunctionComponent<IDockviewHeaderActionsProps>;
    singleTabMode?: 'fullwidth' | 'default';
    disableFloatingGroups?: boolean;
    floatingGroupBounds?:
        | 'boundedWithinViewport'
        | {
              minimumHeightWithinViewport?: number;
              minimumWidthWithinViewport?: number;
          };
}

export interface IDockviewVueData {
    domRef: VNodeRef | undefined;
    api: DockviewApi | undefined;
    instance: DockviewComponent | undefined;
    observer: ResizeObserver | undefined;
}
