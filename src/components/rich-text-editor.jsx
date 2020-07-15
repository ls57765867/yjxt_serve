import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { ContentUtils } from 'braft-utils'
import config from "../config/config";
import {Upload} from 'antd'

export default class RichTextEdit extends React.Component {
    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null)
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.htmlContent){
            this.setState({
                editorState: BraftEditor.createEditorState(nextProps.htmlContent)
            })
        }
    }

    getContent = () => {
        return this.state.editorState.toHTML();
    };

    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        console.log(this.state.editorState.toHTML());
    };

    handleEditorChange = (editorState) => {
        this.setState({editorState})
    };

    controls = [
        'undo', 'redo', 'separator',
        'font-size', 'line-height', 'letter-spacing', 'separator',
        'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
        'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
        'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
        'link', 'separator', 'hr', 'separator', 'separator',
        'clear'
    ]

    uploadHandler = (info) => {

        if (info.file.status === 'done' && info.file.response.status === 1) {

            let name = info.file.response.data.name
            this.setState({
                editorState: ContentUtils.insertMedias(this.state.editorState, [{
                    type: 'IMAGE',
                    url: config.database_URL + name
                }])
            })

        }
    }

    extendControls = [
        {
            key: 'antd-uploader',
            type: 'component',
            component: (
                <Upload
                    name={this.props.imgName}
                    accept="image/*"
                    action={this.props.upLoadAction}
                    showUploadList={false}
                    onChange={this.uploadHandler}
                >
                    <button type="button" className="control-item button upload-button" data-title="插入图片">
                        插入图片
                    </button>
                </Upload>
            )
        }
    ]

    render() {
        const {editorState} = this.state;
        return (
            <div className="my-component">
                <BraftEditor
                    value={editorState}
                    controls={this.controls}
                    style={{border: '1px solid lightgray'}}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                    extendControls={this.extendControls}
                />
            </div>
        )
    }

}