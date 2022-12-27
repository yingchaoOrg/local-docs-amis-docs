import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface ICmptAction extends ListenerAction {
  actionType:
    | 'setValue'
    | 'static'
    | 'nonstatic'
    | 'show'
    | 'visibility'
    | 'hidden'
    | 'enabled'
    | 'disabled'
    | 'usability'
    | 'reload';
  args: {
    value?: string | {[key: string]: string};
    index?: number; // setValue支持更新指定索引的数据，一般用于数组类型
  };
}

/**
 * 组件动作
 *
 * @export
 * @class CmptAction
 * @implements {Action}
 */
export class CmptAction implements RendererAction {
  async run(
    action: ICmptAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    /**
     * 根据唯一ID查找指定组件
     * 触发组件未指定id或未指定响应组件componentId，则使用触发组件响应
     */
    const component =
      action.componentId && renderer.props.$schema.id !== action.componentId
        ? event.context.scoped?.getComponentById(action.componentId)
        : renderer;
    const dataMergeMode = action.dataMergeMode || 'merge';

    // 显隐&状态控制
    if (['show', 'hidden', 'visibility'].includes(action.actionType)) {
      let visibility =
        action.actionType === 'visibility'
          ? action.args?.value
          : action.actionType === 'show';
      return renderer.props.topStore.setVisible(action.componentId, visibility);
    } else if (['static', 'nonstatic'].includes(action.actionType)) {
      return renderer.props.topStore.setStatic(
        action.componentId,
        action.actionType === 'static'
      );
    } else if (
      ['enabled', 'disabled', 'usability'].includes(action.actionType)
    ) {
      let usability =
        action.actionType === 'usability'
          ? !action.args?.value
          : action.actionType === 'disabled';
      return renderer.props.topStore.setDisable(action.componentId, usability);
    }

    // 数据更新
    if (action.actionType === 'setValue') {
      if (component?.setData) {
        return component?.setData(
          action.args?.value,
          dataMergeMode === 'override',
          action.args?.index
        );
      } else {
        return component?.props.onChange?.(action.args?.value);
      }
    }

    // 刷新
    if (action.actionType === 'reload') {
      return component?.reload?.(
        undefined,
        action.data,
        undefined,
        undefined,
        dataMergeMode === 'override',
        action.args
      );
    }

    // 执行组件动作
    return component?.doAction?.(action, action.args);
  }
}

registerAction('component', new CmptAction());
