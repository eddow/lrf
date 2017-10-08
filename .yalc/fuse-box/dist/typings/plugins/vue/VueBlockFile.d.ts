import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";
import { IPathInformation } from '../../core/PathMaster';
export declare abstract class VueBlockFile extends File {
    context: WorkFlowContext;
    info: IPathInformation;
    block: any;
    scopeId: string;
    pluginChain: Plugin[];
    constructor(context: WorkFlowContext, info: IPathInformation, block: any, scopeId: string, pluginChain: Plugin[]);
    setPluginChain(block: any, pluginChain: Plugin[]): Promise<never>;
    loadContents(): void;
    abstract process(): Promise<void>;
}
