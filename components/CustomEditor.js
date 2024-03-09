// components/custom-editor.js

import React from 'react';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

const editorConfiguration = {
    skin: 'office2013',
    preset: 'standard',
    toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo'
    ],
    image: {
        toolbar: [
            'imageTextAlternative',
            '|',
            'imageStyle:full',
            'imageStyle:side',
            '|',
            'imageResize',
            '|',
            'imageUpload',
            'imageInsertURL'
        ],
        styles: [
            'full',
            'side'
        ]
    },
};

function CustomEditor(props) {
    return (
        <CKEditor
            editor={Editor}
            config={editorConfiguration}
            data={props.initialData}
            onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
                props.onChange(data)
            }}
        />
    )
}

export default CustomEditor;
