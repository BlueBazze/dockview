import {
    GridviewApi,
    GridviewReact,
    GridviewReadyEvent,
    IGridviewPanelProps,
    Orientation,
    PanelCollection,
} from 'dockview';
import * as React from 'react';
import { Story, Meta } from '@storybook/react';
import 'dockview/dist/styles.css';

const components: PanelCollection<IGridviewPanelProps> = {
    default: (props) => {
        return (
            <div style={{ backgroundColor: props.color, height: '100%' }}>
                hello world
            </div>
        );
    },
};

export const Simple = (props: { orientation: Orientation }) => {
    const api = React.useRef<GridviewApi>();

    const onReady = (event: GridviewReadyEvent) => {
        event.api.layout(window.innerWidth, window.innerHeight);
        api.current = event.api;

        event.api.fromJSON({
            grid: {
                height: 2,
                width: 2,
                orientation: props.orientation,
                root: {
                    type: 'branch',
                    data: [
                        {
                            type: 'leaf',
                            data: {
                                id: 'panel1',
                                component: 'default',
                                params: { color: 'red' },
                                minimumHeight: 50,
                                minimumWidth: 50,
                            },
                            size: 1,
                        },
                        {
                            type: 'leaf',
                            data: {
                                id: 'panel2',
                                component: 'default',
                                params: { color: 'green' },
                                minimumHeight: 50,
                                minimumWidth: 50,
                            },
                            size: 1,
                        },
                    ],
                },
            },
        });

        return;

        event.api.addPanel({
            id: 'panel_1',
            component: 'default',
            params: { color: 'red' },
            minimumHeight: 50,
            minimumWidth: 50,
        });
        event.api.addPanel({
            id: 'panel_2',
            component: 'default',
            params: { color: 'green' },
            minimumHeight: 50,
            minimumWidth: 50,
            position: { reference: 'panel_1', direction: 'right' },
        });
        event.api.addPanel({
            id: 'panel_3',
            component: 'default',
            params: { color: 'purple' },
            minimumHeight: 50,
            minimumWidth: 50,
            position: { reference: 'panel_2', direction: 'below' },
        });
        event.api.addPanel({
            id: 'panel_4',
            component: 'default',
            params: { color: 'yellow' },
            minimumHeight: 50,
            minimumWidth: 50,
            position: { reference: 'panel_3', direction: 'right' },
        });
        event.api.addPanel({
            id: 'panel_5',
            component: 'default',
            params: { color: 'dodgerblue' },
            minimumHeight: 50,
            minimumWidth: 50,
            position: { reference: 'panel_4', direction: 'below' },
        });
    };

    React.useEffect(() => {
        window.addEventListener('resize', () => {
            api.current?.layout(window.innerWidth, window.innerHeight);
        });
    }, []);

    return (
        <GridviewReact
            onReady={onReady}
            orientation={props.orientation}
            components={components}
        />
    );
};

export default {
    title: 'Gridview',
    component: Simple,
    decorators: [
        (Component) => {
            document.body.style.padding = '0px';
            return (
                <div style={{ height: '100vh' }}>
                    <Component />
                </div>
            );
        },
    ],
    args: { orientation: Orientation.VERTICAL },
    argTypes: {
        orientation: {
            control: {
                type: 'inline-radio',
                options: [Orientation.HORIZONTAL, Orientation.VERTICAL],
            },
        },
    },
} as Meta;
