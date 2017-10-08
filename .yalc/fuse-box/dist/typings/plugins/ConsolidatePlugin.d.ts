import { Plugin, WorkFlowContext } from '../core/WorkflowContext';
import { File } from '../core/File';
export interface IConsolidatePluginOptions {
    engine: string;
    extension?: string;
    useDefault?: boolean;
}
export declare class ConsolidatePluginClass implements Plugin {
    test: RegExp;
    private extension;
    private engine;
    private useDefault;
    constructor(options: IConsolidatePluginOptions);
    init(context: WorkFlowContext): void;
    transform(file: File): Promise<void>;
}
export declare const ConsolidatePlugin: (options: IConsolidatePluginOptions) => ConsolidatePluginClass;
