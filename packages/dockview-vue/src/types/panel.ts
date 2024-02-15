import type { DockviewApi, DockviewPanelApi, Parameters } from 'dockview-core';
import type { Component } from 'vue';

export interface PanelCollection<T extends object> {
    [name: string]: Component<T>;
}

export interface PanelParameters<T extends object = Parameters> {
    params: T;
}

export type IDockviewPanelProps<T extends { [index: string]: any } = any> =
    IGroupPanelBaseProps<T>;

export type IDockviewPanelHeaderProps<
    T extends { [index: string]: any } = any
> = IGroupPanelBaseProps<T>;

export interface IGroupPanelBaseProps<T extends { [index: string]: any } = any>
    extends PanelParameters<T> {
    api: DockviewPanelApi;
    containerApi: DockviewApi;
}
